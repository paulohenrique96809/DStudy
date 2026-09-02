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
        
        // ⭐ Renderiza o flashcard com callback
        flashcardComponent.renderizar(
            this.flashcardAtual,
            (acertou) => this.responder(acertou)
        );
    }

    atualizarInfo() {
        if (!this.infoContainer) return;

        const total = this.flashcards.length;
        const atual = this.indiceAtual + 1;
        const progressoEstudo = Math.round((this.indiceAtual / total) * 100);

        this.infoContainer.innerHTML = `
            <div class="estudo-header">
                <div class="estudo-materia">
                    <span class="materia-icone">📚</span>
                    <span class="materia-nome">${this.materia.nome}</span>
                </div>
                <div class="estudo-contador">
                    <span class="contador-atual">${atual}</span>
                    <span class="contador-separador">/</span>
                    <span class="contador-total">${total}</span>
                </div>
            </div>
            <div class="estudo-progresso">
                <div class="progresso-barra">
                    <div class="progresso-fill" style="width: ${progressoEstudo}%"></div>
                </div>
                <span class="progresso-texto">${progressoEstudo}%</span>
            </div>
        `;
    }

    async responder(acertou) {
        if (this.estaRespondendo || !this.flashcardAtual) return;
        this.estaRespondendo = true;

        console.log(`📝 [ESTUDO] Resposta: ${acertou ? '✅ Acertou' : '❌ Errou'}`);

        try {
            const resultado = await post(`/flashcards/${this.flashcardAtual.id}/responder`, {
                acertou: acertou
            });

            console.log('✅ [ESTUDO] Resposta registrada:', resultado);

            // ⭐ Mostra feedback com informações adicionais
            flashcardComponent.mostrarFeedback(acertou, resultado);

            // Aguarda um momento para o usuário ver o feedback
            await this.aguardar(1200);

            // Recarrega progresso
            await progresso.carregar();
            materias.renderizar();

            // Prepara para o próximo
            flashcardComponent.prepararProximo();

            // Avança
            this.indiceAtual++;
            this.mostrarFlashcard();

        } catch (error) {
            console.error('❌ [ESTUDO] Erro:', error);
            flashcardComponent.mostrarErro('Erro ao registrar resposta.');
            this.estaRespondendo = false;
        }
    }

    concluirEstudo() {
        console.log('🎉 [ESTUDO] Estudo concluído!');
        
        // ⭐ Mostra tela de conclusão
        flashcardComponent.mostrarConclusao(this.materia.nome);
        
        if (this.infoContainer) {
            this.infoContainer.innerHTML = `
                <div class="estudo-concluido-info">
                    <p>🎉 Parabéns! Você completou todos os flashcards de <strong>${this.materia.nome}</strong>!</p>
                </div>
            `;
        }
    }

    mostrarMensagem(mensagem) {
        if (this.container) {
            this.container.innerHTML = `<p class="empty-state">${mensagem}</p>`;
        }
        if (this.infoContainer) {
            this.infoContainer.innerHTML = '';
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