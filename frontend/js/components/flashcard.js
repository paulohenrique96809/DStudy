// frontend/js/components/flashcard.js

/**
 * FLASHCARD - Componente visual (design da Yasmin, página flashcards.html)
 *
 * O markup do card já está no HTML. Este componente só preenche textos e troca classes:
 *   .alternativa.selecionada | .correta | .errada   (em cada alternativa)
 *   .alternativas.respondida                        (trava novos cliques)
 *   .btn-proxima.visivel                            (mostra o "Próximo")
 *
 * Fluxo: clicou numa alternativa -> onResponder(letra) -> o estudo.js envia ao back-end
 * e chama mostrarResultado() -> o aluno clica em "Próximo" -> onProximo().
 * Nenhuma regra de domínio aqui: só mostra o que o back-end devolveu.
 */
export class FlashcardComponent {
    constructor() {
        this.flashcard = null;
        this.respondida = false;
        this.respostaSelecionada = null; // 'a' | 'b' | 'c' | 'd'
        this.callbacks = { onResponder: null, onProximo: null };

        this._ligarEventos();
    }

    // ---------- elementos do HTML ----------
    get _alternativas() { return document.getElementById('alternativas'); }
    get _btnProxima()   { return document.getElementById('btn-proxima'); }
    get _feedback()     { return document.getElementById('feedback-resposta'); }

    /** As partes do card que aparecem/somem juntas */
    get _partes() {
        return [
            document.querySelector('.cartao-pergunta'),
            document.getElementById('contador'),
            this._alternativas,
            this._feedback,
            this._btnProxima
        ].filter(Boolean);
    }

    _botoes() {
        return Array.from(document.querySelectorAll('#alternativas .alternativa'));
    }

    _letra(btn) {
        return (btn.dataset.letra || '').toLowerCase();
    }

    _ligarEventos() {
        const alternativas = this._alternativas;
        if (!alternativas) return; // página sem flashcard

        alternativas.addEventListener('click', (e) => {
            const btn = e.target.closest('.alternativa');
            if (btn) this._escolher(this._letra(btn));
        });

        this._btnProxima?.addEventListener('click', () => this._proximo());

        // Atalhos: A-D / 1-4 escolhem; Enter ou Espaço avançam
        document.addEventListener('keydown', (e) => {
            if (!this.flashcard || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;

            const letras = { '1': 'a', '2': 'b', '3': 'c', '4': 'd', a: 'a', b: 'b', c: 'c', d: 'd' };
            const letra = letras[e.key.toLowerCase()];

            if (!this.respondida && letra) {
                e.preventDefault();
                this._escolher(letra);
                return;
            }

            if (this.respondida && (e.key === 'Enter' || e.key === ' ') && this._proximaVisivel()) {
                e.preventDefault();
                this._proximo();
            }
        });
    }

    /**
     * Preenche o card. Devolve false se o flashcard for inválido.
     * @param {Object} flashcard - { id, pergunta, alternativas: [...] } (ou alt_a..alt_d)
     * @param {Object} opcoes - { materia, atual, total, onResponder(letra), onProximo() }
     */
    renderizar(flashcard, opcoes = {}) {
        if (!this._alternativas || !flashcard || !flashcard.pergunta) return false;

        const alternativas = this._extrairAlternativas(flashcard);
        if (alternativas.length === 0) return false;

        this.flashcard = flashcard;
        this.respondida = false;
        this.respostaSelecionada = null;
        this.callbacks = {
            onResponder: opcoes.onResponder || null,
            onProximo: opcoes.onProximo || null
        };

        document.getElementById('tag-materia').textContent = opcoes.materia || '';
        document.getElementById('pergunta').textContent = flashcard.pergunta;
        document.getElementById('contador').textContent = `Card ${opcoes.atual} de ${opcoes.total}`;

        const porLetra = Object.fromEntries(alternativas.map(a => [a.letra, a.texto]));
        this._botoes().forEach(btn => {
            const texto = porLetra[this._letra(btn)];
            btn.hidden = texto === undefined;
            btn.querySelector('.alt-texto').textContent = texto ?? '';
            btn.classList.remove('selecionada', 'correta', 'errada');
        });

        this._alternativas.classList.remove('respondida');
        this._mostrarFeedback('', '');

        const btnProxima = this._btnProxima;
        btnProxima.classList.remove('visivel');
        btnProxima.textContent = opcoes.atual < opcoes.total ? 'Próximo' : 'Finalizar';

        this._partes.forEach(el => { el.hidden = false; });
        return true;
    }

    /** Aceita alternativas: [...] (API atual) ou alt_a..alt_d (formato antigo) */
    _extrairAlternativas(flashcard) {
        if (Array.isArray(flashcard.alternativas)) {
            return flashcard.alternativas
                .map((texto, i) => ({ letra: String.fromCharCode(97 + i), texto }))
                .filter(a => a.texto);
        }

        return ['a', 'b', 'c', 'd']
            .filter(l => flashcard[`alt_${l}`])
            .map(l => ({ letra: l, texto: flashcard[`alt_${l}`] }));
    }

    _escolher(letra) {
        if (!this.flashcard || this.respondida) return;
        const btn = this._botoes().find(b => this._letra(b) === letra);
        if (!btn || btn.hidden) return;

        this.respondida = true;
        this.respostaSelecionada = letra;

        btn.classList.add('selecionada');
        this._alternativas.classList.add('respondida');

        if (this.callbacks.onResponder) this.callbacks.onResponder(letra);
    }

    /**
     * Mostra o resultado devolvido pelo back-end.
     * @param {boolean} acertou
     * @param {Object} info - { correta, dominado, sequencia }
     */
    mostrarResultado(acertou, info = {}) {
        // Se o back-end não mandar a letra correta, só dá para marcar a escolhida
        const correta = (info.correta || '').toLowerCase() || (acertou ? this.respostaSelecionada : null);

        this._botoes().forEach(btn => {
            const letra = this._letra(btn);
            btn.classList.remove('selecionada', 'correta', 'errada');

            if (letra === correta) btn.classList.add('correta');
            else if (!acertou && letra === this.respostaSelecionada) btn.classList.add('errada');
        });

        let mensagem = acertou ? 'Acertou!' : 'Errou!';
        if (info.dominado) mensagem += ' Flashcard dominado!';
        else if (info.sequencia > 0) mensagem += ` Sequência: ${info.sequencia}/3`;
        this._mostrarFeedback(mensagem, acertou ? 'acerto' : 'erro');

        const btnProxima = this._btnProxima;
        btnProxima.classList.add('visivel');
        btnProxima.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    /** Erro ao falar com a API: destrava as alternativas para tentar de novo */
    mostrarErro(mensagem) {
        this.respondida = false;
        this.respostaSelecionada = null;
        this._alternativas?.classList.remove('respondida');
        this._botoes().forEach(b => b.classList.remove('selecionada'));
        this._mostrarFeedback(mensagem, 'erro');
    }

    _proximaVisivel() {
        return !!this._btnProxima && this._btnProxima.classList.contains('visivel');
    }

    _proximo() {
        if (!this.respondida || !this._proximaVisivel()) return;
        this._btnProxima.classList.remove('visivel'); // evita clique duplo
        if (this.callbacks.onProximo) this.callbacks.onProximo();
    }

    _mostrarFeedback(texto, tipo) {
        const el = this._feedback;
        if (!el) return;
        el.textContent = texto;
        el.className = `feedback-resposta ${tipo || ''}`.trim();
    }

    /** Esconde o card e zera o estado */
    limpar() {
        this.flashcard = null;
        this.respondida = false;
        this.respostaSelecionada = null;
        this.callbacks = { onResponder: null, onProximo: null };
        this._partes.forEach(el => { el.hidden = true; });
        this._mostrarFeedback('', '');
    }
}

export const flashcardComponent = new FlashcardComponent();
