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
        
        // ⭐ USUÁRIO FIXO (temporário até ter login)
        this.usuarioId = 1;
        
        console.log('📖 [ESTUDO] Container:', this.container);
    }

    async iniciar(materia) {
        this.materia = materia;
        console.log(`📖 [ESTUDO] Iniciando: ${materia.nome}`);

        // ⭐ LIMPA O COMPONENTE DE FLASHCARD ANTES DE INICIAR
        flashcardComponent.limpar();

        // ⭐ RESETA O ESTADO
        this.flashcards = [];
        this.flashcardAtual = null;
        this.indiceAtual = 0;
        this.estaRespondendo = false;

        try {
            // Mostra o loading
            this.mostrarLoading();

            const url = `/materias/${materia.id}/flashcards?usuario_id=${this.usuarioId}`;
            const resposta = await get(url);
            
            if (!Array.isArray(resposta) || resposta.length === 0) {
                this.mostrarMensagem('⚠️ Nenhum flashcard disponível.');
                return;
            }

            this.flashcards = resposta.filter(f => f && f.pergunta);

            if (this.flashcards.length === 0) {
                this.mostrarMensagem('⚠️ Nenhum flashcard válido.');
                return;
            }

            console.log(`✅ [ESTUDO] ${this.flashcards.length} flashcards carregados`);
            
            // Esconde o container de loading
            this.esconderContainer();
            
            // Mostra o primeiro flashcard
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
        
        flashcardComponent.renderizar(this.flashcardAtual, {
            onRevelar: (flashcard) => this._aoRevelar(flashcard),
            onResponder: (letraEscolhida) => this.responder(letraEscolhida)
        });
    }

    _aoRevelar(flashcard) {
        console.log(`👁️ [ESTUDO] Resposta revelada: ${flashcard.id}`);
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

    async responder(letraEscolhida) {
        if (this.estaRespondendo || !this.flashcardAtual) return;
        this.estaRespondendo = true;

        console.log(`📝 [ESTUDO] Resposta: letra "${letraEscolhida}"`);

        try {
            const payload = {
                usuario_id: this.usuarioId,
                flashcard_id: this.flashcardAtual.id,
                resposta: letraEscolhida
            };

            console.log('📤 [ESTUDO] Enviando para /responder:', payload);

            const resultado = await post('/responder', payload);

            console.log('✅ [ESTUDO] Resposta registrada:', resultado);

            flashcardComponent.mostrarResultado(resultado.acertou, {
                correta: resultado.correta || null,
                dominado: resultado.dominado,
                sequencia: resultado.acertos_consecutivos
            });

            flashcardComponent.mostrarFeedback(resultado.acertou, {
                dominado: resultado.dominado,
                sequencia: resultado.acertos_consecutivos
            });

            await this.aguardar(2500);

            await progresso.carregarTudo(materias.lista);
            materias.renderizar();

            // ⭐ PREPARA O PRÓXIMO FLASHCARD (reseta o estado do componente)
            flashcardComponent.prepararProximo();

            this.indiceAtual++;
            this.mostrarFlashcard();

        } catch (error) {
            console.error('❌ [ESTUDO] Erro ao registrar:', error);
            flashcardComponent.mostrarErro(`Erro: ${error.message || 'Não foi possível registrar'}`);
            this.estaRespondendo = false;
        }
    }

    concluirEstudo() {
        console.log('🎉 [ESTUDO] Estudo concluído!');
        flashcardComponent.mostrarConclusao(this.materia.nome);
        this.esconderContainer();
    }

    // ============================================================
    // ⭐ MÉTODOS DE VISIBILIDADE
    // ============================================================

    esconderContainer() {
        if (this.container) {
            this.container.style.display = 'none';
            this.container.innerHTML = '';
        }
    }

    mostrarContainer() {
        if (this.container) {
            this.container.style.display = 'block';
        }
    }

    mostrarMensagem(mensagem) {
        this.mostrarContainer();
        if (this.container) {
            this.container.innerHTML = `<p class="empty-state">${mensagem}</p>`;
        }
        if (this.infoContainer) {
            this.infoContainer.innerHTML = '';
        }
    }

    mostrarLoading() {
        this.mostrarContainer();
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