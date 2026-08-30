// frontend/js/progresso.js

import { get } from './api.js';

export class Progresso {
    constructor() {
        this.dados = null;
        this.container = document.getElementById('progresso-container');
        this.loading = false;
    }

    async carregar() {
        if (this.loading) return this.dados;
        
        this.loading = true;
        console.log('📊 [PROGRESSO] Carregando...');

        try {
            // ⭐ SEMPRE BUSCA DA API (QUE MANTÉM O ESTADO PERSISTENTE)
            this.dados = await get('/progresso');
            console.log('✅ [PROGRESSO] Dados carregados:', this.dados);
            this.renderizar();
            return this.dados;

        } catch (error) {
            console.error('❌ [PROGRESSO] Erro:', error);
            throw error;

        } finally {
            this.loading = false;
        }
    }

    renderizar() {
        if (!this.container) return;

        if (!this.dados) {
            this.container.innerHTML = '<p>Carregando progresso...</p>';
            return;
        }

        const progressoGeral = this.dados.progresso_geral || 0;
        const materiasConcluidas = this.dados.materias_concluidas || 0;
        const totalMaterias = this.dados.total_materias || 0;
        const totalDominados = this.dados.flashcards_dominados || 0;
        const totalFlashcards = this.dados.total_flashcards || 0;

        this.container.innerHTML = `
            <div class="progresso-geral">
                <div class="progresso-header">
                    <span>📊 Progresso Geral</span>
                    <span class="percentual">${progressoGeral}%</span>
                </div>
                <div class="progresso-bar-grande">
                    <div class="progresso-fill" style="width: ${progressoGeral}%"></div>
                </div>
                <div class="progresso-stats">
                    <span>📚 ${materiasConcluidas}/${totalMaterias} matérias</span>
                    <span>🃏 ${totalDominados}/${totalFlashcards} flashcards</span>
                </div>
            </div>
            <div class="progresso-materias">
                ${this.dados.por_materia ? this.dados.por_materia.map(m => `
                    <div class="progresso-materia">
                        <div class="materia-info">
                            <span class="materia-nome">${m.nome}</span>
                            <span class="materia-status">${m.dominados}/${m.total} (${Math.round(m.percentual)}%)</span>
                        </div>
                        <div class="progresso-bar-pequena">
                            <div class="progresso-fill" style="width: ${m.percentual}%"></div>
                        </div>
                    </div>
                `).join('') : ''}
            </div>
        `;
    }

    /**
     * ⭐ ATUALIZA O PROGRESSO (RECARREGA DA API)
     */
    async atualizar() {
        await this.carregar();
    }

    getMateriaProgresso(materiaId) {
        if (!this.dados || !this.dados.por_materia) return null;
        return this.dados.por_materia.find(m => m.id === materiaId) || null;
    }

    getProgressoParaCard(materiaId) {
        const p = this.getMateriaProgresso(materiaId);
        if (p) {
            return {
                total: p.total || 0,
                dominados: p.dominados || 0,
                percentual: p.percentual || 0
            };
        }
        return { total: 0, dominados: 0, percentual: 0 };
    }
}

export const progresso = new Progresso();