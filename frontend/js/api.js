// frontend/js/api.js

/**
 * API - Camada de comunicação com o Back-End
 * 
 * Responsabilidades:
 * - Centralizar todas as requisições HTTP para o Flask
 * - Tratar erros de rede e de resposta
 * - Converter respostas para JSON
 * - Gerenciar autenticação (futuramente)
 * 
 * Funcionalidades:
 * - apiRequest(): função central para todas as requisições
 * - get(), post(), put(), delete(): funções convenientes
 * - setBaseUrl(): configurar URL da API
 * - setToken(): configurar token de autenticação
 * 
 * Fluxo:
 *    módulo.js → api.js → fetch() → Flask → resposta
 */

// ===== CONFIGURAÇÃO =====

/**
 * URL base da API
 * 
 * Em desenvolvimento: http://localhost:5000/api
 * Em produção: URL do servidor
 */
let API_BASE_URL = '';

/**
 * Token de autenticação (será usado futuramente)
 */
let AUTH_TOKEN = null;

/**
 * Modo de simulação (true = usa dados simulados, false = usa API real)
 * 
 * Por enquanto, usamos true para testes sem Flask
 * Quando o Flask estiver pronto, mudar para false
 */
let MODO_SIMULACAO = true;

/**
 * Configura a URL base da API
 * @param {string} url - URL base (ex: 'http://localhost:5000/api')
 */
export function setBaseUrl(url) {
    API_BASE_URL = url;
    console.log(`🔧 URL da API configurada: ${API_BASE_URL}`);
}

/**
 * Configura o token de autenticação
 * @param {string} token - Token JWT ou similar
 */
export function setToken(token) {
    AUTH_TOKEN = token;
    console.log(`🔑 Token de autenticação configurado`);
}

/**
 * Ativa/desativa o modo de simulação
 * @param {boolean} ativo - true para simular, false para API real
 */
export function setModoSimulacao(ativo) {
    MODO_SIMULACAO = ativo;
    console.log(`🔄 Modo de simulação: ${ativo ? 'ATIVADO' : 'DESATIVADO'}`);
}

/**
 * Retorna o modo atual de simulação
 * @returns {boolean} - true se estiver em modo de simulação
 */
export function isModoSimulacao() {
    return MODO_SIMULACAO;
}

// ===== DADOS SIMULADOS =====

/**
 * Banco de dados simulado para testes
 * Estrutura idêntica ao que o Flask vai retornar
 */
const DADOS_SIMULADOS = {
    // Matérias
    materias: [
        { id: 1, nome: 'Back-End', descricao: 'APIs, bancos de dados e lógica de servidor' },
        { id: 2, nome: 'Front-End', descricao: 'HTML, CSS e interatividade' },
        { id: 3, nome: 'Mobile', descricao: 'Desenvolvimento para dispositivos móveis' },
        { id: 4, nome: 'Inteligência Artificial', descricao: 'Machine Learning e algoritmos' },
        { id: 5, nome: 'Lógica de Programação', descricao: 'Algoritmos e estruturas de dados' },
        { id: 6, nome: 'Redes', descricao: 'TCP/IP, roteamento e segurança' },
        { id: 7, nome: 'Processos', descricao: 'Metodologias e ciclos de desenvolvimento' }
    ],

    // Flashcards por matéria - CORRIGIDO com perguntas e respostas reais
    flashcards: {
        1: [ // Back-End
            { id: 1, pergunta: 'O que é uma API?', resposta: 'Interface de Programação de Aplicações' },
            { id: 2, pergunta: 'O que é REST?', resposta: 'Arquitetura para APIs web' },
            { id: 3, pergunta: 'O que é JSON?', resposta: 'Formato de dados leve para troca de informações' },
            { id: 4, pergunta: 'O que é um endpoint?', resposta: 'URL onde uma API pode ser acessada' },
            { id: 5, pergunta: 'O que é HTTP?', resposta: 'Protocolo de transferência de hipertexto' }
        ],
        2: [ // Front-End
            { id: 6, pergunta: 'O que é DOM?', resposta: 'Document Object Model' },
            { id: 7, pergunta: 'O que é CSS?', resposta: 'Cascading Style Sheets' },
            { id: 8, pergunta: 'O que é JavaScript?', resposta: 'Linguagem de programação para web' },
            { id: 9, pergunta: 'O que é React?', resposta: 'Biblioteca JavaScript para interfaces' },
            { id: 10, pergunta: 'O que é HTML?', resposta: 'HyperText Markup Language' }
        ],
        3: [ // Mobile
            { id: 11, pergunta: 'O que é Android?', resposta: 'Sistema operacional para dispositivos móveis' },
            { id: 12, pergunta: 'O que é iOS?', resposta: 'Sistema operacional da Apple' },
            { id: 13, pergunta: 'O que é React Native?', resposta: 'Framework para apps mobile com React' },
            { id: 14, pergunta: 'O que é Flutter?', resposta: 'Framework da Google para apps mobile' }
        ],
        4: [ // IA
            { id: 15, pergunta: 'O que é Machine Learning?', resposta: 'Subcampo da IA que permite aprendizado' },
            { id: 16, pergunta: 'O que é Deep Learning?', resposta: 'Redes neurais com múltiplas camadas' },
            { id: 17, pergunta: 'O que é uma Rede Neural?', resposta: 'Sistema inspirado no cérebro humano' },
            { id: 18, pergunta: 'O que é NLP?', resposta: 'Processamento de Linguagem Natural' }
        ],
        5: [ // Lógica
            { id: 19, pergunta: 'O que é um algoritmo?', resposta: 'Sequência de passos para resolver um problema' },
            { id: 20, pergunta: 'O que é uma variável?', resposta: 'Espaço na memória para armazenar dados' },
            { id: 21, pergunta: 'O que é um loop?', resposta: 'Estrutura que repete um bloco de código' },
            { id: 22, pergunta: 'O que é uma função?', resposta: 'Bloco de código reutilizável' }
        ],
        6: [ // Redes
            { id: 23, pergunta: 'O que é TCP/IP?', resposta: 'Conjunto de protocolos de comunicação' },
            { id: 24, pergunta: 'O que é um roteador?', resposta: 'Dispositivo que encaminha pacotes de rede' },
            { id: 25, pergunta: 'O que é um switch?', resposta: 'Dispositivo que conecta dispositivos em uma rede' },
            { id: 26, pergunta: 'O que é DNS?', resposta: 'Sistema de Nomes de Domínio' }
        ],
        7: [ // Processos
            { id: 27, pergunta: 'O que é Scrum?', resposta: 'Metodologia ágil de desenvolvimento' },
            { id: 28, pergunta: 'O que é Kanban?', resposta: 'Método visual de gerenciamento de tarefas' },
            { id: 29, pergunta: 'O que é um Sprint?', resposta: 'Período de tempo para entregar um incremento' },
            { id: 30, pergunta: 'O que é um Product Owner?', resposta: 'Responsável pelo backlog do produto' }
        ]
    },

    // Progresso por matéria
    progresso: {
        1: { total: 5, dominados: 2, percentual: 40 },
        2: { total: 5, dominados: 1, percentual: 20 },
        3: { total: 4, dominados: 0, percentual: 0 },
        4: { total: 4, dominados: 1, percentual: 25 },
        5: { total: 4, dominados: 0, percentual: 0 },
        6: { total: 4, dominados: 0, percentual: 0 },
        7: { total: 4, dominados: 0, percentual: 0 }
    },

    // Respostas simuladas
    respostas: {
        sucesso: { success: true, message: 'Resposta registrada com sucesso' },
        erro: { success: false, message: 'Erro ao registrar resposta' }
    }
};

// ===== FUNÇÃO CENTRAL DE REQUISIÇÃO =====

/**
 * Função central para todas as requisições HTTP
 * 
 * @param {string} endpoint - Caminho da API (ex: '/materias')
 * @param {object} options - Configurações da requisição
 * @param {string} options.method - GET, POST, PUT, DELETE
 * @param {object} options.body - Dados para enviar (serão convertidos para JSON)
 * @param {object} options.headers - Headers adicionais
 * @param {boolean} options.simular - Forçar simulação (opcional)
 * @returns {Promise} - Dados da resposta em JSON
 * 
 * @example
 * // GET
 * const materias = await apiRequest('/materias');
 * 
 * // POST
 * const resultado = await apiRequest('/flashcards/1/responder', {
 *     method: 'POST',
 *     body: { acertou: true }
 * });
 */
export async function apiRequest(endpoint, options = {}) {
    // Verifica se deve usar simulação
    const usarSimulacao = options.simular !== undefined ? options.simular : MODO_SIMULACAO;
    
    if (usarSimulacao) {
        return simularRequisicao(endpoint, options);
    }

    // ===== REQUISIÇÃO REAL =====

    // Configuração padrão
    const config = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    // Adiciona token de autenticação se existir
    if (AUTH_TOKEN) {
        config.headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
    }

    // Se tiver body, adiciona à requisição
    if (options.body) {
        config.body = JSON.stringify(options.body);
    }

    const url = `${API_BASE_URL}${endpoint}`;

    try {
        console.log(`📡 [API REAL] ${config.method} ${url}`);

        const response = await fetch(url, config);

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            let errorMsg = `Erro ${response.status}: ${response.statusText}`;
            
            try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorData.erro || errorMsg;
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
        console.log(`✅ [API REAL] Resposta recebida:`, data);
        return data;

    } catch (error) {
        console.error(`❌ [API REAL] Erro em ${endpoint}:`, error);
        
        // Se falhar, tenta usar simulação como fallback
        if (!options.simular && MODO_SIMULACAO) {
            console.warn(`🔄 [API REAL] Falha, usando simulação como fallback`);
            return simularRequisicao(endpoint, options);
        }
        
        throw error;
    }
}

// ===== FUNÇÕES CONVENIENTES =====

/**
 * GET - Buscar dados
 * @param {string} endpoint - Caminho da API
 * @param {object} options - Opções adicionais
 * @returns {Promise} - Dados da resposta
 */
export async function get(endpoint, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'GET' });
}

/**
 * POST - Enviar dados
 * @param {string} endpoint - Caminho da API
 * @param {object} data - Dados para enviar
 * @param {object} options - Opções adicionais
 * @returns {Promise} - Dados da resposta
 */
export async function post(endpoint, data, options = {}) {
    return apiRequest(endpoint, {
        ...options,
        method: 'POST',
        body: data
    });
}

/**
 * PUT - Atualizar dados
 * @param {string} endpoint - Caminho da API
 * @param {object} data - Dados para atualizar
 * @param {object} options - Opções adicionais
 * @returns {Promise} - Dados da resposta
 */
export async function put(endpoint, data, options = {}) {
    return apiRequest(endpoint, {
        ...options,
        method: 'PUT',
        body: data
    });
}

/**
 * DELETE - Remover dados
 * @param {string} endpoint - Caminho da API
 * @param {object} options - Opções adicionais
 * @returns {Promise} - null em caso de sucesso
 */
export async function del(endpoint, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'DELETE' });
}

// ===== SIMULAÇÃO =====

// frontend/js/api.js

/**
 * Simula uma requisição à API (para testes sem Flask)
 * @param {string} endpoint - Caminho simulado
 * @param {object} options - Opções da requisição
 * @returns {Promise} - Dados simulados
 */
async function simularRequisicao(endpoint, options = {}) {
    console.log(`🔵 [SIMULAÇÃO] ${options.method || 'GET'} ${endpoint}`);

    // Simula um atraso de rede (200-800ms)
    const delay = 200 + Math.random() * 600;
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
        let dados = null;
        const method = options.method || 'GET';

        // ===== ROTAS DE MATÉRIAS =====
        if (endpoint === '/materias' && method === 'GET') {
            dados = DADOS_SIMULADOS.materias;
        }

        // ===== ROTAS DE FLASHCARDS =====
        // ⭐ CORREÇÃO: Extrai o ID corretamente
        else if (endpoint.includes('/flashcards') && endpoint.includes('/materias/')) {
            // Exemplo: /materias/1/flashcards
            const partes = endpoint.split('/');
            const materiaId = parseInt(partes[2]); // Pega o ID da matéria
            
            console.log(`🔍 [SIMULAÇÃO] Buscando flashcards da matéria ${materiaId}`);
            
            // ⭐ CORREÇÃO: Busca os flashcards do objeto DADOS_SIMULADOS
            dados = DADOS_SIMULADOS.flashcards[materiaId] || [];
            
            console.log(`✅ [SIMULAÇÃO] Encontrados ${dados.length} flashcards`);
        }

        // ===== ROTA DE PROGRESSO =====
        else if (endpoint === '/progresso' && method === 'GET') {
            const progressoData = DADOS_SIMULADOS.progresso;
            const materiasData = DADOS_SIMULADOS.materias;
            
            dados = {
                total_materias: Object.keys(progressoData).length,
                materias_concluidas: Object.values(progressoData)
                    .filter(p => p.percentual >= 100).length,
                total_flashcards: Object.values(DADOS_SIMULADOS.flashcards)
                    .reduce((acc, f) => acc + f.length, 0),
                flashcards_dominados: Object.values(progressoData)
                    .reduce((acc, p) => acc + p.dominados, 0),
                progresso_geral: Math.round(
                    Object.values(progressoData).reduce((acc, p) => acc + p.percentual, 0) / 
                    Object.keys(progressoData).length
                ),
                por_materia: Object.entries(progressoData).map(([id, p]) => {
                    const materia = materiasData.find(m => m.id === parseInt(id));
                    return {
                        id: parseInt(id),
                        nome: materia ? materia.nome : `Matéria ${id}`,
                        total: p.total,
                        dominados: p.dominados,
                        percentual: p.percentual
                    };
                })
            };
        }

        // ===== ROTA DE RESPOSTA =====
        else if (endpoint.includes('/flashcards/') && endpoint.includes('/responder') && method === 'POST') {
            // Extrai o ID do flashcard
            const partes = endpoint.split('/');
            const flashcardId = parseInt(partes[2]);
            const acertou = options.body?.acertou ?? true;
            
            // Encontra em qual matéria está esse flashcard
            let materiaId = null;
            let flashcard = null;
            
            for (const [mId, flashcards] of Object.entries(DADOS_SIMULADOS.flashcards)) {
                const found = flashcards.find(f => f.id === flashcardId);
                if (found) {
                    materiaId = parseInt(mId);
                    flashcard = found;
                    break;
                }
            }
            
            // Atualiza o progresso da matéria
            if (materiaId && DADOS_SIMULADOS.progresso[materiaId]) {
                const progresso = DADOS_SIMULADOS.progresso[materiaId];
                if (acertou && progresso.dominados < progresso.total) {
                    progresso.dominados++;
                    progresso.percentual = Math.round((progresso.dominados / progresso.total) * 100);
                }
            }
            
            dados = {
                success: true,
                flashcard_id: flashcardId,
                acertou: acertou,
                sequencia: acertou ? 1 : 0,
                dominado: acertou ? false : false,
                progresso_materia: materiaId ? DADOS_SIMULADOS.progresso[materiaId]?.percentual || 0 : 0,
                mensagem: acertou ? '✅ Resposta correta!' : '❌ Resposta incorreta. Tente novamente.'
            };
        }

        // ===== ROTA NÃO ENCONTRADA =====
        else {
            console.warn(`⚠️ [SIMULAÇÃO] Rota não mapeada: ${endpoint} (${method})`);
            dados = { error: 'Rota não encontrada', endpoint, method };
        }

        // ⭐ Se dados for null ou undefined, retorna array vazio
        if (dados === null || dados === undefined) {
            console.warn(`⚠️ [SIMULAÇÃO] Nenhum dado encontrado para: ${endpoint}`);
            dados = Array.isArray(dados) ? [] : {};
        }

        console.log(`✅ [SIMULAÇÃO] Dados retornados:`, dados);
        return dados;

    } catch (error) {
        console.error(`❌ [SIMULAÇÃO] Erro:`, error);
        throw error;
    }
}

// ===== FUNÇÕES DE UTILIDADE =====

/**
 * Verifica se a API está disponível
 * @returns {Promise<boolean>} - true se disponível
 */
export async function verificarAPI() {
    try {
        if (MODO_SIMULACAO) {
            return true;
        }
        
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch (error) {
        return false;
    }
}

/**
 * Obtém a URL base da API
 * @returns {string} - URL base
 */
export function getBaseUrl() {
    return API_BASE_URL;
}

// ===== EXPORTA TUDO =====
export default {
    get,
    post,
    put,
    del,
    apiRequest,
    setBaseUrl,
    setToken,
    setModoSimulacao,
    isModoSimulacao,
    verificarAPI,
    getBaseUrl
};