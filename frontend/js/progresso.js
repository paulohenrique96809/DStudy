// frontend/js/progresso.js

import { get } from './api.js';

export class Progresso {
    constructor() {
        // Guarda os dados do progresso geral e por matéria
        this.dados = null;
        // Referência ao container HTML onde o progresso geral será exibido
        this.container = document.getElementById('progresso-container');
    }

    /**
<<<<<<< Updated upstream
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
=======
     * Busca o progresso de UMA matéria específica na API
     * @param {number} materiaId - ID da matéria
     * @param {number} usuarioId - ID do usuário
     */
    async carregarMateria(materiaId, usuarioId = 1) {
        try {
            // Faz a requisição GET passando o usuario_id na URL
            const resposta = await get(`/materias/${materiaId}/progresso?usuario_id=${usuarioId}`);
            // Retorna o objeto: { materia, total_flashcards, dominados, percentual }
            return resposta; 
        } catch (error) {
            // Se der erro (ex: matéria não existe), retorna zeros
            console.error(`❌ [PROGRESSO] Erro ao buscar matéria ${materiaId}:`, error);
            return { total_flashcards: 0, dominados: 0, percentual: 0 };
        }
    }

    /**
     * Busca o progresso de TODAS as matérias e calcula o geral
     * @param {array} materias - Lista de matérias
     * @param {number} usuarioId - ID do usuário
     */
    async carregarTudo(materias, usuarioId = 1) {
        console.log('📊 [PROGRESSO] Buscando progresso de todas as matérias...');
        
        try {
            // Variáveis para somar o progresso geral
            let totalFlashcards = 0;
            let totalDominados = 0;
            // Array que vai guardar o progresso de cada matéria
            const porMateria = [];

            // Para cada matéria, busca o progresso individual
            for (const materia of materias) {
                const p = await this.carregarMateria(materia.id, usuarioId);
                
                // Soma os totais para o progresso geral
                totalFlashcards += p.total_flashcards || 0;
                totalDominados += p.dominados || 0;

                // Adiciona ao array que o materias.js vai usar
                porMateria.push({
                    id: materia.id,
                    nome: materia.nome,
                    total: p.total_flashcards || 0,
                    dominados: p.dominados || 0,
                    percentual: p.percentual || 0
                });
            }

            // Calcula a porcentagem geral (ex: 5 dominados de 200 = 2.5% -> 3%)
            const progressoGeral = totalFlashcards > 0 
                ? Math.round((totalDominados / totalFlashcards) * 100) 
                : 0;

            // Conta quantas matérias têm 100% de domínio
            const materiasConcluidas = porMateria.filter(m => m.percentual >= 100).length;

            // Monta o objeto final
            this.dados = {
                total_materias: materias.length,
                materias_concluidas: materiasConcluidas,
                total_flashcards: totalFlashcards,
                flashcards_dominados: totalDominados,
                progresso_geral: progressoGeral,
                por_materia: porMateria // Array com dados de cada card
            };

            console.log('✅ [PROGRESSO] Calculado:', this.dados);
            
            // Renderiza o progresso geral (a barra lá embaixo)
            this.renderizar();
            
            return this.dados;

        } catch (error) {
>>>>>>> Stashed changes
            console.error('❌ [PROGRESSO] Erro ao carregar tudo:', error);
            throw error;
        }
    }

    /**
     * Renderiza a barra de progresso geral
     */
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

        // HTML do progresso geral
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
        `;
    }

<<<<<<< Updated upstream
     getProgressoParaCard(materiaId) {
        // Se ainda não carregou, retorna zerado sem encher o console de avisos
=======
    /**
     * Retorna o progresso de UMA matéria para o card
     * Usado pelo materias.js
     */
    getProgressoParaCard(materiaId) {
        // Se ainda não carregou, retorna zeros
>>>>>>> Stashed changes
        if (!this.dados || !this.dados.por_materia) {
            return { total: 0, dominados: 0, percentual: 0 };
        }
        
<<<<<<< Updated upstream
        const p = this.dados.por_materia.find(m => m.id === materiaId);
        
=======
        // Procura a matéria no array
        const p = this.dados.por_materia.find(m => m.id === materiaId);
        
        // Se não achou, retorna zeros
>>>>>>> Stashed changes
        if (!p) {
            return { total: 0, dominados: 0, percentual: 0 };
        }

<<<<<<< Updated upstream
=======
        // Retorna os dados formatados
>>>>>>> Stashed changes
        return { 
            total: p.total, 
            dominados: p.dominados, 
            percentual: p.percentual 
        };
    }
}

export const progresso = new Progresso();