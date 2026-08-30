// frontend/js/materias.js

import { get } from './api.js';
import { progresso } from './progresso.js';

const ICONES_MATERIAS = {
    'Back-End': '⚙️',
    'Front-End': '🎨',
    'Mobile': '📱',
    'Inteligência Artificial': '🤖',
    'Lógica de Programação': '🧠',
    'Redes': '🌐',
    'Processos': '📋'
};

const CORES_MATERIAS = {
    'Back-End': '#6c5ce7',
    'Front-End': '#00b894',
    'Mobile': '#0984e3',
    'Inteligência Artificial': '#e17055',
    'Lógica de Programação': '#fdcb6e',
    'Redes': '#00cec9',
    'Processos': '#fd79a8'
};

export class Materias {
    constructor() {
        this.lista = [];
        this.container = document.getElementById('materias-container');
        this.loading = false;
    }

    async carregar() {
        if (this.loading) return this.lista;
        
        this.loading = true;
        this.mostrarLoading();

        try {
            this.lista = await get('/materias');
            
            // ⭐ GARANTE QUE O PROGRESSO ESTÁ CARREGADO
            if (!progresso.dados) {
                await progresso.carregar();
            }
            
            console.log(`✅ [MATERIAS] ${this.lista.length} matérias carregadas`);
            this.renderizar();
            return this.lista;

        } catch (error) {
            console.error('❌ [MATERIAS] Erro:', error);
            this.mostrarErro('Erro ao carregar matérias.');
            throw error;

        } finally {
            this.loading = false;
        }
    }

    /**
     * ⭐ RENDERIZA USANDO OS DADOS MAIS RECENTES DO PROGRESSO
     */
    renderizar() {
        if (!this.container) return;

        if (this.lista.length === 0) {
            this.container.innerHTML = `<div class="empty-state"><p>📭 Nenhuma matéria disponível.</p></div>`;
            return;
        }

        // ⭐ USA OS DADOS MAIS RECENTES DO PROGRESSO
        const dadosProgresso = progresso.dados;

        this.container.innerHTML = this.lista.map(materia => {
            // ⭐ BUSCA O PROGRESSO DA MATÉRIA
            let p = { total: 0, dominados: 0, percentual: 0 };
            
            if (dadosProgresso && dadosProgresso.por_materia) {
                const encontrado = dadosProgresso.por_materia.find(m => m.id === materia.id);
                if (encontrado) {
                    p = encontrado;
                }
            }
            
            const percentual = Math.round(p.percentual || 0);
            const icone = ICONES_MATERIAS[materia.nome] || '📚';
            const cor = CORES_MATERIAS[materia.nome] || '#667eea';
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
                await this.selecionar(id);
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
        
        document.dispatchEvent(new CustomEvent('materiaSelecionada', { 
            detail: { materia } 
        }));
    }

    getPorId(id) {
        return this.lista.find(m => m.id === id) || null;
    }

    /**
     * ⭐ ATUALIZA O PROGRESSO E RE-RENDERIZA
     */
    async atualizarProgresso() {
        await progresso.carregar();
        this.renderizar();
    }

    mostrarLoading() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Carregando matérias...</p>
                </div>
            `;
        }
    }

    mostrarErro(mensagem) {
        if (this.container) {
            this.container.innerHTML = `
                <div class="error-state">
                    <p>❌ ${mensagem}</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">
                        🔄 Tentar novamente
                    </button>
                </div>
            `;
        }
    }
}

export const materias = new Materias();