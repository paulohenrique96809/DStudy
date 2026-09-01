// frontend/js/components/flashcard.js

export class FlashcardComponent {
    constructor() {
        this.container = document.getElementById('flashcard-container');
        this.flashcard = null;
        this.mostrandoResposta = false;
        console.log('🃏 [FLASHCARD] Container:', this.container);
    }

    renderizar(flashcard) {
        if (!this.container) {
            console.warn('⚠️ [FLASHCARD] Container não encontrado');
            return;
        }

        if (!flashcard || !flashcard.pergunta) {
            this.container.innerHTML = `<div class="error-state"><p>❌ Flashcard inválido</p></div>`;
            return;
        }

        this.flashcard = flashcard;
        this.mostrandoResposta = false;

        this.container.innerHTML = `
            <div class="flashcard">
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <div class="flashcard-pergunta">${flashcard.pergunta}</div>
                        <button class="btn btn-primary" id="btn-mostrar-resposta">
                            👁️ Mostrar resposta
                        </button>
                    </div>
                    <div class="flashcard-back" style="display: none;">
                        <div class="flashcard-resposta">${flashcard.resposta}</div>
                        <div class="flashcard-actions">
                            <button class="btn btn-danger" id="btn-errou" disabled>❌ Errei</button>
                            <button class="btn btn-success" id="btn-acertou" disabled>✅ Acertei</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flashcard-feedback" id="flashcard-feedback" style="display: none;"></div>
        `;
    }

    mostrarResposta() {
        if (this.mostrandoResposta) return;
        this.mostrandoResposta = true;
        
        const front = this.container.querySelector('.flashcard-front');
        const back = this.container.querySelector('.flashcard-back');
        
        if (front) front.style.display = 'none';
        if (back) back.style.display = 'block';
        
        document.getElementById('btn-acertou').disabled = false;
        document.getElementById('btn-errou').disabled = false;
    }

    mostrarFeedback(acertou) {
        const feedback = document.getElementById('flashcard-feedback');
        if (!feedback) return;

        const mensagem = acertou ? '✅ Correto! Muito bem!' : '❌ Errou! Continue praticando.';
        const classe = acertou ? 'feedback-success' : 'feedback-error';

        feedback.innerHTML = `<div class="${classe}">${mensagem}</div>`;
        feedback.style.display = 'block';
    }

    mostrarErro(mensagem) {
        const feedback = document.getElementById('flashcard-feedback');
        if (!feedback) return;
        feedback.innerHTML = `<div class="feedback-error">❌ ${mensagem}</div>`;
        feedback.style.display = 'block';
    }

    limpar() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.flashcard = null;
        this.mostrandoResposta = false;
    }
}

export const flashcardComponent = new FlashcardComponent();