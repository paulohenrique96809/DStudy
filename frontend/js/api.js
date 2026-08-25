// frontend/js/api.js

/**
 * API - Camada de comunicação com o Back-End
 * 
 * Responsabilidades:
 * - Fazer requisições HTTP para o Flask
 * - Tratar erros de rede e de resposta
 * - Converter respostas para JSON
 * 
 * Por enquanto, usa dados simulados para testes
 * Quando o Flask estiver pronto, será substituído pela URL real
 */

// URL base da API (será alterada quando o Flask estiver rodando)
// Exemplo real: http://localhost:5000/api
const API_BASE_URL = '';

/**
 * Função central para todas as requisições HTTP
 * 
 * @param {string} endpoint - Caminho da API (ex: '/materias')
 * @param {object} options - Configurações da requisição
 * @param {string} options.method - GET, POST, PUT, DELETE
 * @param {object} options.body - Dados para enviar (serão convertidos para JSON)
 * @param {object} options.headers - Headers adicionais
 * @returns {Promise} - Dados da resposta em JSON
 */
export async function apiRequest(endpoint, options = {}) {
    // Configuração padrão
    const config = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    // Se tiver body, adiciona à requisição
    if (options.body) {
        config.body = JSON.stringify(options.body);
    }

    const url = `${API_BASE_URL}${endpoint}`;

    try {
        console.log(`📡 Requisição ${config.method} para: ${url}`);

        const response = await fetch(url, config);

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            let errorMsg = `Erro ${response.status}: ${response.statusText}`;
            
            try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorMsg;
            } catch (e) {
                // Se não for JSON, mantém a mensagem padrão
            }
            
            throw new Error(errorMsg);
        }

        // Se não houver conteúdo (DELETE, por exemplo)
        if (response.status === 204) {
            return null;
        }

        const data = await response.json();
        console.log(`✅ Resposta recebida:`, data);
        return data;

    } catch (error) {
        console.error(`❌ Erro na requisição para ${endpoint}:`, error);
        throw error;
    }
}

/**
 * GET - Buscar dados
 * @param {string} endpoint - Caminho da API
 * @returns {Promise} - Dados da resposta
 */
export async function get(endpoint) {
    return apiRequest(endpoint, { method: 'GET' });
}

/**
 * POST - Enviar dados
 * @param {string} endpoint - Caminho da API
 * @param {object} data - Dados para enviar
 * @returns {Promise} - Dados da resposta
 */
export async function post(endpoint, data) {
    return apiRequest(endpoint, {
        method: 'POST',
        body: data
    });
}

/**
 * PUT - Atualizar dados
 * @param {string} endpoint - Caminho da API
 * @param {object} data - Dados para atualizar
 * @returns {Promise} - Dados da resposta
 */
export async function put(endpoint, data) {
    return apiRequest(endpoint, {
        method: 'PUT',
        body: data
    });
}

/**
 * DELETE - Remover dados
 * @param {string} endpoint - Caminho da API
 * @returns {Promise} - null em caso de sucesso
 */
export async function del(endpoint) {
    return apiRequest(endpoint, { method: 'DELETE' });
}

/**
 * 🧪 DADOS SIMULADOS - Para testes sem Flask
 * Estes dados serão removidos quando a API real estiver pronta
 */
export const dadosSimulados = {
    materias: [
        { id: 1, nome: 'Back-End', descricao: 'APIs, bancos de dados e lógica de servidor' },
        { id: 2, nome: 'Front-End', descricao: 'HTML, CSS e interatividade' },
        { id: 3, nome: 'Mobile', descricao: 'Desenvolvimento para dispositivos móveis' },
        { id: 4, nome: 'Inteligência Artificial', descricao: 'Machine Learning e algoritmos' },
        { id: 5, nome: 'Lógica de Programação', descricao: 'Algoritmos e estruturas de dados' },
        { id: 6, nome: 'Redes', descricao: 'TCP/IP, roteamento e segurança' },
        { id: 7, nome: 'Processos', descricao: 'Metodologias e ciclos de desenvolvimento' }
    ],
    
    flashcards: {
        1: [ // Back-End
            { id: 1, pergunta: 'O que é uma API?', resposta: 'Interface de Programação de Aplicações' },
            { id: 2, pergunta: 'O que é REST?', resposta: 'Arquitetura para APIs web' }
        ],
        2: [ // Front-End
            { id: 3, pergunta: 'O que é DOM?', resposta: 'Document Object Model' },
            { id: 4, pergunta: 'O que é CSS?', resposta: 'Cascading Style Sheets' }
        ]
    }
};

/**
 * Função para simular respostas da API
 * @param {string} endpoint - Caminho simulado
 * @param {object} data - Dados para retornar
 * @returns {object} - Os dados recebidos
 */
export function simularResposta(endpoint, data) {
    console.log(`🔵 [MODO SIMULAÇÃO] ${endpoint}:`, data);
    return data;
}

/**
 * Função para simular uma requisição GET com dados simulados
 * @param {string} endpoint - Caminho simulado
 * @returns {Promise} - Dados simulados
 */
export async function getSimulado(endpoint) {
    console.log(`🔵 [MODO SIMULAÇÃO] GET ${endpoint}`);
    
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Retorna dados baseado no endpoint
    if (endpoint === '/materias') {
        return simularResposta(endpoint, dadosSimulados.materias);
    }
    
    if (endpoint.startsWith('/materias/') && endpoint.includes('/flashcards')) {
        const materiaId = parseInt(endpoint.split('/')[2]);
        const flashcards = dadosSimulados.flashcards[materiaId] || [];
        return simularResposta(endpoint, flashcards);
    }
    
    // Se não encontrou, retorna vazio
    return simularResposta(endpoint, []);
}