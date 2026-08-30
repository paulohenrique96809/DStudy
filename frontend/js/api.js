// frontend/js/api.js

let API_BASE_URL = '';
let AUTH_TOKEN = null;
let MODO_SIMULACAO = true;

// ===== PROGRESSO PERSISTENTE (MANTÉM DURANTE A SESSÃO) =====
let progressoPersistente = null;

// ===== DADOS SIMULADOS =====

const DADOS_SIMULADOS = {
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
        1: [
            { id: 1, pergunta: 'O que é uma API?', resposta: 'Interface de Programação de Aplicações' },
            { id: 2, pergunta: 'O que é REST?', resposta: 'Arquitetura para APIs web' },
            { id: 3, pergunta: 'O que é JSON?', resposta: 'Formato de dados leve' },
            { id: 4, pergunta: 'O que é um endpoint?', resposta: 'URL onde a API é acessada' },
            { id: 5, pergunta: 'O que é HTTP?', resposta: 'Protocolo de transferência' }
        ],
        2: [
            { id: 6, pergunta: 'O que é DOM?', resposta: 'Document Object Model' },
            { id: 7, pergunta: 'O que é CSS?', resposta: 'Cascading Style Sheets' },
            { id: 8, pergunta: 'O que é JavaScript?', resposta: 'Linguagem de programação' }
        ],
        3: [
            { id: 9, pergunta: 'O que é Android?', resposta: 'Sistema operacional mobile' },
            { id: 10, pergunta: 'O que é iOS?', resposta: 'Sistema operacional da Apple' }
        ],
        4: [
            { id: 11, pergunta: 'O que é Machine Learning?', resposta: 'Subcampo da IA' },
            { id: 12, pergunta: 'O que é Deep Learning?', resposta: 'Redes neurais profundas' }
        ],
        5: [
            { id: 13, pergunta: 'O que é um algoritmo?', resposta: 'Sequência de passos' },
            { id: 14, pergunta: 'O que é uma variável?', resposta: 'Espaço na memória' }
        ],
        6: [
            { id: 15, pergunta: 'O que é TCP/IP?', resposta: 'Protocolos de comunicação' },
            { id: 16, pergunta: 'O que é um roteador?', resposta: 'Dispositivo de rede' }
        ],
        7: [
            { id: 17, pergunta: 'O que é Scrum?', resposta: 'Metodologia ágil' },
            { id: 18, pergunta: 'O que é Kanban?', resposta: 'Método visual' }
        ]
    }
};

// ===== INICIALIZA O PROGRESSO PERSISTENTE =====
function inicializarProgresso() {
    if (progressoPersistente) {
        console.log('📊 [API] Progresso já existe, mantendo...');
        return progressoPersistente;
    }
    
    progressoPersistente = {
        total_materias: DADOS_SIMULADOS.materias.length,
        materias_concluidas: 0,
        total_flashcards: Object.values(DADOS_SIMULADOS.flashcards).reduce((acc, f) => acc + f.length, 0),
        flashcards_dominados: 0,
        progresso_geral: 0,
        por_materia: DADOS_SIMULADOS.materias.map(m => {
            const flashcards = DADOS_SIMULADOS.flashcards[m.id] || [];
            return {
                id: m.id,
                nome: m.nome,
                total: flashcards.length,
                dominados: 0,
                percentual: 0
            };
        })
    };
    
    console.log('📊 [API] Progresso inicializado:', progressoPersistente);
    return progressoPersistente;
}

// ===== FUNÇÕES DE EXPORTAÇÃO =====

export function setBaseUrl(url) {
    API_BASE_URL = url;
}

export function setToken(token) {
    AUTH_TOKEN = token;
}

export function setModoSimulacao(ativo) {
    MODO_SIMULACAO = ativo;
    console.log(`🔄 Modo simulação: ${ativo ? 'ATIVADO' : 'DESATIVADO'}`);
}

export function isModoSimulacao() {
    return MODO_SIMULACAO;
}

// ===== FUNÇÃO CENTRAL =====

export async function apiRequest(endpoint, options = {}) {
    const method = options.method || 'GET';
    
    if (MODO_SIMULACAO) {
        return simularRequisicao(endpoint, options);
    }

    // Requisição real
    try {
        const config = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error(`❌ Erro na requisição:`, error);
        throw error;
    }
}

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

// ===== SIMULAÇÃO =====

async function simularRequisicao(endpoint, options = {}) {
    const method = options.method || 'GET';
    console.log(`🔵 [SIMULAÇÃO] ${method} ${endpoint}`);
    
    // Inicializa o progresso se não existir
    inicializarProgresso();

    // Simula delay
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
        let dados = null;

        // ===== MATÉRIAS =====
        if (endpoint === '/materias' && method === 'GET') {
            dados = DADOS_SIMULADOS.materias;
        }

        // ===== FLASHCARDS =====
        else if (endpoint.includes('/flashcards') && endpoint.includes('/materias/')) {
            const partes = endpoint.split('/');
            const materiaId = parseInt(partes[2]);
            dados = DADOS_SIMULADOS.flashcards[materiaId] || [];
        }

        // ===== PROGRESSO =====
        else if (endpoint === '/progresso' && method === 'GET') {
            // ⭐ RETORNA O PROGRESSO PERSISTENTE
            dados = progressoPersistente;
            console.log(`📊 [SIMULAÇÃO] Progresso retornado: ${dados.progresso_geral}%`);
        }

        // ===== RESPOSTA =====
        else if (endpoint.includes('/flashcards/') && endpoint.includes('/responder') && method === 'POST') {
            const partes = endpoint.split('/');
            const flashcardId = parseInt(partes[2]);
            const acertou = options.body?.acertou ?? true;
            
            console.log(`📝 [SIMULAÇÃO] Flashcard ${flashcardId}: ${acertou ? 'Acertou' : 'Errou'}`);
            
            // Encontra a matéria
            let materiaId = null;
            for (const [mId, flashcards] of Object.entries(DADOS_SIMULADOS.flashcards)) {
                if (flashcards.some(f => f.id === flashcardId)) {
                    materiaId = parseInt(mId);
                    break;
                }
            }
            
            // ⭐ ATUALIZA O PROGRESSO PERSISTENTE
            if (materiaId && progressoPersistente) {
                const materiaProgresso = progressoPersistente.por_materia.find(m => m.id === materiaId);
                if (materiaProgresso) {
                    if (acertou && materiaProgresso.dominados < materiaProgresso.total) {
                        materiaProgresso.dominados++;
                        materiaProgresso.percentual = Math.round((materiaProgresso.dominados / materiaProgresso.total) * 100);
                        console.log(`📊 [SIMULAÇÃO] Matéria ${materiaId}: ${materiaProgresso.dominados}/${materiaProgresso.total} (${materiaProgresso.percentual}%)`);
                    }
                }
                
                // Recalcula o progresso geral
                const total = progressoPersistente.por_materia.reduce((acc, m) => acc + m.total, 0);
                const dominados = progressoPersistente.por_materia.reduce((acc, m) => acc + m.dominados, 0);
                progressoPersistente.flashcards_dominados = dominados;
                progressoPersistente.progresso_geral = Math.round((dominados / total) * 100);
                progressoPersistente.materias_concluidas = progressoPersistente.por_materia.filter(m => m.percentual >= 100).length;
                
                console.log(`📊 [SIMULAÇÃO] Progresso geral: ${dominados}/${total} (${progressoPersistente.progresso_geral}%)`);
            }
            
            dados = {
                success: true,
                flashcard_id: flashcardId,
                acertou: acertou,
                sequencia: acertou ? 1 : 0,
                dominado: false,
                mensagem: acertou ? '✅ Resposta correta!' : '❌ Resposta incorreta.'
            };
        }

        // ===== ROTA NÃO ENCONTRADA =====
        else {
            console.warn(`⚠️ [SIMULAÇÃO] Rota não mapeada: ${endpoint}`);
            dados = { error: 'Rota não encontrada' };
        }

        return dados;

    } catch (error) {
        console.error(`❌ [SIMULAÇÃO] Erro:`, error);
        throw error;
    }
}

// ===== EXPORTA =====

export default {
    get,
    post,
    put,
    del,
    apiRequest,
    setBaseUrl,
    setToken,
    setModoSimulacao,
    isModoSimulacao
};