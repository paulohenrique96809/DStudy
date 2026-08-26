// frontend/js/materias.js

/**
 * MATERIAS - Módulo de gerenciamento de matérias
 * 
 * Responsabilidades:
 * - Buscar matérias da API
 * - Renderizar lista de matérias na tela
 * - Gerenciar a seleção de uma matéria
 * - Navegar para a tela de estudo
 * 
 * Dependências:
 * - api.js (para comunicação com o Back-End)
 */

import { get } from './api.js';

/**
 * Classe para gerenciar matérias
 */
export class Materias {
    constructor() {
        this.lista = [];
        this.container = document.getElementById('materias-container');
    }

    /**
     * Carrega todas as matérias da API
     * @returns {Promise<Array>} - Lista de matérias
     */
    async carregar() {
        try {
            // Quando o Flask estiver pronto:
            // this.lista = await get('/materias');
            
            // Por enquanto, dados simulados para teste
            this.lista = [
                { id: 1, nome: 'Back-End', descricao: 'APIs, bancos de dados e lógica de servidor' },
                { id: 2, nome: 'Front-End', descricao: 'HTML, CSS e interatividade' },
                { id: 3, nome: 'Mobile', descricao: 'Desenvolvimento para dispositivos móveis' },
                { id: 4, nome: 'Inteligência Artificial', descricao: 'Machine Learning e algoritmos' },
                { id: 5, nome: 'Lógica de Programação', descricao: 'Algoritmos e estruturas de dados' },
                { id: 6, nome: 'Redes', descricao: 'TCP/IP, roteamento e segurança' },
                { id: 7, nome: 'Processos', descricao: 'Metodologias e ciclos de desenvolvimento' }
            ];
            
            this.renderizar();
            return this.lista;
            
        } catch (error) {
            console.error('❌ Erro ao carregar matérias:', error);
            throw error;
        }
    }

    /**
     * Renderiza as matérias no container HTML
     */
    renderizar() {
        if (!this.container) {
            console.warn('⚠️ Container de matérias não encontrado');
            return;
        }

        if (this.lista.length === 0) {
            this.container.innerHTML = '<p class="empty-state">Nenhuma matéria disponível.</p>';
            return;
        }

        // Gera HTML para cada matéria
        this.container.innerHTML = this.lista.map(materia => `
            <div class="materia-card" data-id="${materia.id}">
                <h3>${materia.nome}</h3>
                <p>${materia.descricao || 'Descrição não disponível'}</p>
                <button class="btn btn-primary btn-estudar" data-id="${materia.id}">
                    📖 Estudar
                </button>
            </div>
        `).join('');

        // Adiciona eventos aos botões
        this.container.querySelectorAll('.btn-estudar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.selecionar(id);
            });
        });
    }

    /**
     * Seleciona uma matéria para estudo
     * @param {number} id - ID da matéria
     */
    selecionar(id) {
        const materia = this.lista.find(m => m.id === id);
        if (!materia) {
            console.error(`❌ Matéria ${id} não encontrada`);
            return;
        }

        console.log(`📖 Matéria selecionada: ${materia.nome} (ID: ${id})`);
        
        // Dispara um evento personalizado para o main.js
        const event = new CustomEvent('materiaSelecionada', {
            detail: { materia }
        });
        document.dispatchEvent(event);
    }

    /**
     * Retorna uma matéria pelo ID
     * @param {number} id - ID da matéria
     * @returns {object|null} - Matéria encontrada ou null
     */
    getPorId(id) {
        return this.lista.find(m => m.id === id) || null;
    }
}

// Cria e exporta uma instância única (singleton)
export const materias = new Materias();