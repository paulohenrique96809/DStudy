// frontend/js/api.js

const API_BASE_URL = 'http://127.0.0.1:5000';
let MODO_SIMULACAO = false;  // ⭐ Começa em modo REAL

const TIMEOUT_MS = 10000;

// ⭐ ROTAS QUE EXISTEM NA API REAL
const ROTAS_DISPONIVEIS = [
    '/',
    '/materias',
    '/cadastro',
    '/responder',   // ⭐ ADICIONADO
    '/login'
];

// ⭐ ROTAS QUE AINDA NÃO EXISTEM
const ROTAS_INDISPONIVEIS = [
    '/progresso'
];

// ===== EXPORTS =====
export function setBaseUrl(url) {
    console.log(`🔧 [API] Base URL: ${url}`);
}

export function setModoSimulacao(ativo) {
    MODO_SIMULACAO = ativo;
    console.log(`🔧 [API] Modo simulação: ${ativo ? 'ATIVADO' : 'DESATIVADO'}`);
}

export function isModoSimulacao() {
    return MODO_SIMULACAO;
}

// ===== VERIFICAÇÃO DE API =====
export async function verificarAPI() {
    try {
        console.log('🔍 [API] Verificando se a API está online...');
        const response = await fetch(`${API_BASE_URL}/`, {
            method: 'GET',
            signal: AbortSignal.timeout(3000)
        });
        
        if (!response.ok) return false;
        
        const data = await response.json();
        const online = data.mensagem === 'API no ar!';
        console.log(`🔍 [API] API está ${online ? 'ONLINE' : 'OFFLINE'}`);
        return online;
    } catch (error) {
        console.log('❌ [API] API offline:', error.message);
        return false;
    }
}

/**
 * ⭐ VERIFICA SE A ROTA ESTÁ DISPONÍVEL NA API REAL
 */
function rotaDisponivel(endpoint) {
   // Remove query string para análise
    const endpointLimpo = endpoint.split('?')[0];
    
    // Se está na lista de indisponíveis, usa simulação
    for (const rota of ROTAS_INDISPONIVEIS) {
        if (endpointLimpo.startsWith(rota)) {
            return false;
        }
    }

    // Rotas exatas
    if (ROTAS_DISPONIVEIS.includes(endpointLimpo)) return true;
    
    // Rotas com padrão (/materias/{id}/flashcards)
    if (endpointLimpo.match(/^\/materias\/\d+\/flashcards$/)) return true;
    
    return false;
}

// ===== REQUISIÇÃO =====
export async function apiRequest(endpoint, options = {}) {
    const method = options.method || 'GET';

    // ⭐ VERIFICA SE A ROTA ESTÁ DISPONÍVEL NA API REAL
    if (!rotaDisponivel(endpoint)) {
        console.log(`⚠️ [API] Rota "${endpoint}" indisponível, usando simulação`);
        return simularRequisicao(endpoint, options);
    }

    // ⭐ SE ESTIVER EM MODO SIMULAÇÃO, USA DADOS SIMULADOS
    if (MODO_SIMULACAO) {
        console.log(`🔵 [API] Modo simulação ativo`);
        return simularRequisicao(endpoint, options);
    }

    const url = `${API_BASE_URL}${endpoint}`;

    try {
        console.log(`📡 [API] ${method} ${url}`, options.body || '');
        const inicio = Date.now();

        const config = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            signal: AbortSignal.timeout(TIMEOUT_MS)
        };

        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        const response = await fetch(url, config);
        
        const tempo = Date.now() - inicio;
        console.log(`⏱️ [API] Resposta em ${tempo}ms`);

        let data;
        try {
            data = await response.json();
        } catch (e) {
            data = { erro: 'Resposta não é JSON' };
        }

        // ⭐ SE DER ERRO, MOSTRA A MENSAGEM
        if (!response.ok) {
            console.warn(`⚠️ [API] Erro ${response.status}:`, data);
            throw new Error(data.erro || data.mensagem || `Erro ${response.status}`);
        }

        console.log(`✅ [API] Resposta:`, data);
        return data;

    } catch (error) {
        console.error(`❌ [API] Erro em ${endpoint}:`, error.message);
        
        // ⭐ SE FOR TIMEOUT, TENTA SIMULAÇÃO
        if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
            console.warn('⏱️ [API] Timeout, usando simulação');
            return simularRequisicao(endpoint, options);
        }
        
        throw error;
    }
}

// ===== MÉTODOS HTTP =====
export async function get(endpoint, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'GET' });
}

export async function post(endpoint, data, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'POST', body: data });
}

export async function put(endpoint, data, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'PUT', body: data });
}

export async function del(endpoint, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'DELETE' });
}

// ===== DADOS SIMULADOS (para /progresso) =====
const DADOS_SIMULADOS = {
    progresso: {
        total_materias: 10,
        materias_concluidas: 0,
        total_flashcards: 21,
        flashcards_dominados: 0,
        progresso_geral: 0,
        por_materia: [
            { id: 1, nome: 'Modelagem e Desenvolvimento de Banco de Dados', total: 3, dominados: 0, percentual: 0 },
            { id: 2, nome: 'Inteligência Artificial', total: 2, dominados: 0, percentual: 0 },
            { id: 3, nome: 'Programação Back-End', total: 2, dominados: 0, percentual: 0 },
            { id: 4, nome: 'Programação Front-End', total: 2, dominados: 0, percentual: 0 },
            { id: 5, nome: 'Programação Mobile', total: 2, dominados: 0, percentual: 0 },
            { id: 6, nome: 'Projeto Multidisciplinar em Desenvolvimento de Sistemas', total: 2, dominados: 0, percentual: 0 },
            { id: 7, nome: 'Versionamento de Código e Sistemas de Mensageria', total: 2, dominados: 0, percentual: 0 },
            { id: 8, nome: 'Lógica de Programação', total: 2, dominados: 0, percentual: 0 },
            { id: 9, nome: 'Processos de Desenvolvimento de Software', total: 2, dominados: 0, percentual: 0 },
            { id: 10, nome: 'Redes e Segurança', total: 2, dominados: 0, percentual: 0 }
        ]
    }
};

let progressoSimulado = null;

function inicializarProgresso() {
    if (progressoSimulado) return progressoSimulado;
    progressoSimulado = JSON.parse(JSON.stringify(DADOS_SIMULADOS.progresso));
    return progressoSimulado;
}

// ===== SIMULAÇÃO =====
async function simularRequisicao(endpoint, options = {}) {
    const method = options.method || 'GET';
    console.log(`🔵 [SIMULAÇÃO] ${method} ${endpoint}`);
    
    await new Promise(resolve => setTimeout(resolve, 300));

    if (endpoint === '/progresso') {
        return inicializarProgresso();
    }

    return { error: 'Rota não encontrada' };
}

export default {
    get, post, put, del,
    apiRequest,
    setBaseUrl,
    setModoSimulacao,
    isModoSimulacao,
    verificarAPI
};