// URL base da API - quando o Flask estiver rodando, será algo como:
// const API_BASE_URL = 'http://localhost:5000/api';
// Por enquanto, deixamos vazio para testes sem servidor
const API_BASE_URL = '';
/**
 * Função genérica para fazer requisições HTTP
 * 
 * @param {string} endpoint - O caminho da API (ex: '/materias')
 * @param {object} options - Opções da requisição (method, body, headers)
 * @returns {Promise} - Retorna uma Promise com a resposta convertida para JSON
 * 
 * Exemplo de uso:
 * const materias = await apiRequest('/materias', { method: 'GET' });
 */
export async function apiRequest(endpoint, options = {}) {
    // Define os headers padrão
    const defaultHeaders = {
        'Content-Type': 'application/json',
        // Se tivesse autenticação, seria aqui:
        // 'Authorization': `Bearer ${token}`
    };

    // Configura a requisição completa
    const config = {
        method: options.method || 'GET',
        headers: {
            ...defaultHeaders,
            ...options.headers
        },
        // Se tiver body, converte para JSON
        body: options.body ? JSON.stringify(options.body) : undefined
    };

    // Monta a URL completa
    const url = `${API_BASE_URL}${endpoint}`;

    try {
        // Faz a requisição
        const response = await fetch(url, config);

        // Verifica se a resposta foi bem-sucedida (status 200-299)
        if (!response.ok) {
            // Tenta extrair a mensagem de erro da resposta
            let errorMessage = `Erro ${response.status}: ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // Se não for JSON, mantém a mensagem padrão
            }
            throw new Error(errorMessage);
        }

        // Se a resposta não tiver conteúdo (ex: DELETE), retorna vazio
        if (response.status === 204) {
            return null;
        }

        // Converte a resposta para JSON
        const data = await response.json();
        return data;

    } catch (error) {
        // Tratamento de erros de rede (ex: servidor offline)
        console.error('Erro na requisição:', error);
        throw error; // Re-lança o erro para quem chamou tratar
    }
}

/**
 * Função conveniente para requisições GET
 * 
 * @param {string} endpoint - O caminho da API
 * @returns {Promise} - Retorna os dados da resposta
 * 
 * Exemplo: const materias = await get('/materias');
 */
export async function get(endpoint) {
    return apiRequest(endpoint, { method: 'GET' });
}

/**
 * Função conveniente para requisições POST
 * 
 * @param {string} endpoint - O caminho da API
 * @param {object} data - Os dados a serem enviados no corpo da requisição
 * @returns {Promise} - Retorna os dados da resposta
 * 
 * Exemplo: const resultado = await post('/flashcards/responder', { flashcardId: 1, acertou: true });
 */
export async function post(endpoint, data) {
    return apiRequest(endpoint, {
        method: 'POST',
        body: data
    });
}

/**
 * Função conveniente para requisições PUT
 * 
 * @param {string} endpoint - O caminho da API
 * @param {object} data - Os dados a serem enviados no corpo da requisição
 * @returns {Promise} - Retorna os dados da resposta
 */
export async function put(endpoint, data) {
    return apiRequest(endpoint, {
        method: 'PUT',
        body: data
    });
}

/**
 * Função conveniente para requisições DELETE
 * 
 * @param {string} endpoint - O caminho da API
 * @returns {Promise} - Retorna null em caso de sucesso
 */
export async function del(endpoint) {
    return apiRequest(endpoint, { method: 'DELETE' });
}

// Para testes iniciais sem servidor, podemos simular dados
// Isso será removido quando o Flask estiver pronto
export function simularResposta(dados) {
    console.log('🔵 [MODO TESTE] Dados simulados:', dados);
    return dados;
}

