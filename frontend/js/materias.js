// frontend/js/materias.js

/**
 * MATERIAS - Módulo de gerenciamento de matérias
 * 
 * Responsabilidades:
 * - Buscar matérias da API (real ou simulada)
 * - Renderizar lista de matérias na tela
 * - Gerenciar a seleção de uma matéria
 * - Navegar para a tela de estudo
 * 
 * Dependências:
 * - api.js (para comunicação com o Back-End)
 */

import { get, isModoSimulacao } from './api.js';

/**
 * Classe para gerenciar matérias
 */
export class Materias {
    constructor() {
        this.lista = [];
        this.container = document.getElementById('materias-container');
        this.loading = false;
    }

    /**
     * Carrega todas as matérias da API
     * @returns {Promise<Array>} - Lista de matérias
     */
    async carregar() {
        if (this.loading) return this.lista;
        
        this.loading = true;
        this.mostrarLoading();

        try {
            console.log(`📚 [MATERIAS] Buscando matérias... (${isModoSimulacao() ? 'SIMULAÇÃO' : 'API REAL'})`);
            
            // Busca da API
            this.lista = await get('/materias');
            
            console.log(`✅ [MATERIAS] ${this.lista.length} matérias carregadas`);
            this.renderizar();
            return this.lista;

        } catch (error) {
            console.error('❌ [MATERIAS] Erro ao carregar:', error);
            this.mostrarErro('Não foi possível carregar as matérias.');
            throw error;

        } finally {
            this.loading = false;
        }
    }

    /**
     * Renderiza as matérias no container HTML
     */
    renderizar() {
        if (!this.container) {
            console.warn('⚠️ [MATERIAS] Container não encontrado');
            return;
        }

        if (this.lista.length === 0) {
            this.container.innerHTML = `
                <div class="empty-state">
                    <p>📭 Nenhuma matéria disponível.</p>
                </div>
            `;
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
            console.error(`❌ [MATERIAS] Matéria ${id} não encontrada`);
            return;
        }

        console.log(`📖 [MATERIAS] Selecionada: ${materia.nome} (ID: ${id})`);
        
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

    /**
     * Mostra indicador de carregamento
     */
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

    /**
     * Mostra mensagem de erro
     * @param {string} mensagem - Mensagem de erro
     */
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

    // ============================================================
    // ⭐ NOVO MÉTODO ADICIONADO AQUI - Para debug
    // ============================================================

    /**
     * ⭐ DEBUG: Verifica os flashcards de uma matéria
     * @param {number} materiaId - ID da matéria
     */
    async debugFlashcards(materiaId) {
        console.log(`🔍 [DEBUG] Buscando flashcards da matéria ${materiaId}`);
        
        try {
            const resposta = await get(`/materias/${materiaId}/flashcards`);
            console.log(`📦 [DEBUG] Resposta:`, resposta);
            console.log(`📊 [DEBUG] Tipo: ${typeof resposta}`);
            console.log(`📊 [DEBUG] É array? ${Array.isArray(resposta)}`);
            
            if (Array.isArray(resposta) && resposta.length > 0) {
                console.log(`📝 [DEBUG] Primeiro item:`, resposta[0]);
                console.log(`📝 [DEBUG] Campos do primeiro item:`, Object.keys(resposta[0]));
                console.log(`📝 [DEBUG] pergunta: ${resposta[0].pergunta || '❌ NÃO ENCONTRADO'}`);
                console.log(`📝 [DEBUG] resposta: ${resposta[0].resposta || '❌ NÃO ENCONTRADO'}`);
            } else {
                console.warn(`⚠️ [DEBUG] Nenhum flashcard encontrado ou resposta vazia`);
            }
            
            return resposta;
        } catch (error) {
            console.error(`❌ [DEBUG] Erro:`, error);
            throw error;
        }
    }
}

// Cria e exporta uma instância única (singleton)
export const materias = new Materias();

// ⭐ Para debug no console
window.materiasDebug = materias;