// frontend/js/progresso.js

import { get } from './api.js';

export class Progresso {
    constructor() {
        this.dados = null;
        this.container = document.getElementById('progresso-container');
    }

    /**
     * ⭐ BUSCA O PROGRESSO DE UMA MATÉRIA ESPECÍFICA
     * @param {number} materiaId 
     * @param {number} usuarioId 
     */
    async carregarMateria(materiaId) {
        try {
            const resposta = await get(`/materias/${materiaId}/progresso`);
            return resposta; // { materia, total_flashcards, dominados, percentual }
        } catch (error) {
            console.error(`❌ [PROGRESSO] Erro ao buscar matéria ${materiaId}:`, error);
            return { total_flashcards: 0, dominados: 0, percentual: 0 };
        }
    }

    /**
     * ⭐ BUSCA O PROGRESSO DE TODAS AS MATÉRIAS
     * (Faz uma chamada para cada matéria e soma)
     */
    async carregarTudo(materias) {
        console.log('📊 [PROGRESSO] Buscando progresso de todas as matérias...');
        
        try {
            let totalFlashcards = 0;
            let totalDominados = 0;
            const porMateria = [];

            for (const materia of materias) {
                const p = await this.carregarMateria(materia.id);
                
                // ⭐ Soma os totais gerais
                totalFlashcards += p.total_flashcards || 0;
                totalDominados += p.dominados || 0;

                // ⭐ Salva os dados por matéria para os cards usarem
                porMateria.push({
                    id: materia.id,
                    nome: materia.nome,
                    total: p.total_flashcards || 0, // Total real de flashcards da matéria
                    dominados: p.dominados || 0,    // Quantos o usuário dominou
                    percentual: p.percentual || 0
                });
            }

            // Calcula progresso geral
            const progressoGeral = totalFlashcards > 0 
                ? Math.round((totalDominados / totalFlashcards) * 100) 
                : 0;

            // Conta matérias concluídas (100%)
            const materiasConcluidas = porMateria.filter(m => m.percentual >= 100).length;

            this.dados = {
                total_materias: materias.length,
                materias_concluidas: materiasConcluidas,
                total_flashcards: totalFlashcards,
                flashcards_dominados: totalDominados,
                progresso_geral: progressoGeral,
                por_materia: porMateria // ⭐ Array com os dados de cada card
            };

            console.log('✅ [PROGRESSO] Calculado:', this.dados);
            this.renderizar();
            return this.dados;

        } catch (error) {
            console.error('❌ [PROGRESSO] Erro ao carregar tudo:', error);
            throw error;
        }
    }

    renderizar() {
        if (!this.container) return;

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
        // Se ainda não carregou, retorna zerado sem encher o console de avisos
        if (!this.dados || !this.dados.por_materia) {
            return { total: 0, dominados: 0, percentual: 0 };
        }
        
        const p = this.dados.por_materia.find(m => m.id === materiaId);
        
        if (!p) {
            return { total: 0, dominados: 0, percentual: 0 };
        }

        return { 
            total: p.total, 
            dominados: p.dominados, 
            percentual: p.percentual 
        };
    }
}

export const progresso = new Progresso();