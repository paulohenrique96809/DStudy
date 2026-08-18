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
