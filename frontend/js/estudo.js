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
        
<<<<<<< Updated upstream
        // ⭐ USUÁRIO FIXO (temporário até ter login)
        
        console.log('📖 [ESTUDO] Container:', this.container);
=======
        // ⭐ Usuário fixo temporário (1)
        this.usuarioId = 1;
>>>>>>> Stashed changes
    }

    async iniciar(materia) {
        this.materia = materia;
        console.log(`📖 [ESTUDO] Iniciando: ${materia.nome}`);

        flashcardComponent.limpar();
        this.flashcards = [];
        this.flashcardAtual = null;
        this.indiceAtual = 0;
        this.estaRespondendo = false;

        try {
            this.mostrarLoading();

<<<<<<< Updated upstream
            const url = `/materias/${materia.id}/flashcards`;
=======
            // ⭐ Busca a fila de flashcards disponíveis no Back-End
            const url = `/materias/${materia.id}/flashcards?usuario_id=${this.usuarioId}`;
>>>>>>> Stashed changes
            const resposta = await get(url);
            
            if (!Array.isArray(resposta) || resposta.length === 0) {
                this.mostrarMensagem('🎉 Você já dominou todos os flashcards desta matéria!');
                return;
            }

            this.flashcards = resposta.filter(f => f && f.pergunta);

            if (this.flashcards.length === 0) {
                this.mostrarMensagem('⚠️ Nenhum flashcard válido.');
                return;
            }

            console.log(`✅ [ESTUDO] ${this.flashcards.length} flashcards carregados`);
            
            this.esconderContainer();
            this.mostrarFlashcard();

        } catch (error) {
            console.error('❌ [ESTUDO] Erro:', error);
            this.mostrarMensagem('❌ Erro ao carregar flashcards.');
        }
    }

    mostrarFlashcard() {
        // Se chegou ao fim da fila atual
        if (this.indiceAtual >= this.flashcards.length) {
            this.fimDaFila();
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

        try {
            const payload = {
                usuario_id: this.usuarioId,
                flashcard_id: this.flashcardAtual.id,
                resposta: letraEscolhida
            };

            const resultado = await post('/responder', payload);

            flashcardComponent.mostrarResultado(resultado.acertou, {
                correta: resultado.correta || null,
                dominado: resultado.dominado,
                sequencia: resultado.acertos_consecutivos
            });

            flashcardComponent.mostrarFeedback(resultado.acertou, {
                dominado: resultado.dominado,
                sequencia: resultado.acertos_consecutivos
            });

            // Aguarda um tempo para o usuário ler o feedback
            await this.aguardar(2000);

<<<<<<< Updated upstream
=======
            // Atualiza o progresso geral
>>>>>>> Stashed changes
            await progresso.carregarTudo(materias.lista);
            materias.renderizar();

            flashcardComponent.prepararProximo();

            // Avança para o próximo
            this.indiceAtual++;
            this.mostrarFlashcard();

        } catch (error) {
            console.error('❌ [ESTUDO] Erro ao registrar:', error);
            flashcardComponent.mostrarErro(`Erro: ${error.message}`);
            this.estaRespondendo = false;
        }
    }

    /**
     * ⭐ NOVO MÉTODO (P10): Fim da fila
     * Chamado quando o usuário termina os flashcards da sessão atual.
     * Em vez de "Concluir" e travar, verifica se tem mais no Back-End.
     */
    async fimDaFila() {
        console.log('🏁 [ESTUDO] Fim da fila atual. Verificando se há mais flashcards...');

        // Esconde o flashcard
        flashcardComponent.limpar();

        // Verifica no Back-End se existem mais flashcards disponíveis
        try {
            const url = `/materias/${this.materia.id}/flashcards?usuario_id=${this.usuarioId}`;
            const proximosFlashcards = await get(url);

            // Se o Back-End retornar uma lista vazia, significa que o usuário dominou tudo
            if (!Array.isArray(proximosFlashcards) || proximosFlashcards.length === 0) {
                this.concluirMateria();
                return;
            }

            // Se ainda existem flashcards em espera, mostra a tela de "Rodada concluída"
            this.mostrarTelaRodadaConcluida(proximosFlashcards.length);

        } catch (error) {
            console.error('❌ [ESTUDO] Erro ao verificar novos flashcards:', error);
            this.mostrarMensagem('❌ Erro ao verificar a fila de estudos.');
        }
    }

    /**
     * ⭐ NOVO MÉTODO (P10): Tela de rodada concluída
     */
    mostrarTelaRodadaConcluida(restantes) {
        this.mostrarContainer();
        
        if (this.infoContainer) {
            this.infoContainer.innerHTML = '';
        }

        if (this.container) {
            this.container.innerHTML = `
                <div class="estudo-concluido">
                    <h3>🎉 Rodada concluída!</h3>
                    <p>Você respondeu todos os flashcards disponíveis agora.</p>
                    <p>Ainda faltam <strong>${restantes}</strong> flashcards para você dominar esta matéria.</p>
                    <p style="font-size: 14px; color: #666; margin-top: 20px;">
                        💡 Os flashcards que você errou ou ainda não dominou voltarão a aparecer em breve.
                    </p>
                    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                        <button class="btn btn-primary" onclick="window.location.reload()">
                            🔄 Recomeçar
                        </button>
                        <button class="btn btn-secondary" onclick="window.history.back()">
                            📚 Voltar para matérias
                        </button>
                    </div>
                </div>
            `;
        }
    }

    /**
     * ⭐ NOVO MÉTODO (P10): Matéria 100% concluída
     */
    concluirMateria() {
        console.log('🏆 [ESTUDO] Matéria 100% dominada!');
        this.mostrarContainer();
        
        if (this.infoContainer) {
            this.infoContainer.innerHTML = '';
        }

        if (this.container) {
            this.container.innerHTML = `
                <div class="estudo-concluido">
                    <h3>🏆 Parabéns!</h3>
                    <p>Você dominou <strong>todos</strong> os flashcards desta matéria!</p>
                    <button class="btn btn-primary" onclick="window.history.back()">
                        📚 Voltar para matérias
                    </button>
                </div>
            `;
        }
    }

    // ===== CONTROLE DE VISIBILIDADE =====
    
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