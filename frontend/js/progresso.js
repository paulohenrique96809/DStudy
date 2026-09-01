// frontend/js/progresso.js

import { get } from './api.js';

export class Progresso {
    constructor() {
        this.dados = null;
        this.container = document.getElementById('progresso-container');
        console.log('📊 [PROGRESSO] Container:', this.container);
    }

    async carregar() {
        console.log('📊 [PROGRESSO] Carregando...');
        try {
            this.dados = await get('/progresso');
            console.log('✅ [PROGRESSO] Carregado:', this.dados);
            this.renderizar();
            return this.dados;
        } catch (error) {
            console.error('❌ [PROGRESSO] Erro:', error);
            this.container.innerHTML = `<div class="error-state"><p>❌ Erro ao carregar progresso</p></div>`;
            throw error;
        }
    }

    renderizar() {
        if (!this.container) {
            console.warn('⚠️ [PROGRESSO] Container não encontrado');
            return;
        }

        if (!this.dados) {
            this.container.innerHTML = '<p>Carregando progresso...</p>';
            return;
        }

        const geral = this.dados.progresso_geral || 0;
        const concluidas = this.dados.materias_concluidas || 0;
        const total = this.dados.total_materias || 0;
        const dominados = this.dados.flashcards_dominados || 0;
        const totalFlash = this.dados.total_flashcards || 0;

        this.container.innerHTML = `
            <div class="progresso-geral">
                <div class="progresso-header">
                    <span>📊 Progresso Geral</span>
                    <span class="percentual">${geral}%</span>
                </div>
                <div class="progresso-bar-grande">
                    <div class="progresso-fill" style="width: ${geral}%"></div>
                </div>
                <div class="progresso-stats">
                    <span>📚 ${concluidas}/${total} matérias</span>
                    <span>🃏 ${dominados}/${totalFlash} flashcards</span>
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

    getProgressoParaCard(materiaId) {
        if (!this.dados || !this.dados.por_materia) {
            return { total: 0, dominados: 0, percentual: 0 };
        }
        const p = this.dados.por_materia.find(m => m.id === materiaId);
        return p ? { total: p.total, dominados: p.dominados, percentual: p.percentual } : { total: 0, dominados: 0, percentual: 0 };
    }
}

export const progresso = new Progresso();