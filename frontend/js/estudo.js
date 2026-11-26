// frontend/js/estudo.js
// Controla a sessão de estudo da página flashcards.html.

import { get, post } from './api.js';
import { flashcardComponent } from './components/flashcard.js';

export class Estudo {
    constructor() {
        this.materia = null;
        this.flashcards = [];
        this.flashcardAtual = null;
        this.indiceAtual = 0;
        this.estaRespondendo = false;
        this.container = document.getElementById('estudo-container'); // mensagens da sessão
    }

    // ==========================================
    // SESSÃO
    // ==========================================

    async iniciar(materia) {
        this.materia = materia;
        console.log(`📖 [ESTUDO] Iniciando: ${materia.nome}`);

        this.limpar();
        this.mostrarLoading();

        try {
            const resposta = await get(`/materias/${materia.id}/flashcards`);
            this.flashcards = Array.isArray(resposta) ? resposta.filter(f => f && f.pergunta) : [];

            if (this.flashcards.length === 0) {
                await this.fimDaFila();
                return;
            }

            console.log(`✅ [ESTUDO] ${this.flashcards.length} flashcards carregados`);
            this.mostrarFlashcard();

        } catch (error) {
            console.error('❌ [ESTUDO] Erro:', error);
            this.mostrarMensagem('Erro ao carregar flashcards.');
        }
    }

    mostrarFlashcard() {
        if (this.indiceAtual >= this.flashcards.length) {
            this.fimDaFila();
            return;
        }

        this.flashcardAtual = this.flashcards[this.indiceAtual];
        this.estaRespondendo = false;

        const ok = flashcardComponent.renderizar(this.flashcardAtual, {
            materia: this.materia.nome,
            atual: this.indiceAtual + 1,
            total: this.flashcards.length,
            onResponder: (letra) => this.responder(letra),
            onProximo: () => this.proximo()
        });

        if (!ok) {
            this.mostrarMensagem('Flashcard inválido.');
            return;
        }

        this._esconderMensagens();
    }

    async responder(letraEscolhida) {
        if (this.estaRespondendo || !this.flashcardAtual) return;
        this.estaRespondendo = true;

        try {
            // O usuário vem do token JWT; o back-end decide acerto, domínio e fila
            const resultado = await post('/responder', {
                flashcard_id: this.flashcardAtual.id,
                resposta: letraEscolhida
            });

            flashcardComponent.mostrarResultado(resultado.acertou, {
                correta: resultado.correta || null,
                dominado: resultado.dominado,
                sequencia: resultado.acertos_consecutivos
            });

        } catch (error) {
            console.error('❌ [ESTUDO] Erro ao registrar:', error);
            flashcardComponent.mostrarErro(`Erro: ${error.message}`);
            this.estaRespondendo = false;
        }
    }

    proximo() {
        this.indiceAtual++;
        this.mostrarFlashcard();
    }

    /**
     * Acabou a fila atual: pergunta ao back-end o que fazer.
     * - há flashcards disponíveis         -> "Rodada concluída"
     * - tudo dominado                     -> "Parabéns"
     * - nada disponível, mas faltam cards -> estão na espera da repetição espaçada
     */
    async fimDaFila() {
        this.mostrarLoading();

        try {
            const id = this.materia.id;
            const disponiveis = await get(`/materias/${id}/flashcards`);

            if (Array.isArray(disponiveis) && disponiveis.length > 0) {
                this.mostrarRodadaConcluida(disponiveis.length);
                return;
            }

            // Lista vazia não quer dizer "dominou tudo": confere no progresso
            const p = await get(`/materias/${id}/progresso`);
            if (p.total_flashcards > 0 && p.dominados >= p.total_flashcards) {
                this.concluirMateria();
            } else {
                this.mostrarEmEspera(p.dominados, p.total_flashcards);
            }

        } catch (error) {
            console.error('❌ [ESTUDO] Erro ao verificar a fila:', error);
            this.mostrarMensagem('Erro ao verificar a fila de estudos.');
        }
    }

    // ==========================================
    // TELAS DE FIM DE SESSÃO
    // ==========================================

    _voltar() {
        window.location.href = 'materias.html';
    }

    mostrarRodadaConcluida(disponiveis) {
        this._mostrarCaixa({
            titulo: 'Rodada concluída!',
            linhas: [
                'Você respondeu todos os flashcards desta rodada.',
                `Já há ${disponiveis} flashcard(s) liberado(s) para a próxima.`
            ],
            botoes: [
                { texto: 'Continuar', aoClicar: () => this.iniciar(this.materia) },
                { texto: 'Voltar', aoClicar: () => this._voltar() }
            ]
        });
    }

    mostrarEmEspera(dominados, total) {
        this._mostrarCaixa({
            titulo: 'Rodada concluída!',
            linhas: [
                `Você dominou ${dominados} de ${total} flashcards.`,
                'Os que faltam voltam a aparecer em breve.'
            ],
            botoes: [
                { texto: 'Tentar de novo', aoClicar: () => this.iniciar(this.materia) },
                { texto: 'Voltar', aoClicar: () => this._voltar() }
            ]
        });
    }

    concluirMateria() {
        console.log('🏆 [ESTUDO] Matéria 100% dominada!');
        this._mostrarCaixa({
            titulo: 'Parabéns!',
            linhas: ['Você dominou todos os flashcards desta matéria!'],
            botoes: [{ texto: 'Voltar', aoClicar: () => this._voltar() }]
        });
    }

    // ==========================================
    // MENSAGENS (#estudo-container)
    // ==========================================

    /** Zera a sessão e esconde card e mensagens */
    limpar() {
        flashcardComponent.limpar();
        this.flashcards = [];
        this.flashcardAtual = null;
        this.indiceAtual = 0;
        this.estaRespondendo = false;
        this._esconderMensagens();
    }

    mostrarMensagem(texto) {
        flashcardComponent.limpar();
        if (!this.container) return;
        this.container.innerHTML = '';
        if (texto) {
            const p = document.createElement('p');
            p.className = 'estudo-texto';
            p.textContent = texto;
            this.container.appendChild(p);
        }
        this.container.hidden = !texto;
    }

    mostrarLoading() {
        this.mostrarMensagem('Carregando flashcards...');
    }

    _esconderMensagens() {
        if (!this.container) return;
        this.container.innerHTML = '';
        this.container.hidden = true;
    }

    _mostrarCaixa({ titulo, linhas = [], botoes = [] }) {
        flashcardComponent.limpar();
        if (!this.container) return;

        this.container.innerHTML = '';

        const h = document.createElement('h2');
        h.className = 'estudo-titulo';
        h.textContent = titulo;
        this.container.appendChild(h);

        linhas.forEach(linha => {
            const p = document.createElement('p');
            p.className = 'estudo-texto';
            p.textContent = linha;
            this.container.appendChild(p);
        });

        const area = document.createElement('div');
        area.className = 'estudo-botoes';
        botoes.forEach(({ texto, aoClicar }) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'btn-estudo';
            b.textContent = texto;
            b.addEventListener('click', aoClicar);
            area.appendChild(b);
        });
        this.container.appendChild(area);

        this.container.hidden = false;
    }
}

export const estudo = new Estudo();
