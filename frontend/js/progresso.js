// frontend/js/progresso.js

/**
 * PROGRESSO - Módulo de gerenciamento de progresso
 * 
 * Responsabilidades:
 * - Buscar progresso do usuário na API
 * - Renderizar barras de progresso
 * - Mostrar estatísticas de domínio
 * - Atualizar progresso em tempo real
 * 
 * Dependências:
 * - api.js (para comunicação com o Back-End)
 * - components/progresso.js (para componentes visuais)
 */

import { get } from './api.js';
import { progressoComponent } from './components/progresso.js';

/**
 * Classe para gerenciar o progresso
 */
export class Progresso {
    constructor() {
        this.dados = null;
        this.container = document.getElementById('progresso-container');
    }

    /**
     * Carrega o progresso do usuário
     * @param {number} materiaId - ID da matéria (opcional)
     * @returns {Promise<object>} - Dados de progresso
     */
    async carregar(materiaId = null) {
        try {
            // Quando o Flask estiver pronto:
            // const endpoint = materiaId 
            //     ? `/progresso/materia/${materiaId}`
            //     : '/progresso';
            // this.dados = await get(endpoint);
            
            // Dados simulados para teste
            this.dados = {
                total_materias: 7,
                materias_concluidas: 2,
                total_flashcards: 50,
                flashcards_dominados: 15,
                progresso_geral: 30,
                por_materia: [
                    { id: 1, nome: 'Back-End', total: 10, dominados: 3, percentual: 30 },
                    { id: 2, nome: 'Front-End', total: 8, dominados: 5, percentual: 62.5 },
                    { id: 3, nome: 'Mobile', total: 6, dominados: 0, percentual: 0 },
                    { id: 4, nome: 'Inteligência Artificial', total: 8, dominados: 2, percentual: 25 },
                    { id: 5, nome: 'Lógica de Programação', total: 7, dominados: 4, percentual: 57.1 },
                    { id: 6, nome: 'Redes', total: 6, dominados: 1, percentual: 16.7 },
                    { id: 7, nome: 'Processos', total: 5, dominados: 0, percentual: 0 }
                ]
            };

            this.renderizar();
            return this.dados;

        } catch (error) {
            console.error('❌ Erro ao carregar progresso:', error);
            throw error;
        }
    }

    /**
     * Renderiza o progresso na tela
     */
    renderizar() {
        if (!this.container) {
            console.warn('⚠️ Container de progresso não encontrado');
            return;
        }

        if (!this.dados) {
            this.container.innerHTML = '<p>Nenhum dado de progresso disponível.</p>';
            return;
        }

        // Renderiza o progresso geral
        const html = `
            <div class="progresso-geral">
                <div class="progresso-header">
                    <span>📊 Progresso Geral</span>
                    <span class="percentual">${this.dados.progresso_geral}%</span>
                </div>
                <div class="progresso-bar-grande">
                    <div class="progresso-fill" style="width: ${this.dados.progresso_geral}%"></div>
                </div>
                <div class="progresso-stats">
                    <span>📚 ${this.dados.materias_concluidas}/${this.dados.total_materias} matérias</span>
                    <span>🃏 ${this.dados.flashcards_dominados}/${this.dados.total_flashcards} flashcards</span>
                </div>
            </div>
            <div class="progresso-materias">
                ${this.dados.por_materia.map(m => `
                    <div class="progresso-materia">
                        <div class="materia-info">
                            <span class="materia-nome">${m.nome}</span>
                            <span class="materia-status">${m.dominados}/${m.total} (${Math.round(m.percentual)}%)</span>
                        </div>
                        <div class="progresso-bar-pequena">
                            <div class="progresso-fill" style="width: ${m.percentual}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        this.container.innerHTML = html;
    }

    /**
     * Atualiza o progresso de uma matéria específica
     * @param {number} materiaId - ID da matéria
     * @param {number} dominados - Novo número de flashcards dominados
     */
    async atualizarMateria(materiaId, dominados) {
        try {
            // Quando o Flask estiver pronto:
            // const resultado = await put(`/progresso/materia/${materiaId}`, {
            //     dominados: dominados
            // });
            
            // Simula atualização
            const materia = this.dados.por_materia.find(m => m.id === materiaId);
            if (materia) {
                materia.dominados = dominados;
                materia.percentual = (dominados / materia.total) * 100;
                
                // Recalcula progresso geral
                const total = this.dados.por_materia.reduce((acc, m) => acc + m.total, 0);
                const dominadosTotal = this.dados.por_materia.reduce((acc, m) => acc + m.dominados, 0);
                this.dados.progresso_geral = Math.round((dominadosTotal / total) * 100);
                this.dados.flashcards_dominados = dominadosTotal;
                
                this.renderizar();
            }
            
            return this.dados;

        } catch (error) {
            console.error('❌ Erro ao atualizar progresso:', error);
            throw error;
        }
    }

    /**
     * Retorna o progresso de uma matéria específica
     * @param {number} materiaId - ID da matéria
     * @returns {object|null} - Dados da matéria ou null
     */
    getMateriaProgresso(materiaId) {
        if (!this.dados) return null;
        return this.dados.por_materia.find(m => m.id === materiaId) || null;
    }
}

// Cria e exporta uma instância única
export const progresso = new Progresso();