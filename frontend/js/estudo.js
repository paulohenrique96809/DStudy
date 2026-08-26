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

import { get, post } from './api.js';
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
    }

    /**
     * Inicia uma sessão de estudo para uma matéria
     * @param {object} materia - Objeto da matéria
     */
    async iniciar(materia) {
        this.materia = materia;
        console.log(`📖 Iniciando estudo de: ${materia.nome}`);

        try {
            // Busca flashcards da matéria
            // Quando o Flask estiver pronto:
            // this.flashcards = await get(`/materias/${materia.id}/flashcards`);
            
            // Dados simulados para teste
            this.flashcards = [
                { id: 1, pergunta: 'O que é uma API?', resposta: 'Interface de Programação de Aplicações' },
                { id: 2, pergunta: 'O que é REST?', resposta: 'Arquitetura para APIs web' },
                { id: 3, pergunta: 'O que é JSON?', resposta: 'Formato de dados leve para troca de informações' },
                { id: 4, pergunta: 'O que é um endpoint?', resposta: 'URL onde uma API pode ser acessada' }
            ];

            if (this.flashcards.length === 0) {
                this.mostrarMensagem('⚠️ Nenhum flashcard disponível para esta matéria.');
                return;
            }

            // Reinicia o estado
            this.indiceAtual = 0;
            this.estaRespondendo = false;
            
            // Mostra o primeiro flashcard
            this.mostrarFlashcard();
            
        } catch (error) {
            console.error('❌ Erro ao iniciar estudo:', error);
            this.mostrarMensagem('❌ Erro ao carregar flashcards. Tente novamente.');
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
        document.getElementById('btn-acertou').disabled = false;
        document.getElementById('btn-errou').disabled = false;
    }

    /**
     * Envia uma resposta para a API
     * @param {boolean} acertou - Se o usuário acertou ou não
     */
    async responder(acertou) {
        if (!this.flashcardAtual) return;

        // Desabilita os botões para evitar múltiplos cliques
        document.getElementById('btn-acertou').disabled = true;
        document.getElementById('btn-errou').disabled = true;

        console.log(`📝 Resposta: ${acertou ? '✅ Acertou' : '❌ Errou'}`);

        try {
            // Quando o Flask estiver pronto:
            // const resultado = await post(`/flashcards/${this.flashcardAtual.id}/responder`, {
            //     acertou: acertou
            // });
            
            // Simula uma resposta da API
            const resultado = {
                success: true,
                flashcard: this.flashcardAtual,
                acertou: acertou,
                sequencia: acertou ? 1 : 0,
                dominado: false,
                proximo_flashcard: this.indiceAtual + 1 < this.flashcards.length 
                    ? this.flashcards[this.indiceAtual + 1] 
                    : null
            };

            console.log('✅ Resposta registrada:', resultado);

            // Feedback visual
            flashcardComponent.mostrarFeedback(acertou);

            // Aguarda um momento para o usuário ver o feedback
            await this.aguardar(800);

            // Avança para o próximo flashcard
            this.indiceAtual++;
            this.mostrarFlashcard();

        } catch (error) {
            console.error('❌ Erro ao enviar resposta:', error);
            flashcardComponent.mostrarErro('Erro ao registrar resposta.');
            
            // Reabilita os botões
            document.getElementById('btn-acertou').disabled = false;
            document.getElementById('btn-errou').disabled = false;
        }
    }

    /**
     * Conclui o estudo da matéria
     */
    concluirEstudo() {
        console.log('🎉 Estudo concluído!');
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