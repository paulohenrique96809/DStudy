// frontend/js/materias.js

import { get } from './api.js';
import { progresso } from './progresso.js';

const ICONES = {
    'Back-End': '⚙️',
    'Front-End': '🎨',
    'Mobile': '📱',
    'Inteligência Artificial': '🤖',
    'Lógica de Programação': '🧠',
    'Redes': '🌐',
    'Processos': '📋',
    // ⭐ NOVOS ÍCONES
    'Versionamento de Código': '🔧',
    'Carreiras e Competências': '🌟',
    'Projeto Multidisciplinar': '🎯'
};

const CORES = {
    'Back-End': '#6c5ce7',
    'Front-End': '#00b894',
    'Mobile': '#0984e3',
    'Inteligência Artificial': '#e17055',
    'Lógica de Programação': '#fdcb6e',
    'Redes': '#00cec9',
    'Processos': '#fd79a8',
    // ⭐ NOVAS CORES
    'Versionamento de Código': '#e17055',
    'Carreiras e Competências': '#6c5ce7',
    'Projeto Multidisciplinar': '#00b894'
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
        if (!this.container) {
            console.warn('⚠️ [MATERIAS] Container não encontrado');
            return;
        }

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

        // Eventos dos botões
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