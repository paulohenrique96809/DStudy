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
    // '/progresso'  ← ⭐ REMOVA (ou comente)
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
// frontend/js/api.js

function rotaDisponivel(endpoint) {
    // Remove a query string para análise
    const endpointLimpo = endpoint.split('?')[0];
    
    for (const rota of ROTAS_INDISPONIVEIS) {
        if (endpointLimpo.startsWith(rota)) {
            return false;
        }
    }

    if (ROTAS_DISPONIVEIS.includes(endpointLimpo)) return true;
    
    // ⭐ Rotas de flashcards
    if (endpointLimpo.match(/^\/materias\/\d+\/flashcards$/)) return true;
    
    // ⭐ NOVA ROTA: progresso por matéria
    if (endpointLimpo.match(/^\/materias\/\d+\/progresso$/)) return true;
    
    return false;
}

// ===== REQUISIÇÃO =====
export async function apiRequest(endpoint, options = {}) {
    const method = options.method || 'GET';

    // 1. Se estiver em modo simulação, nem tenta chamar a API
    if (MODO_SIMULACAO) {
        return simularRequisicao(endpoint, options);
    }

    const url = `${API_BASE_URL}${endpoint}`;

    try {
        console.log(`📡 [API] ${method} ${url}`);
        
        // 2. Prepara os headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // ⭐ 3. AQUI ESTÁ A MÁGICA: Pega o token e adiciona no header
        const token = localStorage.getItem('dstudy_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method: method,
            headers: headers, // Usa os headers montados acima
            signal: AbortSignal.timeout(TIMEOUT_MS)
        };

        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        const response = await fetch(url, config);
        
        // 4. Se o token expirou ou é inválido (401), desloga o usuário
        if (response.status === 401) {
            localStorage.removeItem('dstudy_token');
            localStorage.removeItem('dstudy_usuario');
            window.location.reload(); // Recarrega para voltar à tela de login
            throw new Error('Sessão expirada. Faça login novamente.');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || data.mensagem || `Erro ${response.status}`);
        }

        return data;

    } catch (error) {
        console.error(`❌ [API] Erro em ${endpoint}:`, error.message);
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