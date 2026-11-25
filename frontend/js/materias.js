// frontend/js/materias.js

import { get } from './api.js';
import { progresso } from './progresso.js';

// Matérias do segundo ano (as demais vão para o terceiro ano)
const MATERIAS_SEGUNDO_ANO = [
    'Lógica de Programação',
    'Processos de Desenvolvimento de Software',
    'Redes e Segurança',
    'Carreiras e Competência'
];

export class Materias {
    constructor() {
        this.lista = [];
        this.containerSegundo = document.getElementById('materias-segundo-ano');
        this.containerTerceiro = document.getElementById('materias-terceiro-ano');
        this.destaqueId = null;
        console.log('📚 [MATERIAS] Containers:', this.containerSegundo, this.containerTerceiro);
    }

    async carregar() {
        console.log('📚 [MATERIAS] Carregando...');
        try {
            this.lista = await get('/materias');
            console.log(`✅ [MATERIAS] ${this.lista.length} matérias carregadas`);
            return this.lista;
        } catch (error) {
            console.error('❌ [MATERIAS] Erro:', error);
            this.mostrarErro('Erro ao carregar matérias.');
            throw error;
        }
    }

    renderizar() {
        if (!this.containerSegundo || !this.containerTerceiro) return;

        if (!this.lista || this.lista.length === 0) {
            this._preencher('<p class="empty-state">Nenhuma matéria disponível.</p>', '');
            return;
        }

        const segundo = this.lista.filter(m => MATERIAS_SEGUNDO_ANO.includes(m.nome));
        const terceiro = this.lista.filter(m => !MATERIAS_SEGUNDO_ANO.includes(m.nome));

        this._preencher(
            segundo.map(m => this._htmlBotao(m)).join(''),
            terceiro.map(m => this._htmlBotao(m)).join('')
        );

        [this.containerSegundo, this.containerTerceiro].forEach(container => {
            container.querySelectorAll('.btn-materia').forEach(btn => {
                const id = parseInt(btn.dataset.id);
                btn.addEventListener('click', () => this.selecionar(id));
                btn.addEventListener('mouseenter', () => this.atualizarDestaque(this._achar(id)));
                btn.addEventListener('focus', () => this.atualizarDestaque(this._achar(id)));
            });
        });

        // Mantém o destaque na matéria atual (ou na primeira da lista)
        this.atualizarDestaque(this._achar(this.destaqueId) || this.lista[0]);
    }

    /**
     * Atualiza o título e o GIF do bloco de destaque.
     * O percentual vem da API; aqui ele só escolhe qual dos 4 GIFs mostrar.
     */
    atualizarDestaque(materia) {
        if (!materia) return;
        this.destaqueId = materia.id;

        const titulo = document.getElementById('titulo-materia-destaque');
        if (titulo) {
            titulo.textContent = materia.nome;
            titulo.dataset.materiaId = materia.id;
        }

        const p = progresso.getProgressoParaCard(materia.id);
        const nivel = Math.min(4, Math.floor((p.percentual || 0) / 25) + 1);

        document.querySelectorAll('#barra-progresso .gif-progresso').forEach(img => {
            img.classList.toggle('ativo', Number(img.dataset.nivel) === nivel);
        });
    }

    async selecionar(id) {
        const materia = this._achar(id);
        if (!materia) {
            console.error(`❌ Matéria ${id} não encontrada`);
            return;
        }
        console.log(`📖 [MATERIAS] Selecionada: ${materia.nome}`);
        document.dispatchEvent(new CustomEvent('materiaSelecionada', { detail: { materia } }));
    }

    mostrarErro(mensagem) {
        this._preencher(`<p class="error-state">${this._escape(mensagem)}</p>`, '');
    }

    // ===== helpers =====

    _achar(id) {
        return this.lista.find(m => m.id === id);
    }

    _preencher(htmlSegundo, htmlTerceiro) {
        this.containerSegundo.innerHTML = htmlSegundo;
        this.containerTerceiro.innerHTML = htmlTerceiro;
    }

    _htmlBotao(materia) {
        const p = progresso.getProgressoParaCard(materia.id);
        const nome = this._escape(materia.nome);
        const dica = `${p.dominados || 0}/${p.total || 0} flashcards`;

        return `
            <button type="button" class="btn-materia" data-id="${materia.id}" data-titulo="${nome}" title="${dica}">
                <img src="assets/img/botaopadrao.png" alt="" class="fundo-btn">
                <span>${nome}</span>
            </button>
        `;
    }

    _escape(texto) {
        const div = document.createElement('div');
        div.textContent = texto ?? '';
        return div.innerHTML;
    }
}

export const materias = new Materias();
