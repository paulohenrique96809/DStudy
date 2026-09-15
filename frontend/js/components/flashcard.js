// frontend/js/components/flashcard.js

/**
 * FLASHCARD - Componente visual de flashcard
 * 
 * Responsabilidades:
 * - Renderizar o flashcard (pergunta + alternativas)
 * - Controlar o estado (frente/verso) com animação 3D
 * - Comparar a resposta do aluno automaticamente
 * - Mostrar feedback visual (acerto/erro)
 */

export class FlashcardComponent {
    constructor() {
        this.container = document.getElementById('flashcard-container');
        this.flashcard = null;
        this.mostrandoResposta = false;
        this.animando = false;
        this.respostaSelecionada = null;
        this.respostaCorreta = null;
        this.callbacks = {
            onRevelar: null,
            onResponder: null
        };
        
        this._configurarTeclado();
        
        console.log('🃏 [FLASHCARD] Container:', this.container);
    }

    _configurarTeclado() {
        document.addEventListener('keydown', (e) => {
            if (!this.flashcard) return;

            // Espaço: virar o cartão (só se ainda não virou)
            if (e.key === ' ' && !this.mostrandoResposta && !this.animando) {
                e.preventDefault();
                this.mostrarResposta();
            }

            // Enter: seleciona a alternativa destacada
            if (e.key === 'Enter' && !this.mostrandoResposta) {
                const selecionada = this.container.querySelector('.alternativa-item.selected');
                if (selecionada) {
                    e.preventDefault();
                    this.mostrarResposta();
                }
            }

            // Teclas 1-4: seleciona alternativa por número
            if (['1', '2', '3', '4'].includes(e.key) && !this.mostrandoResposta) {
                const index = parseInt(e.key) - 1;
                const alternativas = this.container.querySelectorAll('.alternativa-item');
                if (alternativas[index]) {
                    e.preventDefault();
                    this._selecionarAlternativa(alternativas[index]);
                }
            }

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
        this.respostaCorreta = null;
        this.callbacks = {
            onRevelar: callbacks.onRevelar || null,
            onResponder: callbacks.onResponder || null
        };

        const temAlternativas = Array.isArray(flashcard.alternativas) && flashcard.alternativas.length > 0;
        const pergunta = this._escapeHtml(flashcard.pergunta);
        
        // ⭐ VERIFICA SE É MÚLTIPLA ESCOLHA
        if (!temAlternativas) {
            // Modo clássico (sem alternativas) - mantém botões Acertei/Errei
            this._renderizarModoClassico(pergunta);
            return;
        }

        // Modo múltipla escolha
        const conteudoAlternativas = this._renderizarAlternativas(flashcard.alternativas);

        this.container.innerHTML = `
            <div class="flashcard-wrapper">
                <div class="flashcard-3d" id="flashcard-3d">
                    <!-- FRENTE: PERGUNTA + ALTERNATIVAS -->
                    <div class="flashcard-face flashcard-front">
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

        this._configurarEventosMultiplaEscolha();

        console.log(`🃏 [FLASHCARD] Renderizado (múltipla escolha): "${flashcard.pergunta}"`);
    }

    /**
     * ⭐ MODO CLÁSSICO (sem alternativas)
     */
    _renderizarModoClassico(pergunta) {
        this.container.innerHTML = `
            <div class="flashcard-wrapper">
                <div class="flashcard-3d" id="flashcard-3d">
                    <div class="flashcard-face flashcard-front">
                        <div class="flashcard-badge">📝 Pergunta</div>
                        <div class="flashcard-pergunta">${pergunta}</div>
                        <button class="btn btn-primary btn-revelar" id="btn-revelar" type="button">
                            👁️ Ver resposta
                        </button>
                    </div>
                    
                    <div class="flashcard-face flashcard-back">
                        <div class="flashcard-badge">✅ Resposta</div>
                        <div class="flashcard-resposta">
                            ${this._obterTextoResposta()}
                        </div>
                        <div class="flashcard-actions">
                            <button class="btn btn-danger btn-errou" id="btn-errou" disabled type="button">
                                ❌ Errei
                            </button>
                            <button class="btn btn-success btn-acertou" id="btn-acertou" disabled type="button">
                                ✅ Acertei
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flashcard-feedback" id="flashcard-feedback" role="alert" aria-live="polite"></div>
        `;

        this._configurarEventosClassico();
    }

    /**
     * ⭐ RENDERIZA AS ALTERNATIVAS
     */
    _renderizarAlternativas(alternativas) {
        const letras = ['A', 'B', 'C', 'D', 'E', 'F'];
        
        return `
            <div class="flashcard-alternativas" role="radiogroup" aria-label="Alternativas">
                ${alternativas.map((alt, index) => `
                    <button 
                        class="alternativa-item" 
                        data-index="${index}"
                        data-valor="${this._escapeHtml(alt)}"
                        type="button"
                        role="radio"
                        aria-checked="false"
                        aria-label="Alternativa ${letras[index]}: ${this._escapeHtml(alt)}"
                    >
                        <span class="alternativa-letra">${letras[index]}</span>
                        <span class="alternativa-texto">${this._escapeHtml(alt)}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    /**
     * ⭐ OBTÉM A RESPOSTA CORRETA
     */
    _obterRespostaCorreta() {
        // Prioridade: resposta > primeira alternativa
        if (this.flashcard.resposta) {
            return this.flashcard.resposta;
        }
        
        if (this.flashcard.alternativas && this.flashcard.alternativas.length > 0) {
            return this.flashcard.alternativas[0];
        }
        
        return null;
    }

    _obterTextoResposta() {
        const correta = this._obterRespostaCorreta();
        return correta ? this._escapeHtml(correta) : 'Resposta não disponível';
    }

    /**
     * ⭐ CONFIGURA EVENTOS - MÚLTIPLA ESCOLHA
     */
    _configurarEventosMultiplaEscolha() {
        const btnRevelar = document.getElementById('btn-revelar');
        const alternativas = this.container.querySelectorAll('.alternativa-item');

        if (btnRevelar) {
            btnRevelar.addEventListener('click', () => this.mostrarResposta());
        }

        alternativas.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.mostrandoResposta) return; // Não permite mudar depois de revelar
                this._selecionarAlternativa(e.currentTarget);
            });
        });
    }

    /**
     * ⭐ CONFIGURA EVENTOS - MODO CLÁSSICO
     */
    _configurarEventosClassico() {
        const btnRevelar = document.getElementById('btn-revelar');
        const btnAcertou = document.getElementById('btn-acertou');
        const btnErrou = document.getElementById('btn-errou');

        if (btnRevelar) {
            btnRevelar.addEventListener('click', () => this.mostrarResposta());
        }

        if (btnAcertou) {
            btnAcertou.addEventListener('click', () => this._responder(true));
        }

        if (btnErrou) {
            btnErrou.addEventListener('click', () => this._responder(false));
        }
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
        this.respostaSelecionada = elemento.dataset.valor;

        // ⭐ HABILITA O BOTÃO "VER RESPOSTA" APÓS SELECIONAR
        const btnRevelar = document.getElementById('btn-revelar');
        if (btnRevelar) btnRevelar.disabled = false;

        console.log(`🎯 [FLASHCARD] Alternativa selecionada: ${this.respostaSelecionada}`);
    }

    /**
     * ⭐ VIRA O CARTÃO E COMPARA RESPOSTAS AUTOMATICAMENTE
     */
    mostrarResposta() {
        if (this.animando || this.mostrandoResposta) return;

        // ⭐ VERIFICA SE TEM ALTERNATIVA SELECIONADA (só para múltipla escolha)
        const temAlternativas = this.flashcard.alternativas && this.flashcard.alternativas.length > 0;
        
        if (temAlternativas && !this.respostaSelecionada) {
            this.mostrarErro('Escolha uma alternativa antes de ver a resposta.');
            return;
        }

        this.animando = true;
        this.mostrandoResposta = true;

        // Vira o cartão
        const card = document.getElementById('flashcard-3d');
        if (card) {
            card.classList.add('virado');
        }

        // Callback de revelação
        if (this.callbacks.onRevelar) {
            this.callbacks.onRevelar(this.flashcard);
        }

        // ⭐ SE FOR MÚLTIPLA ESCOLHA, COMPARA AUTOMATICAMENTE
        if (temAlternativas) {
            setTimeout(() => {
                this._processarRespostaAutomatica();
            }, 500); // Aguarda a animação terminar
        } else {
            // Modo clássico: habilita botões Acertei/Errei
            setTimeout(() => {
                const btnAcertou = document.getElementById('btn-acertou');
                const btnErrou = document.getElementById('btn-errou');
                if (btnAcertou) btnAcertou.disabled = false;
                if (btnErrou) btnErrou.disabled = false;
                this.animando = false;
            }, 400);
        }

        console.log('👁️ [FLASHCARD] Resposta revelada');
    }

    /**
     * ⭐ PROCESSA A RESPOSTA AUTOMATICAMENTE (múltipla escolha)
     */
    _processarRespostaAutomatica() {
        const respostaCorreta = this._obterRespostaCorreta();
        const acertou = this.respostaSelecionada === respostaCorreta;

        // ⭐ MARCA VISUALMENTE AS ALTERNATIVAS
        this._destacarAlternativas(respostaCorreta);

        // ⭐ MONTA O RESULTADO NO VERSO
        const resultado = document.getElementById('flashcard-resultado');
        if (resultado) {
            resultado.innerHTML = `
                <div class="resultado-icone">${acertou ? '✅' : '❌'}</div>
                <div class="resultado-titulo ${acertou ? 'acerto' : 'erro'}">
                    ${acertou ? 'Você acertou!' : 'Você errou!'}
                </div>
                <div class="resultado-resposta">
                    <strong>Resposta correta:</strong>
                    <span>${this._escapeHtml(respostaCorreta)}</span>
                </div>
                ${!acertou ? `
                    <div class="resultado-sua-resposta">
                        <strong>Sua resposta:</strong>
                        <span>${this._escapeHtml(this.respostaSelecionada)}</span>
                    </div>
                ` : ''}
            `;
        }

        // ⭐ DISPARA O CALLBACK DE RESPOSTA
        if (this.callbacks.onResponder) {
            this.callbacks.onResponder(acertou, this.respostaSelecionada);
        }

        console.log(`📝 [FLASHCARD] Resultado automático: ${acertou ? '✅ Acertou' : '❌ Errou'}`);
    }

    /**
     * ⭐ DESTACA VISUALMENTE AS ALTERNATIVAS (certa/errada)
     */
    _destacarAlternativas(respostaCorreta) {
        this.container.querySelectorAll('.alternativa-item').forEach(btn => {
            const valor = btn.dataset.valor;
            
            // Remove estados anteriores
            btn.classList.remove('selected', 'correta', 'incorreta');
            btn.disabled = true; // Desabilita após revelar
            
            if (valor === respostaCorreta) {
                btn.classList.add('correta');
            } else if (valor === this.respostaSelecionada) {
                btn.classList.add('incorreta');
            }
        });
    }

    /**
     * ⭐ RESPONDE (modo clássico)
     */
    _responder(acertou) {
        const btnAcertou = document.getElementById('btn-acertou');
        const btnErrou = document.getElementById('btn-errou');
        if (btnAcertou) btnAcertou.disabled = true;
        if (btnErrou) btnErrou.disabled = true;

        if (this.callbacks.onResponder) {
            this.callbacks.onResponder(acertou, this.respostaSelecionada);
        }

        console.log(`📝 [FLASHCARD] Resposta manual: ${acertou ? '✅' : '❌'}`);
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

        // Remove o erro após 2 segundos
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 2000);
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
        if (card) {
            card.classList.remove('virado');
        }

        this.mostrandoResposta = false;
        this.animando = false;
        this.respostaSelecionada = null;
        
        this.limparFeedback();

        // Desabilita botões (modo clássico)
        const btnAcertou = document.getElementById('btn-acertou');
        const btnErrou = document.getElementById('btn-errou');
        if (btnAcertou) btnAcertou.disabled = true;
        if (btnErrou) btnErrou.disabled = true;
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

    // ===== UTILITÁRIOS =====

    _escapeHtml(texto) {
        if (typeof texto !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    _mostrarMensagemErro(mensagem) {
        this.container.innerHTML = `
            <div class="flashcard-erro">
                <p>❌ ${this._escapeHtml(mensagem)}</p>
            </div>
        `;
    }

    getFlashcardAtual() { return this.flashcard; }
    estaMostrandoResposta() { return this.mostrandoResposta; }
    getRespostaSelecionada() { return this.respostaSelecionada; }
}

export const flashcardComponent = new FlashcardComponent();