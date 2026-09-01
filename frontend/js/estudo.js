// frontend/js/estudo.js

import { get, post } from './api.js';
import { flashcardComponent } from './components/flashcard.js';
import { progresso } from './progresso.js';
import { materias } from './materias.js';

export class Estudo {
    constructor() {
        this.materia = null;
        this.flashcards = [];
        this.flashcardAtual = null;
        this.indiceAtual = 0;
        this.estaRespondendo = false;
        this.container = document.getElementById('estudo-container');
        this.infoContainer = document.getElementById('estudo-info');
        console.log('📖 [ESTUDO] Container:', this.container);
    }

    async iniciar(materia) {
        this.materia = materia;
        console.log(`📖 [ESTUDO] Iniciando: ${materia.nome}`);

        try {
            this.mostrarLoading();

            const resposta = await get(`/materias/${materia.id}/flashcards`);
            
            if (!Array.isArray(resposta) || resposta.length === 0) {
                this.mostrarMensagem('⚠️ Nenhum flashcard disponível.');
                return;
            }

            this.flashcards = resposta.filter(f => f && f.pergunta && f.resposta);

            if (this.flashcards.length === 0) {
                this.mostrarMensagem('⚠️ Nenhum flashcard válido.');
                return;
            }

            console.log(`✅ [ESTUDO] ${this.flashcards.length} flashcards carregados`);
            this.indiceAtual = 0;
            this.estaRespondendo = false;
            this.mostrarFlashcard();

        } catch (error) {
            console.error('❌ [ESTUDO] Erro:', error);
            this.mostrarMensagem('❌ Erro ao carregar flashcards.');
        }
    }

    mostrarFlashcard() {
        if (this.indiceAtual >= this.flashcards.length) {
            this.concluirEstudo();
            return;
        }

        this.flashcardAtual = this.flashcards[this.indiceAtual];
        this.estaRespondendo = false;

        this.atualizarInfo();
        flashcardComponent.renderizar(this.flashcardAtual);
        this.configurarEventos();
    }

    atualizarInfo() {
        if (!this.infoContainer) return;

        const total = this.flashcards.length;
        const atual = this.indiceAtual + 1;
        const progressoEstudo = Math.round((this.indiceAtual / total) * 100);

        this.infoContainer.innerHTML = `
            <div class="estudo-info">
                <span class="materia-titulo">📚 ${this.materia.nome}</span>
                <span class="progresso-texto">${atual} / ${total} flashcards</span>
                <div class="progresso-bar">
                    <div class="progresso-fill" style="width: ${progressoEstudo}%"></div>
                </div>
            </div>
        `;
    }

    configurarEventos() {
        const btnMostrar = document.getElementById('btn-mostrar-resposta');
        const btnAcertou = document.getElementById('btn-acertou');
        const btnErrou = document.getElementById('btn-errou');

        if (btnMostrar) {
            btnMostrar.onclick = () => this.mostrarResposta();
        }

        if (btnAcertou) {
            btnAcertou.onclick = () => this.responder(true);
        }

        if (btnErrou) {
            btnErrou.onclick = () => this.responder(false);
        }
    }

    mostrarResposta() {
        if (this.estaRespondendo) return;
        this.estaRespondendo = true;
        flashcardComponent.mostrarResposta();
    }

    async responder(acertou) {
        if (!this.flashcardAtual) return;

        const btnAcertou = document.getElementById('btn-acertou');
        const btnErrou = document.getElementById('btn-errou');
        btnAcertou.disabled = true;
        btnErrou.disabled = true;

        console.log(`📝 [ESTUDO] Resposta: ${acertou ? '✅ Acertou' : '❌ Errou'}`);

        try {
            const resultado = await post(`/flashcards/${this.flashcardAtual.id}/responder`, {
                acertou: acertou
            });

            console.log('✅ [ESTUDO] Resposta registrada:', resultado);

            // Recarrega progresso
            await progresso.carregar();
            materias.renderizar();

            flashcardComponent.mostrarFeedback(acertou);
            await this.aguardar(800);

            this.indiceAtual++;
            this.mostrarFlashcard();

        } catch (error) {
            console.error('❌ [ESTUDO] Erro:', error);
            flashcardComponent.mostrarErro('Erro ao registrar resposta.');
            btnAcertou.disabled = false;
            btnErrou.disabled = false;
        }
    }

    concluirEstudo() {
        console.log('🎉 [ESTUDO] Estudo concluído!');
        flashcardComponent.limpar();
        
        if (this.infoContainer) {
            this.infoContainer.innerHTML = `
                <div class="estudo-concluido">
                    <h3>🎉 Estudo concluído!</h3>
                    <p>Você completou todos os flashcards de ${this.materia.nome}.</p>
                    <p style="font-size: 14px; color: #666; margin-top: 10px;">💡 Use o botão de voltar do navegador para retornar.</p>
                </div>
            `;
        }
    }

    mostrarMensagem(mensagem) {
        if (this.container) {
            this.container.innerHTML = `<p class="empty-state">${mensagem}</p>`;
        }
    }

    mostrarLoading() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Carregando flashcards...</p>
                </div>
            `;
        }
    }

    aguardar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export const estudo = new Estudo();