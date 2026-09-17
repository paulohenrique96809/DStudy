// frontend/js/materias.js

import { get } from './api.js';
import { progresso } from './progresso.js';

// ⭐ NOMES OFICIAIS DA API
const ICONES = {
    'Modelagem e Desenvolvimento de Banco de Dados': '🗄️',
    'Inteligência Artificial': '🤖',
    'Programação Back-End': '⚙️',
    'Programação Front-End': '🎨',
    'Programação Mobile': '📱',
    'Projeto Multidisciplinar em Desenvolvimento de Sistemas': '🎯',
    'Versionamento de Código e Sistemas de Mensageria': '🔧',
    'Lógica de Programação': '🧠',
    'Processos de Desenvolvimento de Software': '📋',
    'Redes e Segurança': '🌐'
};

const CORES = {
    'Modelagem e Desenvolvimento de Banco de Dados': '#6c5ce7',
    'Inteligência Artificial': '#e17055',
    'Programação Back-End': '#0984e3',
    'Programação Front-End': '#00b894',
    'Programação Mobile': '#fd79a8',
    'Projeto Multidisciplinar em Desenvolvimento de Sistemas': '#fdcb6e',
    'Versionamento de Código e Sistemas de Mensageria': '#a29bfe',
    'Lógica de Programação': '#fab1a0',
    'Processos de Desenvolvimento de Software': '#00cec9',
    'Redes e Segurança': '#d63031'
};

export class Materias {
    constructor() {
        this.lista = [];
        this.container = document.getElementById('materias-container');
        console.log('📚 [MATERIAS] Container:', this.container);
    }

    async carregar() {
        console.log('📚 [MATERIAS] Carregando...');
        try {
            this.lista = await get('/materias');
            console.log(`✅ [MATERIAS] ${this.lista.length} matérias carregadas`);
            this.renderizar();
            return this.lista;
        } catch (error) {
            console.error('❌ [MATERIAS] Erro:', error);
            this.container.innerHTML = `<div class="error-state"><p>❌ Erro ao carregar matérias</p><button class="btn btn-primary" onclick="location.reload()">🔄 Tentar novamente</button></div>`;
            throw error;
        }
    }

    renderizar() {
        if (!this.container) return;

        if (!this.lista || this.lista.length === 0) {
            this.container.innerHTML = `<div class="empty-state"><p>📭 Nenhuma matéria disponível.</p></div>`;
            return;
        }

        console.log(`📚 [MATERIAS] Renderizando ${this.lista.length} matérias...`);

        this.container.innerHTML = this.lista.map(materia => {
            const p = progresso.getProgressoParaCard(materia.id);
            const percentual = Math.round(p.percentual || 0);
            const icone = ICONES[materia.nome] || '📚';
            const cor = CORES[materia.nome] || '#667eea';
            const status = this.getStatus(percentual);

            return `
                <div class="materia-card" data-id="${materia.id}" style="border-left-color: ${cor};">
                    <div class="materia-header">
                        <span class="materia-icone" style="background: ${cor}20; color: ${cor};">
                            ${icone}
                        </span>
                        <span class="materia-status ${status.classe}">${status.texto}</span>
                    </div>
                    <h3 class="materia-nome">${materia.nome}</h3>
                    <p class="materia-descricao">${materia.descricao || 'Sem descrição'}</p>

                    <div class="materia-progresso">
                        <div class="progresso-info">
                            <span class="progresso-texto">${p.dominados}/${p.total} flashcards</span>
                            <span class="progresso-percentual">${percentual}%</span>
                        </div>
                        <div class="progresso-bar">
                            <div class="progresso-fill" style="width: ${percentual}%; background: ${cor};"></div>
                        </div>
                    </div>

                    <button class="btn btn-primary btn-estudar" data-id="${materia.id}">
                        📖 Estudar
                    </button>
                </div>
            `;
        }).join('');

        this.container.querySelectorAll('.btn-estudar').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = parseInt(e.target.dataset.id);
                btn.disabled = true;
                btn.textContent = '⏳ Carregando...';
                await this.selecionar(id);
                btn.disabled = false;
                btn.textContent = '📖 Estudar';
            });
        });
    }

    getStatus(percentual) {
        if (percentual === 100) return { texto: '🏆 Concluído', classe: 'status-concluido' };
        if (percentual >= 50) return { texto: '📖 Em andamento', classe: 'status-andamento' };
        if (percentual > 0) return { texto: '🔰 Iniciado', classe: 'status-iniciado' };
        return { texto: '⏳ Não iniciado', classe: 'status-nao-iniciado' };
    }

    async selecionar(id) {
        const materia = this.lista.find(m => m.id === id);
        if (!materia) {
            console.error(`❌ Matéria ${id} não encontrada`);
            return;
        }
        console.log(`📖 [MATERIAS] Selecionada: ${materia.nome}`);
        document.dispatchEvent(new CustomEvent('materiaSelecionada', { detail: { materia } }));
    }
}

export const materias = new Materias();