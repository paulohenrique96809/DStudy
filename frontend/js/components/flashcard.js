// frontend/js/components/flashcard.js

/**
 * FLASHCARD - Componente visual de flashcard
 * 
 * Responsabilidades:
 * - Renderizar o flashcard (pergunta + alternativas alt_a/b/c/d)
 * - Controlar o estado (frente/verso) com animação 3D
 * - Mostrar badge de dificuldade (⭐ a ⭐⭐⭐⭐)
 * - Comparar a resposta do aluno automaticamente
 * - Mostrar feedback visual (acerto/erro)
 * 
 * Estrutura esperada do flashcard:
 * {
 *   id: 1,
 *   pergunta: "O que significa SQL?",
 *   alt_a: "Structured Query Language",
 *   alt_b: "Simple Question Language",
 *   alt_c: "System Query Logic",
 *   alt_d: "Standard Quality Language",
 *   dificuldade: 1
 * }
 * 
 * ⚠️ O campo "correta" NÃO vem da API (segurança). 
 * Ele só chega no retorno do POST /responder.
 */

export class FlashcardComponent {
    constructor() {
        this.container = document.getElementById('flashcard-container');
        this.flashcard = null;
        this.mostrandoResposta = false;
        this.animando = false;
        this.respostaSelecionada = null; // 'a', 'b', 'c' ou 'd'
        this.callbacks = {
            onRevelar: null,
            onResponder: null
        };
        
        this._configurarTeclado();
        
        console.log('🃏 [FLASHCARD] Container:', this.container);
    }

    /**
     * ⭐ CONFIGURA ATALHOS DE TECLADO
     */
    _configurarTeclado() {
        document.addEventListener('keydown', (e) => {
            if (!this.flashcard) return;

            // Espaço: virar o cartão (só se ainda não virou)
            if (e.key === ' ' && !this.mostrandoResposta && !this.animando) {
                e.preventDefault();
                this.mostrarResposta();
            }

            // Enter: revelar resposta (só se alternativa selecionada)
            if (e.key === 'Enter' && !this.mostrandoResposta && this.respostaSelecionada) {
                e.preventDefault();
                this.mostrarResposta();
            }

            // Teclas 1-4 ou A-D: selecionar alternativa
            const teclas = {
                '1': 'a', '2': 'b', '3': 'c', '4': 'd',
                'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd'
            };
            
            if (teclas[e.key.toLowerCase()] && !this.mostrandoResposta) {
                e.preventDefault();
                this._selecionarPorLetra(teclas[e.key.toLowerCase()]);
            }

            // Esc: limpar feedback
            if (e.key === 'Escape') {
                this.limparFeedback();
            }
        });
    }

    /**
     * ⭐ RENDERIZA O FLASHCARD
     */
    renderizar(flashcard, callbacks = {}) {
        if (!this.container) {
            console.warn('⚠️ [FLASHCARD] Container não encontrado');
            return;
        }

        if (!flashcard || !flashcard.pergunta) {
            this._mostrarMensagemErro('Flashcard inválido');
            return;
        }

        // Reseta estado
        this.flashcard = flashcard;
        this.mostrandoResposta = false;
        this.animando = false;
        this.respostaSelecionada = null;
        this.callbacks = {
            onRevelar: callbacks.onRevelar || null,
            onResponder: callbacks.onResponder || null
        };

        const pergunta = this._escapeHtml(flashcard.pergunta);
        
        // ⭐ GERA O BADGE DE DIFICULDADE
        const badgeDificuldade = this._renderizarBadgeDificuldade(flashcard.dificuldade);
        
        // ⭐ CONVERTE alt_a/b/c/d em array de alternativas
        const alternativas = this._extrairAlternativas(flashcard);
        
        if (alternativas.length === 0) {
            this._mostrarMensagemErro('Flashcard sem alternativas');
            return;
        }

        const conteudoAlternativas = this._renderizarAlternativas(alternativas);

        this.container.innerHTML = `
            <div class="flashcard-wrapper">
                <div class="flashcard-3d" id="flashcard-3d">
                    <!-- FRENTE: PERGUNTA + ALTERNATIVAS -->
                    <div class="flashcard-face flashcard-front">
                        ${badgeDificuldade}
                        <div class="flashcard-badge">📝 Escolha uma alternativa</div>
                        <div class="flashcard-pergunta">${pergunta}</div>
                        ${conteudoAlternativas}
                        <button class="btn btn-primary btn-revelar" id="btn-revelar" type="button" disabled>
                            👁️ Ver resposta
                        </button>
                    </div>
                    
                    <!-- VERSO: RESULTADO -->
                    <div class="flashcard-face flashcard-back">
                        <div class="flashcard-resultado" id="flashcard-resultado"></div>
                    </div>
                </div>
            </div>
            <div class="flashcard-feedback" id="flashcard-feedback" role="alert" aria-live="polite"></div>
        `;

        this._configurarEventos();

        console.log(`🃏 [FLASHCARD] Renderizado: "${flashcard.pergunta}" (dificuldade: ${flashcard.dificuldade})`);
    }

    /**
     * ⭐ EXTRAI ALTERNATIVAS DO FLASHCARD
     * 
     * Suporta dois formatos:
     * 1. Formato atual (da API): alt_a, alt_b, alt_c, alt_d
     * 2. Formato antigo (fallback): alternativas: [...]
     */
    _extrairAlternativas(flashcard) {
        // Formato atual (API da Ingredy)
        if (flashcard.alt_a !== undefined) {
            const alternativas = [];
            if (flashcard.alt_a) alternativas.push({ letra: 'a', texto: flashcard.alt_a });
            if (flashcard.alt_b) alternativas.push({ letra: 'b', texto: flashcard.alt_b });
            if (flashcard.alt_c) alternativas.push({ letra: 'c', texto: flashcard.alt_c });
            if (flashcard.alt_d) alternativas.push({ letra: 'd', texto: flashcard.alt_d });
            return alternativas;
        }

        // Formato antigo (fallback)
        if (Array.isArray(flashcard.alternativas)) {
            return flashcard.alternativas.map((texto, i) => ({
                letra: String.fromCharCode(97 + i),
                texto: texto
            }));
        }

        return [];
    }

    /**
     * ⭐ RENDERIZA AS ALTERNATIVAS
     */
    _renderizarAlternativas(alternativas) {
        return `
            <div class="flashcard-alternativas" role="radiogroup" aria-label="Alternativas">
                ${alternativas.map((alt) => `
                    <button 
                        class="alternativa-item" 
                        data-letra="${alt.letra}"
                        type="button"
                        role="radio"
                        aria-checked="false"
                        aria-label="Alternativa ${alt.letra.toUpperCase()}: ${this._escapeHtml(alt.texto)}"
                    >
                        <span class="alternativa-letra">${alt.letra.toUpperCase()}</span>
                        <span class="alternativa-texto">${this._escapeHtml(alt.texto)}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    /**
     * ⭐ CONFIGURA OS EVENTOS
     */
    _configurarEventos() {
        const btnRevelar = document.getElementById('btn-revelar');
        const alternativas = this.container.querySelectorAll('.alternativa-item');

        if (btnRevelar) {
            btnRevelar.addEventListener('click', () => this.mostrarResposta());
        }

        alternativas.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.mostrandoResposta) return;
                this._selecionarAlternativa(e.currentTarget);
            });
        });
    }

    /**
     * ⭐ SELECIONA UMA ALTERNATIVA POR LETRA
     */
    _selecionarPorLetra(letra) {
        const btn = this.container.querySelector(`.alternativa-item[data-letra="${letra}"]`);
        if (btn) this._selecionarAlternativa(btn);
    }

    /**
     * ⭐ SELECIONA UMA ALTERNATIVA
     */
    _selecionarAlternativa(elemento) {
        this.container.querySelectorAll('.alternativa-item').forEach(btn => {
            btn.classList.remove('selected');
            btn.setAttribute('aria-checked', 'false');
        });

        elemento.classList.add('selected');
        elemento.setAttribute('aria-checked', 'true');
        this.respostaSelecionada = elemento.dataset.letra;

        // Habilita o botão "Ver resposta"
        const btnRevelar = document.getElementById('btn-revelar');
        if (btnRevelar) btnRevelar.disabled = false;

        console.log(`🎯 [FLASHCARD] Alternativa selecionada: ${this.respostaSelecionada}`);
    }

    /**
     * ⭐ VIRA O CARTÃO E DISPARA CALLBACK
     */
    mostrarResposta() {
        if (this.animando || this.mostrandoResposta) return;

        if (!this.respostaSelecionada) {
            this.mostrarErro('Escolha uma alternativa antes de ver a resposta.');
            return;
        }

        this.animando = true;
        this.mostrandoResposta = true;

        const card = document.getElementById('flashcard-3d');
        if (card) card.classList.add('virado');

        if (this.callbacks.onRevelar) {
            this.callbacks.onRevelar(this.flashcard);
        }

        // ⭐ DISPARA O CALLBACK DE RESPOSTA
        setTimeout(() => {
            this.animando = false;
            if (this.callbacks.onResponder) {
                this.callbacks.onResponder(this.respostaSelecionada);
            }
        }, 500);

        console.log(`👁️ [FLASHCARD] Resposta revelada (letra: ${this.respostaSelecionada})`);
    }

    /**
     * ⭐ MOSTRA RESULTADO (chamado pelo estudo.js após receber do Back-End)
     */
    mostrarResultado(acertou, info = {}) {
        const resultado = document.getElementById('flashcard-resultado');
        if (!resultado) return;

        const correta = info.correta || '';

        resultado.innerHTML = `
            <div class="resultado-icone">${acertou ? '✅' : '❌'}</div>
            <div class="resultado-titulo ${acertou ? 'acerto' : 'erro'}">
                ${acertou ? 'Você acertou!' : 'Você errou!'}
            </div>
            <div class="resultado-resposta">
                <strong>Resposta correta:</strong>
                <span>Alternativa ${correta.toUpperCase()}</span>
            </div>
            ${!acertou ? `
                <div class="resultado-sua-resposta">
                    <strong>Sua resposta:</strong>
                    <span>Alternativa ${this.respostaSelecionada.toUpperCase()}</span>
                </div>
            ` : ''}
        `;

        this._destacarAlternativas(correta);
    }

    /**
     * ⭐ DESTACA VISUALMENTE AS ALTERNATIVAS (certa/errada)
     */
    _destacarAlternativas(letraCorreta) {
        this.container.querySelectorAll('.alternativa-item').forEach(btn => {
            const letra = btn.dataset.letra;
            
            btn.classList.remove('selected', 'correta', 'incorreta');
            btn.disabled = true;
            
            if (letra === letraCorreta) {
                btn.classList.add('correta');
            } else if (letra === this.respostaSelecionada) {
                btn.classList.add('incorreta');
            }
        });
    }

    /**
     * ⭐ MOSTRA FEEDBACK
     */
    mostrarFeedback(acertou, info = {}) {
        const feedback = document.getElementById('flashcard-feedback');
        if (!feedback) return;

        const mensagem = info.mensagem || (acertou ? '✅ Correto! Muito bem!' : '❌ Errou! Continue praticando.');
        const classe = acertou ? 'feedback-success' : 'feedback-error';

        let infoExtra = '';
        
        if (info.dominado) {
            infoExtra = '<span class="feedback-dominado">🏆 Flashcard dominado!</span>';
        } else if (info.sequencia !== undefined && info.sequencia > 0) {
            infoExtra = `<span class="feedback-sequencia">🔥 Sequência: ${info.sequencia}/3</span>`;
        }

        feedback.innerHTML = `
            <div class="${classe}">
                <div class="feedback-mensagem">${mensagem}</div>
                ${infoExtra}
            </div>
        `;
        
        feedback.style.display = 'block';
    }

    /**
     * ⭐ MOSTRA ERRO
     */
    mostrarErro(mensagem) {
        const feedback = document.getElementById('flashcard-feedback');
        if (!feedback) return;

        feedback.innerHTML = `
            <div class="feedback-error">
                <div class="feedback-mensagem">❌ ${this._escapeHtml(mensagem)}</div>
            </div>
        `;
        feedback.style.display = 'block';

        setTimeout(() => {
            feedback.style.display = 'none';
        }, 3000);
    }

    limparFeedback() {
        const feedback = document.getElementById('flashcard-feedback');
        if (feedback) {
            feedback.innerHTML = '';
            feedback.style.display = 'none';
        }
    }

    /**
     * ⭐ PREPARA PRÓXIMO
     */
    prepararProximo() {
        const card = document.getElementById('flashcard-3d');
        if (card) card.classList.remove('virado');

        this.mostrandoResposta = false;
        this.animando = false;
        this.respostaSelecionada = null;
        
        this.limparFeedback();
    }

    limpar() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        this.flashcard = null;
        this.mostrandoResposta = false;
        this.animando = false;
        this.respostaSelecionada = null;
        this.callbacks = {
            onRevelar: null,
            onResponder: null
        };
    }

    mostrarConclusao(nomeMateria) {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="flashcard-conclusao">
                <div class="conclusao-icone">🎉</div>
                <h2>Estudo concluído!</h2>
                <p>Você completou todos os flashcards de <strong>${this._escapeHtml(nomeMateria)}</strong>.</p>
                <button class="btn btn-primary" onclick="window.location.reload()">
                    📚 Voltar para matérias
                </button>
            </div>
        `;
    }

    // ============================================================
    // ⭐ UTILITÁRIOS
    // ============================================================

    /**
     * ⭐ ESCAPA HTML PARA EVITAR XSS
     */
    _escapeHtml(texto) {
        if (typeof texto !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    /**
     * ⭐ MOSTRA MENSAGEM DE ERRO NO CONTAINER
     */
    _mostrarMensagemErro(mensagem) {
        this.container.innerHTML = `
            <div class="flashcard-erro">
                <p>❌ ${this._escapeHtml(mensagem)}</p>
            </div>
        `;
    }

    /**
     * ⭐ RETORNA O LABEL DA DIFICULDADE
     * @param {number} nivel - 1, 2, 3 ou 4
     * @returns {string} - Label formatada
     */
    _getLabelDificuldade(nivel) {
        const labels = {
            1: '⭐ Fácil',
            2: '⭐⭐ Médio',
            3: '⭐⭐⭐ Difícil',
            4: '⭐⭐⭐⭐ Muito Difícil'
        };
        return labels[nivel] || '';
    }

    /**
     * ⭐ RENDERIZA O BADGE DE DIFICULDADE
     * @param {number} nivel - Nível da dificuldade (1 a 4)
     * @returns {string} - HTML do badge (ou vazio se não tiver dificuldade)
     */
    _renderizarBadgeDificuldade(nivel) {
        if (!nivel || nivel < 1 || nivel > 4) return '';
        
        return `
            <div class="dificuldade-badge dificuldade-${nivel}">
                ${this._getLabelDificuldade(nivel)}
            </div>
        `;
    }

    // ============================================================
    // ⭐ GETTERS
    // ============================================================

    getFlashcardAtual() { return this.flashcard; }
    estaMostrandoResposta() { return this.mostrandoResposta; }
    getRespostaSelecionada() { return this.respostaSelecionada; }
}

export const flashcardComponent = new FlashcardComponent();