// frontend/js/components/progresso.js

/**
 * PROGRESSO - Componentes visuais de progresso
 * 
 * Responsabilidades:
 * - Renderizar barras de progresso
 * - Renderizar indicadores de domínio
 * - Mostrar estatísticas visuais
 * 
 * Este componente é puramente visual - não contém lógica de negócio
 */

/**
 * Classe de componentes de progresso
 */
export class ProgressoComponent {
    /**
     * Cria uma barra de progresso
     * @param {number} percentual - Percentual de progresso (0-100)
     * @param {string} label - Texto da label
     * @param {string} cor - Cor da barra (opcional)
     * @returns {string} - HTML da barra
     */
    criarBarra(percentual, label, cor = '#667eea') {
        return `
            <div class="barra-progresso-component">
                ${label ? `<span class="barra-label">${label}</span>` : ''}
                <div class="barra-track">
                    <div class="barra-fill" style="width: ${Math.min(percentual, 100)}%; background: ${cor};"></div>
                </div>
                <span class="barra-percentual">${Math.round(percentual)}%</span>
            </div>
        `;
    }

    /**
     * Cria um badge de status
     * @param {string} status - 'dominado', 'estudando', 'pendente'
     * @returns {string} - HTML do badge
     */
    criarBadge(status) {
        const configs = {
            dominado: { classe: 'badge-success', texto: '✅ Dominado' },
            estudando: { classe: 'badge-warning', texto: '📖 Estudando' },
            pendente: { classe: 'badge-danger', texto: '⏳ Pendente' }
        };

        const config = configs[status] || configs.pendente;
        return `<span class="badge ${config.classe}">${config.texto}</span>`;
    }

    /**
     * Cria um card de estatística
     * @param {string} icone - Emoji ou ícone
     * @param {string} valor - Valor da estatística
     * @param {string} descricao - Descrição
     * @returns {string} - HTML do card
     */
    criarEstatistica(icone, valor, descricao) {
        return `
            <div class="estatistica-card">
                <div class="estatistica-icone">${icone}</div>
                <div class="estatistica-valor">${valor}</div>
                <div class="estatistica-descricao">${descricao}</div>
            </div>
        `;
    }

    /**
     * Cria um indicador de sequência de acertos
     * @param {number} sequencia - Número de acertos consecutivos
     * @param {number} maximo - Máximo para atingir o domínio (3)
     * @returns {string} - HTML do indicador
     */
    criarIndicadorSequencia(sequencia, maximo = 3) {
        const estrelas = Array.from({ length: maximo }, (_, i) => {
            const preenchida = i < sequencia;
            return `<span class="estrela ${preenchida ? 'preenchida' : 'vazia'}">${preenchida ? '⭐' : '☆'}</span>`;
        }).join('');

        return `
            <div class="indicador-sequencia">
                <span class="sequencia-label">Sequência:</span>
                <div class="estrelas-container">
                    ${estrelas}
                </div>
                ${sequencia >= maximo ? '<span class="dominado-label">🏆 DOMINADO!</span>' : ''}
            </div>
        `;
    }

    /**
     * Cria um gráfico de progresso por matéria
     * @param {Array} materias - Lista de matérias com progresso
     * @returns {string} - HTML do gráfico
     */
    criarGraficoMaterias(materias) {
        if (!materias || materias.length === 0) {
            return '<p>Nenhuma matéria com progresso.</p>';
        }

        return materias.map(m => `
            <div class="grafico-materia">
                <div class="grafico-header">
                    <span class="grafico-nome">${m.nome}</span>
                    <span class="grafico-percentual">${Math.round(m.percentual)}%</span>
                </div>
                <div class="grafico-barra">
                    <div class="grafico-fill" style="width: ${Math.min(m.percentual, 100)}%;"></div>
                </div>
                <span class="grafico-detalhes">${m.dominados}/${m.total} flashcards</span>
            </div>
        `).join('');
    }
}

// Cria e exporta uma instância única
export const progressoComponent = new ProgressoComponent();