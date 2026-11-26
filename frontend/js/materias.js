// frontend/js/materias.js
// Carrega as matérias da API e monta os painéis da página materias.html.

import { get } from './api.js';
import { progresso } from './progresso.js';

// Matérias do segundo ano (as demais vão para o terceiro ano)
const MATERIAS_SEGUNDO_ANO = [
    'Lógica de Programação',
    'Processos de Desenvolvimento de Software',
    'Redes e Segurança',
    'Carreiras e Competência'
];

// Rótulos curtos (com quebra de linha) para caber nos botões do design.
// Matéria que não estiver aqui usa o nome da API em maiúsculas.
const ROTULOS = {
    'Lógica de Programação': 'LÓGICA DE<br>PROGRAMAÇÃO',
    'Processos de Desenvolvimento de Software': 'PROCESSOS DE<br>DES. DE SOFTWARE',
    'Redes e Segurança': 'REDES<br>E SEGURANÇA',
    'Carreiras e Competência': 'CARREIRA E<br>COMPETÊNCIAS',
    'Modelagem e Desenvolvimento de Banco de Dados': 'MODELAGEM E DES.<br>DE BANCO DE DADOS',
    'Inteligência Artificial': 'INTELIGÊNCIA<br>ARTIFICIAL',
    'Programação Back-End': 'PROGRAMAÇÃO<br>BACK-END',
    'Programação Front-End': 'PROGRAMAÇÃO<br>FRONT-END',
    'Programação Mobile': 'PROGRAMAÇÃO<br>MOBILE',
    'Projeto Multidisciplinar em Desenvolvimento de Sistemas': 'PROJETO<br>MULTIDISCIPLINAR',
    'Versionamento de Código e Sistemas de Mensageria': 'VERSIONAMENTO<br>DE CÓDIGO'
};

export class Materias {
    constructor() {
        this.lista = [];
        this.destaqueId = null;
        this.containerSegundo = document.getElementById('materias-segundo-ano');
        this.containerTerceiro = document.getElementById('materias-terceiro-ano');
    }

    async carregar() {
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
            this._preencher('<p class="estado-msg">Nenhuma matéria disponível.</p>', '');
            return;
        }

        const segundo = this.lista.filter(m => MATERIAS_SEGUNDO_ANO.includes(m.nome));
        const terceiro = this.lista.filter(m => !MATERIAS_SEGUNDO_ANO.includes(m.nome));

        this._preencher(
            segundo.map(m => this._htmlBotao(m)).join(''),
            terceiro.map(m => this._htmlBotao(m)).join('')
        );

        // Os botões são links para flashcards.html?materia=ID; aqui só o destaque
        document.querySelectorAll('.btn-materia').forEach(btn => {
            const id = parseInt(btn.dataset.id);
            btn.addEventListener('mouseenter', () => this.atualizarDestaque(this._achar(id)));
            btn.addEventListener('focus', () => this.atualizarDestaque(this._achar(id)));
        });

        this.atualizarDestaque(this._achar(this.destaqueId) || this.lista[0]);
    }

    /**
     * Atualiza título e GIF do destaque.
     * O percentual vem da API; aqui ele só escolhe qual dos 4 GIFs mostrar.
     */
    atualizarDestaque(materia) {
        if (!materia) return;
        this.destaqueId = materia.id;

        const titulo = document.getElementById('titulo-materia-destaque');
        if (titulo) titulo.textContent = materia.nome;

        const p = progresso.getProgressoParaCard(materia.id);
        const nivel = Math.min(4, Math.floor((p.percentual || 0) / 25) + 1);

        document.querySelectorAll('#barra-progresso .gif-progresso').forEach(img => {
            img.classList.toggle('ativo', Number(img.dataset.nivel) === nivel);
        });
    }

    mostrarErro(mensagem) {
        if (!this.containerSegundo || !this.containerTerceiro) return;
        this._preencher(`<p class="estado-msg">${this._escape(mensagem)}</p>`, '');
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
        const rotulo = ROTULOS[materia.nome] || nome.toUpperCase();
        const dica = `${p.dominados || 0}/${p.total || 0} flashcards`;

        return `
            <a href="flashcards.html?materia=${materia.id}" class="btn-materia" data-id="${materia.id}" data-titulo="${nome}" title="${dica}">
                <img src="../assets/img/botaopadrao.png" alt="" class="fundo-btn">
                <span>${rotulo}</span>
            </a>
        `;
    }

    _escape(texto) {
        const div = document.createElement('div');
        div.textContent = texto ?? '';
        return div.innerHTML;
    }
}

export const materias = new Materias();
