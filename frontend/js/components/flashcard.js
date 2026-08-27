// frontend/js/components/flashcard.js

/**
 * FLASHCARD - Componente visual de flashcard
 * 
 * Responsabilidades:
 * - Renderizar um flashcard na tela
 * - Mostrar pergunta e resposta
 * - Gerenciar estados (virar, mostrar feedback)
 * - Limpar o componente
 * 
 * Este componente é puramente visual - não contém lógica de negócio
 */

/**
 * Classe do componente Flashcard
 */
export class FlashcardComponent {
    constructor() {
        this.container = document.getElementById('flashcard-container');
        this.flashcard = null;
        this.mostrandoResposta = false;
    }

    /**
     * Renderiza um flashcard no container
     * @param {object} flashcard - Dados do flashcard { id, pergunta, resposta }
     */
    renderizar(flashcard) {
        if (!this.container) {
            console.warn('⚠️ [FLASHCARD] Container não encontrado');
            return;
        }

        // ⭐ DEBUG: Verifica o que está chegando
        console.log('📝 [FLASHCARD] Renderizando:', flashcard);

        // ⭐ VALIDAÇÃO: Verifica se o flashcard tem os campos necessários
        if (!flashcard) {
            console.error('❌ [FLASHCARD] Flashcard é null ou undefined');
            this.container.innerHTML = `
                <div class="flashcard-error">
                    <p>❌ Erro: Flashcard inválido</p>
                </div>
            `;
            return;
        }

        if (!flashcard.pergunta) {
            console.error('❌ [FLASHCARD] Flashcard sem pergunta:', flashcard);
            this.container.innerHTML = `
                <div class="flashcard-error">
                    <p>❌ Erro: Flashcard sem pergunta</p>
                    <p style="font-size: 12px; color: #666;">Dados recebidos: ${JSON.stringify(flashcard)}</p>
                </div>
            `;
            return;
        }

        this.flashcard = flashcard;
        this.mostrandoResposta = false;

        // ⭐ CORREÇÃO: Usa os campos corretos
        const pergunta = flashcard.pergunta || 'Pergunta não disponível';
        const resposta = flashcard.resposta || 'Resposta não disponível';

        this.container.innerHTML = `
            <div class="flashcard" id="flashcard">
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <div class="flashcard-label">Pergunta</div>
                        <div class="flashcard-pergunta">${pergunta}</div>
                        <button class="btn btn-primary" id="btn-mostrar-resposta">
                            👁️ Mostrar resposta
                        </button>
                    </div>
                    <div class="flashcard-back" style="display: none;">
                        <div class="flashcard-label">Resposta</div>
                        <div class="flashcard-resposta">${resposta}</div>
                        <div class="flashcard-actions">
                            <button class="btn btn-danger" id="btn-errou" disabled>
                                ❌ Errei
                            </button>
                            <button class="btn btn-success" id="btn-acertou" disabled>
                                ✅ Acertei
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flashcard-feedback" id="flashcard-feedback" style="display: none;"></div>
        `;

        // Atualiza referências
        this.flashcardElement = document.getElementById('flashcard');
        this.feedbackElement = document.getElementById('flashcard-feedback');
        
        console.log('✅ [FLASHCARD] Renderizado com sucesso:', pergunta);
    }

    /**
     * Mostra a resposta do flashcard
     */
    mostrarResposta() {
        if (this.mostrandoResposta) return;
        
        this.mostrandoResposta = true;
        
        const front = this.container?.querySelector('.flashcard-front');
        const back = this.container?.querySelector('.flashcard-back');
        
        if (front) front.style.display = 'none';
        if (back) back.style.display = 'block';
        
        console.log('👁️ [FLASHCARD] Resposta revelada');
    }

    /**
     * Mostra feedback visual (acertou/errou)
     * @param {boolean} acertou - Se o usuário acertou ou não
     */
    mostrarFeedback(acertou) {
        if (!this.feedbackElement) return;

        const mensagem = acertou 
            ? '✅ Correto! Muito bem!' 
            : '❌ Errou! Continue praticando.';
        
        const classe = acertou ? 'feedback-success' : 'feedback-error';

        this.feedbackElement.innerHTML = `
            <div class="${classe}">
                ${mensagem}
            </div>
        `;
        
        this.feedbackElement.style.display = 'block';
        console.log(`📝 [FLASHCARD] Feedback: ${acertou ? 'Acertou' : 'Errou'}`);
    }

    /**
     * Mostra mensagem de erro
     * @param {string} mensagem - Mensagem de erro
     */
    mostrarErro(mensagem) {
        if (!this.feedbackElement) return;

        this.feedbackElement.innerHTML = `
            <div class="feedback-error">
                ❌ ${mensagem}
            </div>
        `;
        this.feedbackElement.style.display = 'block';
    }

    /**
     * Limpa o componente
     */
    limpar() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.flashcard = null;
        this.mostrandoResposta = false;
        console.log('🧹 [FLASHCARD] Limpo');
    }
}

// Cria e exporta uma instância única
export const flashcardComponent = new FlashcardComponent();