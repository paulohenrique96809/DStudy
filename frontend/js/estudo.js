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

        try {
            this.mostrarLoading();

            const resposta = await get(`/materias/${materia.id}/flashcards?usuario_id=${this.usuarioId}`);
            
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
        
        // ⭐ RENDERIZA COM CALLBACK
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

    /**
     * ⭐ RESPONDE - ENVIA A LETRA ESCOLHIDA PARA O BACK-END
     * 
     * @param {string} letraEscolhida - 'a', 'b', 'c' ou 'd'
     */
    async responder(letraEscolhida) {
        if (this.estaRespondendo || !this.flashcardAtual) return;
        this.estaRespondendo = true;

        console.log(`📝 [ESTUDO] Resposta: letra "${letraEscolhida}"`);

        try {
            // ⭐ MONTA O PAYLOAD NO FORMATO DA INGREDY
            const payload = {
                usuario_id: this.usuarioId,
                flashcard_id: this.flashcardAtual.id,
                resposta: letraEscolhida  // ⭐ Só a letra!
            };

            console.log('📤 [ESTUDO] Enviando para /responder:', payload);

            const resultado = await post('/responder', payload);

            console.log('✅ [ESTUDO] Resposta registrada:', resultado);
            // resultado esperado: { acertou, correta, dominado, acertos_consecutivos }

            // ⭐ MOSTRA O RESULTADO NO VERSO DO CARD
            flashcardComponent.mostrarResultado(resultado.acertou, {
                correta: resultado.correta || '?',
                dominado: resultado.dominado,
                sequencia: resultado.acertos_consecutivos
            });

            // ⭐ MOSTRA O FEEDBACK
            flashcardComponent.mostrarFeedback(resultado.acertou, {
                dominado: resultado.dominado,
                sequencia: resultado.acertos_consecutivos
            });

            // Aguarda o usuário ver o feedback
            await this.aguardar(2500);

            // Recarrega progresso
            await progresso.carregar();
            materias.renderizar();

            // Prepara para o próximo
            flashcardComponent.prepararProximo();

            // Avança
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