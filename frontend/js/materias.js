// frontend/js/materias.js

/**
 * MATERIAS - Módulo de gerenciamento de matérias
 * 
 * Responsabilidades:
 * - Buscar matérias da API
 * - Renderizar lista de matérias
 * - USAR O PROGRESSO DO MÓDULO progresso.js
 */

import { get, isModoSimulacao } from './api.js';
import { progresso } from './progresso.js'; // ⭐ Importa o progresso

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
            console.log(`📚 [MATERIAS] Buscando matérias...`);
            
            // Busca matérias
            this.lista = await get('/materias');
            
            // ⭐ CARREGA O PROGRESSO (se não estiver carregado)
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
     * ⭐ RENDERIZA USANDO OS DADOS DO PROGRESSO
     */
    renderizar() {
        if (!this.container) {
            console.warn('⚠️ [MATERIAS] Container não encontrado');
            return;
        }

        if (this.lista.length === 0) {
            this.container.innerHTML = `<div class="empty-state"><p>📭 Nenhuma matéria disponível.</p></div>`;
            return;
        }

        this.container.innerHTML = this.lista.map(materia => {
            // ⭐ PEGA O PROGRESSO DO MÓDULO CENTRAL
            const p = progresso.getProgressoParaCard(materia.id);
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

        // Eventos dos botões
        this.container.querySelectorAll('.btn-estudar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.selecionar(id);
            });
        });
    }

    getStatus(percentual) {
        if (percentual === 100) return { texto: '🏆 Concluído', classe: 'status-concluido' };
        if (percentual >= 50) return { texto: '📖 Em andamento', classe: 'status-andamento' };
        if (percentual > 0) return { texto: '🔰 Iniciado', classe: 'status-iniciado' };
        return { texto: '⏳ Não iniciado', classe: 'status-nao-iniciado' };
    }

    selecionar(id) {
        const materia = this.lista.find(m => m.id === id);
        if (!materia) {
            console.error(`❌ Matéria ${id} não encontrada`);
            return;
        }
        console.log(`📖 Selecionada: ${materia.nome}`);
        document.dispatchEvent(new CustomEvent('materiaSelecionada', { detail: { materia } }));
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