// frontend/js/estudo.js

/**
 * ESTUDO - Módulo de gerenciamento da sessão de estudo
 * 
 * Responsabilidades:
 * - Gerenciar a sessão de estudo de uma matéria
 * - Controlar o flashcard atual
 * - Gerenciar a fila de flashcards
 * - Comunicar respostas para a API
 * - Atualizar a interface durante o estudo
 * 
 * Dependências:
 * - api.js (para comunicação com o Back-End)
 * - components/flashcard.js (para renderizar flashcards)
 */

import { get, post, isModoSimulacao } from './api.js';
import { flashcardComponent } from './components/flashcard.js';

/**
 * Classe para gerenciar a sessão de estudo
 */
export class Estudo {
    constructor() {
        this.materia = null;
        this.flashcards = [];
        this.flashcardAtual = null;
        this.indiceAtual = 0;
        this.estaRespondendo = false;
        this.container = document.getElementById('estudo-container');
        this.infoContainer = document.getElementById('estudo-info');
        this.loading = false;
    }

   // frontend/js/estudo.js

/**
 * Inicia uma sessão de estudo para uma matéria
 * @param {object} materia - Objeto da matéria
 */
async iniciar(materia) {
    this.materia = materia;
    this.loading = true;
    
    console.log(`📖 [ESTUDO] Iniciando: ${materia.nome} (${isModoSimulacao() ? 'SIMULAÇÃO' : 'API REAL'})`);

    try {
        this.mostrarLoading();

        // ⭐ Busca flashcards da matéria
        const endpoint = `/materias/${materia.id}/flashcards`;
        console.log(`📡 [ESTUDO] Buscando: ${endpoint}`);
        
        const resposta = await get(endpoint);
        console.log(`📦 [ESTUDO] Resposta bruta:`, resposta);

        // ⭐ VALIDAÇÃO: Verifica se a resposta é um array
        if (!Array.isArray(resposta)) {
            console.error('❌ [ESTUDO] Resposta não é um array:', resposta);
            this.mostrarMensagem('❌ Erro: Dados inválidos recebidos da API.');
            this.loading = false;
            return;
        }

        // ⭐ VALIDAÇÃO: Filtra flashcards válidos
        this.flashcards = resposta.filter(f => {
            const valido = f && typeof f === 'object' && f.pergunta && f.resposta;
            if (!valido) {
                console.warn('⚠️ [ESTUDO] Flashcard inválido ignorado:', f);
            }
            return valido;
        });

        // ⭐ CORREÇÃO: Se não encontrou com 'pergunta', tenta com 'question'
        if (this.flashcards.length === 0 && resposta.length > 0) {
            console.log('🔄 [ESTUDO] Tentando converter campos (question/answer)');
            this.flashcards = resposta
                .filter(f => f && typeof f === 'object')
                .map(f => ({
                    id: f.id || f.flashcard_id || 0,
                    pergunta: f.pergunta || f.question || f.pergunta_text || 'Pergunta não disponível',
                    resposta: f.resposta || f.answer || f.resposta_text || 'Resposta não disponível'
                }))
                .filter(f => f.pergunta !== 'Pergunta não disponível');
        }

        if (this.flashcards.length === 0) {
            console.warn('⚠️ [ESTUDO] Nenhum flashcard válido encontrado');
            this.mostrarMensagem('⚠️ Nenhum flashcard disponível para esta matéria.');
            this.loading = false;
            return;
        }

        console.log(`✅ [ESTUDO] ${this.flashcards.length} flashcards carregados`);
        console.log(`📝 [ESTUDO] Primeiro flashcard:`, this.flashcards[0]);

        // Reinicia o estado
        this.indiceAtual = 0;
        this.estaRespondendo = false;
        
        // Mostra o primeiro flashcard
        this.mostrarFlashcard();
        this.loading = false;

    } catch (error) {
        console.error('❌ [ESTUDO] Erro ao iniciar:', error);
        this.mostrarMensagem(`❌ Erro ao carregar flashcards: ${error.message}`);
        this.loading = false;
    }
}

    /**
     * Mostra o flashcard atual
     */
    mostrarFlashcard() {
        if (this.indiceAtual >= this.flashcards.length) {
            this.concluirEstudo();
            return;
        }

        this.flashcardAtual = this.flashcards[this.indiceAtual];
        this.estaRespondendo = false;

        // ⭐ DEBUG: Verifica o flashcard atual
        console.log(`🃏 [ESTUDO] Flashcard ${this.indiceAtual + 1}/${this.flashcards.length}:`, this.flashcardAtual);

        // ⭐ VALIDAÇÃO: Verifica se o flashcard tem os campos necessários
        if (!this.flashcardAtual) {
            console.error('❌ [ESTUDO] Flashcard atual é null/undefined');
            this.mostrarMensagem('❌ Erro: Flashcard inválido');
            return;
        }

        if (!this.flashcardAtual.pergunta) {
            console.error('❌ [ESTUDO] Flashcard sem pergunta:', this.flashcardAtual);
            // Tenta corrigir: se tiver 'question' em vez de 'pergunta'
            if (this.flashcardAtual.question) {
                this.flashcardAtual.pergunta = this.flashcardAtual.question;
            }
            if (this.flashcardAtual.answer) {
                this.flashcardAtual.resposta = this.flashcardAtual.answer;
            }
        }

        // Atualiza informações
        this.atualizarInfo();

        // Renderiza o flashcard
        flashcardComponent.renderizar(this.flashcardAtual);
        
        // Configura eventos dos botões
        this.configurarEventos();
    }

    /**
     * Atualiza as informações da sessão (progresso, contador)
     */
    atualizarInfo() {
        if (!this.infoContainer) return;

        const total = this.flashcards.length;
        const atual = this.indiceAtual + 1;
        const progresso = Math.round((this.indiceAtual / total) * 100);

        this.infoContainer.innerHTML = `
            <div class="estudo-info">
                <span class="materia-titulo">📚 ${this.materia.nome}</span>
                <span class="progresso-texto">${atual} / ${total} flashcards</span>
                <div class="progresso-bar">
                    <div class="progresso-fill" style="width: ${progresso}%"></div>
                </div>
            </div>
        `;
    }

    /**
     * Configura os eventos dos botões do flashcard
     */
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

    /**
     * Mostra a resposta do flashcard atual
     */
    mostrarResposta() {
        if (this.estaRespondendo) return;
        this.estaRespondendo = true;
        
        flashcardComponent.mostrarResposta();
        
        // Habilita os botões de resposta
        const btnAcertou = document.getElementById('btn-acertou');
        const btnErrou = document.getElementById('btn-errou');
        if (btnAcertou) btnAcertou.disabled = false;
        if (btnErrou) btnErrou.disabled = false;
    }

    /**
     * Envia uma resposta para a API
     * @param {boolean} acertou - Se o usuário acertou ou não
     */
    async responder(acertou) {
        if (!this.flashcardAtual) return;

        // Desabilita os botões para evitar múltiplos cliques
        const btnAcertou = document.getElementById('btn-acertou');
        const btnErrou = document.getElementById('btn-errou');
        if (btnAcertou) btnAcertou.disabled = true;
        if (btnErrou) btnErrou.disabled = true;

        console.log(`📝 [ESTUDO] Resposta: ${acertou ? '✅ Acertou' : '❌ Errou'}`);

        try {
            // Envia resposta para a API
            const resultado = await post(`/flashcards/${this.flashcardAtual.id}/responder`, {
                acertou: acertou
            });

            console.log('✅ [ESTUDO] Resposta registrada:', resultado);

            // Feedback visual
            flashcardComponent.mostrarFeedback(acertou);

            // Aguarda um momento para o usuário ver o feedback
            await this.aguardar(800);

            // Avança para o próximo flashcard
            this.indiceAtual++;
            this.mostrarFlashcard();

        } catch (error) {
            console.error('❌ [ESTUDO] Erro ao enviar resposta:', error);
            flashcardComponent.mostrarErro('Erro ao registrar resposta. Tente novamente.');
            
            // Reabilita os botões
            if (btnAcertou) btnAcertou.disabled = false;
            if (btnErrou) btnErrou.disabled = false;
        }
    }

    /**
     * Conclui o estudo da matéria
     */
    concluirEstudo() {
        console.log('🎉 [ESTUDO] Estudo concluído!');
        flashcardComponent.limpar();
        
        if (this.infoContainer) {
            this.infoContainer.innerHTML = `
                <div class="estudo-concluido">
                    <h3>🎉 Estudo concluído!</h3>
                    <p>Você completou todos os flashcards de ${this.materia.nome}.</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">
                        Voltar para matérias
                    </button>
                </div>
            `;
        }
    }

    /**
     * Mostra uma mensagem no container
     * @param {string} mensagem - Mensagem a ser exibida
     */
    mostrarMensagem(mensagem) {
        if (this.container) {
            this.container.innerHTML = `<p class="mensagem">${mensagem}</p>`;
        }
    }

    /**
     * Mostra indicador de carregamento
     */
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

    /**
     * Função auxiliar para aguardar um tempo (simula delay)
     * @param {number} ms - Milissegundos para aguardar
     * @returns {Promise}
     */
    aguardar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Cria e exporta uma instância única
export const estudo = new Estudo();