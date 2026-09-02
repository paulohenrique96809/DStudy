// frontend/js/components/flashcard.js

/**
 * FLASHCARD - Componente visual de flashcard
 * 
 * Responsabilidades:
 * - Renderizar o flashcard com animação 3D
 * - Controlar o estado (frente/verso)
 * - Mostrar feedback de acerto/erro
 * - Gerenciar eventos dos botões
 */

export class FlashcardComponent {
    constructor() {
        this.container = document.getElementById('flashcard-container');
        this.flashcard = null;
        this.mostrandoResposta = false;
        this.animando = false;
        this.onResponder = null; // Callback para quando responder
        console.log('🃏 [FLASHCARD] Container:', this.container);
    }

    /**
     * Renderiza o flashcard
     * @param {object} flashcard - { id, pergunta, resposta }
     * @param {function} onResponder - Callback quando o usuário responder
     */
    renderizar(flashcard, onResponder = null) {
        if (!this.container) {
            console.warn('⚠️ [FLASHCARD] Container não encontrado');
            return;
        }

        if (!flashcard || !flashcard.pergunta) {
            this.container.innerHTML = `
                <div class="flashcard-error">
                    <p>❌ Flashcard inválido</p>
                </div>
            `;
            return;
        }

        this.flashcard = flashcard;
        this.mostrandoResposta = false;
        this.animando = false;
        this.onResponder = onResponder;

        this.container.innerHTML = `
            <div class="flashcard-wrapper">
                <div class="flashcard-3d" id="flashcard-3d">
                    <!-- FRENTE (PERGUNTA) -->
                    <div class="flashcard-face flashcard-front">
                        <div class="flashcard-badge">📝 Pergunta</div>
                        <div class="flashcard-pergunta">${flashcard.pergunta}</div>
                        <button class="btn btn-primary btn-revelar" id="btn-revelar">
                            👁️ Ver resposta
                        </button>
                    </div>
                    
                    <!-- VERSO (RESPOSTA) -->
                    <div class="flashcard-face flashcard-back">
                        <div class="flashcard-badge">✅ Resposta</div>
                        <div class="flashcard-resposta">${flashcard.resposta}</div>
                        <div class="flashcard-actions">
                            <button class="btn btn-danger btn-errou" id="btn-errou">
                                ❌ Errei
                            </button>
                            <button class="btn btn-success btn-acertou" id="btn-acertou">
                                ✅ Acertei
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flashcard-feedback" id="flashcard-feedback"></div>
        `;

        // Eventos
        this.configurarEventos();
    }

    /**
     * Configura os eventos dos botões
     */
    configurarEventos() {
        const btnRevelar = document.getElementById('btn-revelar');
        const btnAcertou = document.getElementById('btn-acertou');
        const btnErrou = document.getElementById('btn-errou');

        if (btnRevelar) {
            btnRevelar.addEventListener('click', () => this.virarCartao());
        }

        if (btnAcertou) {
            btnAcertou.addEventListener('click', () => {
                if (this.onResponder) this.onResponder(true);
            });
        }

        if (btnErrou) {
            btnErrou.addEventListener('click', () => {
                if (this.onResponder) this.onResponder(false);
            });
        }

        // ⭐ Tecla Espaço para virar o cartão
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && !this.mostrandoResposta && !this.animando) {
                e.preventDefault();
                this.virarCartao();
            }
        });
    }

    /**
     * Vira o cartão (frente → verso)
     */
    virarCartao() {
        if (this.animando || this.mostrandoResposta) return;
        
        this.animando = true;
        this.mostrandoResposta = true;
        
        const card = document.getElementById('flashcard-3d');
        if (card) {
            card.classList.add('virado');
        }

        // Habilita os botões de resposta após a animação
        setTimeout(() => {
            const btnAcertou = document.getElementById('btn-acertou');
            const btnErrou = document.getElementById('btn-errou');
            if (btnAcertou) btnAcertou.disabled = false;
            if (btnErrou) btnErrou.disabled = false;
            this.animando = false;
        }, 400);
    }

    /**
     * Mostra feedback visual (acertou/errou)
     * @param {boolean} acertou - Se o usuário acertou ou não
     * @param {object} resultado - Dados da resposta (sequência, dominado, etc.)
     */
    mostrarFeedback(acertou, resultado = null) {
        const feedback = document.getElementById('flashcard-feedback');
        if (!feedback) return;

        const mensagem = acertou ? '✅ Correto! Muito bem!' : '❌ Errou! Continue praticando.';
        const classe = acertou ? 'feedback-success' : 'feedback-error';
        
        // Informações adicionais
        let infoExtra = '';
        if (resultado) {
            if (resultado.dominado) {
                infoExtra = '<span class="feedback-dominado">🏆 Flashcard dominado!</span>';
            } else if (resultado.sequencia) {
                infoExtra = `<span class="feedback-sequencia">🔥 Sequência: ${resultado.sequencia}/3</span>`;
            }
        }

        feedback.innerHTML = `
            <div class="${classe}">
                <div class="feedback-mensagem">${mensagem}</div>
                ${infoExtra}
            </div>
        `;
        
        feedback.style.display = 'block';
        feedback.style.opacity = '0';
        
        // Animação de entrada
        setTimeout(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'translateY(0)';
        }, 50);
    }

    /**
     * Limpa o feedback
     */
    limparFeedback() {
        const feedback = document.getElementById('flashcard-feedback');
        if (feedback) {
            feedback.innerHTML = '';
            feedback.style.display = 'none';
        }
    }

    /**
     * Mostra mensagem de erro
     * @param {string} mensagem - Mensagem de erro
     */
    mostrarErro(mensagem) {
        const feedback = document.getElementById('flashcard-feedback');
        if (!feedback) return;
        
        feedback.innerHTML = `
            <div class="feedback-error">
                <div class="feedback-mensagem">❌ ${mensagem}</div>
            </div>
        `;
        feedback.style.display = 'block';
    }

    /**
     * Prepara para o próximo flashcard (reseta o estado)
     */
    prepararProximo() {
        const card = document.getElementById('flashcard-3d');
        if (card) {
            card.classList.remove('virado');
        }
        
        this.mostrandoResposta = false;
        this.animando = false;
        this.limparFeedback();
        
        // Desabilita os botões de resposta
        const btnAcertou = document.getElementById('btn-acertou');
        const btnErrou = document.getElementById('btn-errou');
        if (btnAcertou) btnAcertou.disabled = true;
        if (btnErrou) btnErrou.disabled = true;
    }

    /**
     * Limpa o componente completamente
     */
    limpar() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.flashcard = null;
        this.mostrandoResposta = false;
        this.animando = false;
        this.onResponder = null;
    }

    /**
     * Mostra tela de conclusão
     * @param {string} nomeMateria - Nome da matéria
     */
    mostrarConclusao(nomeMateria) {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="flashcard-conclusao">
                <div class="conclusao-icone">🎉</div>
                <h2>Estudo concluído!</h2>
                <p>Você completou todos os flashcards de <strong>${nomeMateria}</strong>.</p>
                <button class="btn btn-primary" onclick="window.location.reload()">
                    📚 Voltar para matérias
                </button>
            </div>
        `;
    }
}

export const flashcardComponent = new FlashcardComponent();