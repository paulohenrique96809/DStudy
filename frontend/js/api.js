// frontend/js/api.js

// ===== CONFIGURAÇÃO =====
const API_BASE_URL = 'http://127.0.0.1:5000';

// ⭐ COMEÇA EM MODO SIMULAÇÃO ATÉ A API ESTAR DISPONÍVEL
let MODO_SIMULACAO = true;

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
            // ⭐ TIMEOUT DE 2 SEGUNDOS
            signal: AbortSignal.timeout(2000)
        });
        
        if (!response.ok) {
            console.log('❌ [API] API respondeu com erro');
            return false;
        }
        
        const data = await response.json();
        const online = data.mensagem === 'API no ar!';
        console.log(`🔍 [API] API está ${online ? 'ONLINE' : 'OFFLINE'}`);
        return online;
    } catch (error) {
        console.log('❌ [API] API offline (não foi possível conectar)');
        return false;
    }
}

// ===== REQUISIÇÃO =====
export async function apiRequest(endpoint, options = {}) {
    const method = options.method || 'GET';

    // ⭐ SE ESTIVER EM MODO SIMULAÇÃO, USA DADOS SIMULADOS
    if (MODO_SIMULACAO) {
        return simularRequisicao(endpoint, options);
    }

    const url = `${API_BASE_URL}${endpoint}`;

    try {
        console.log(`📡 [API] ${method} ${url}`);

        const config = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            // ⭐ TIMEOUT DE 3 SEGUNDOS
            signal: AbortSignal.timeout(3000)
        };

        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.mensagem || data.erro || `Erro ${response.status}`);
        }

        console.log(`✅ [API] Resposta:`, data);
        return data;

    } catch (error) {
        console.error(`❌ [API] Erro em ${endpoint}:`, error.message);
        
        // ⭐ FALLBACK: Se a API falhar, ativa simulação e tenta novamente
        console.warn('⚠️ [API] Ativando modo simulação (fallback)');
        MODO_SIMULACAO = true;
        return simularRequisicao(endpoint, options);
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

// ===== DADOS SIMULADOS =====
const DADOS_SIMULADOS = {
    materias: [
        { id: 1, nome: 'Modelagem e Desenvolvimento de Banco de Dados', descricao: 'Ensina a projetar, criar e gerenciar bancos de dados de forma eficiente e segura.' },
        { id: 2, nome: 'Inteligência Artificial', descricao: 'Introduz conceitos de IA, aprendizado de máquina e aplicações em sistemas inteligentes.' },
        { id: 3, nome: 'Programação Back-End', descricao: 'Desenvolvimento de servidores, APIs e lógica de negócio.' },
        { id: 4, nome: 'Programação Front-End', descricao: 'Desenvolvimento de interfaces web e experiência do usuário.' },
        { id: 5, nome: 'Programação Mobile', descricao: 'Desenvolvimento de aplicativos para dispositivos móveis.' },
        { id: 6, nome: 'Projeto Multidisciplinar em Desenvolvimento de Sistemas', descricao: 'Integração de conhecimentos em projetos práticos.' },
        { id: 7, nome: 'Versionamento de Código e Sistemas de Mensageria', descricao: 'Git, GitHub e sistemas de comunicação assíncrona.' },
        { id: 8, nome: 'Lógica de Programação', descricao: 'Algoritmos, estruturas de dados e raciocínio lógico.' },
        { id: 9, nome: 'Processos de Desenvolvimento de Software', descricao: 'Metodologias ágeis, Scrum, Kanban e ciclo de vida do software.' },
        { id: 10, nome: 'Redes e Segurança', descricao: 'Protocolos de rede, segurança da informação e boas práticas.' }
    ],

    flashcards: {
        1: [
            { id: 1, pergunta: 'O que significa SQL?', alternativas: ['Structured Query Language', 'Simple Question Language', 'System Query Logic', 'Standard Quality Language'], resposta: 'Structured Query Language' },
            { id: 2, pergunta: 'Qual comando é usado para consultar dados?', alternativas: ['SELECT', 'INSERT', 'DELETE', 'UPDATE'], resposta: 'SELECT' }
        ],
        2: [
            { id: 3, pergunta: 'O que é Machine Learning?', alternativas: ['Subcampo da IA', 'Banco de dados', 'Rede neural', 'Protocolo'], resposta: 'Subcampo da IA' },
            { id: 4, pergunta: 'O que é Deep Learning?', alternativas: ['Redes neurais profundas', 'Front-end', 'Back-end', 'API'], resposta: 'Redes neurais profundas' }
        ],
        3: [
            { id: 5, pergunta: 'O que é uma API?', alternativas: ['Interface de Programação', 'Banco de dados', 'Rede', 'Framework'], resposta: 'Interface de Programação' }
        ],
        4: [
            { id: 6, pergunta: 'O que é o DOM?', alternativas: ['Document Object Model', 'Data Object Manager', 'Digital Output Module', 'Dynamic Object Model'], resposta: 'Document Object Model' }
        ],
        5: [
            { id: 7, pergunta: 'O que é Android?', alternativas: ['Sistema operacional mobile', 'Banco de dados', 'Framework web', 'Protocolo'], resposta: 'Sistema operacional mobile' }
        ],
        6: [
            { id: 8, pergunta: 'O que é um projeto multidisciplinar?', alternativas: ['Integra várias áreas', 'Um só tema', 'Só código', 'Só design'], resposta: 'Integra várias áreas' }
        ],
        7: [
            { id: 9, pergunta: 'O que é Git?', alternativas: ['Controle de versão', 'Banco de dados', 'Framework', 'IDE'], resposta: 'Controle de versão' }
        ],
        8: [
            { id: 10, pergunta: 'O que é um algoritmo?', alternativas: ['Sequência de passos', 'Banco de dados', 'Rede', 'API'], resposta: 'Sequência de passos' }
        ],
        9: [
            { id: 11, pergunta: 'O que é Scrum?', alternativas: ['Metodologia ágil', 'Framework JS', 'Banco', 'Rede'], resposta: 'Metodologia ágil' }
        ],
        10: [
            { id: 12, pergunta: 'O que é TCP/IP?', alternativas: ['Protocolos de comunicação', 'Banco', 'Framework', 'IDE'], resposta: 'Protocolos de comunicação' }
        ]
    },

    progresso: {
        total_materias: 10,
        materias_concluidas: 0,
        total_flashcards: 15,
        flashcards_dominados: 0,
        progresso_geral: 0,
        por_materia: [
            { id: 1, nome: 'Modelagem e Desenvolvimento de Banco de Dados', total: 2, dominados: 0, percentual: 0 },
            { id: 2, nome: 'Inteligência Artificial', total: 2, dominados: 0, percentual: 0 },
            { id: 3, nome: 'Programação Back-End', total: 1, dominados: 0, percentual: 0 },
            { id: 4, nome: 'Programação Front-End', total: 1, dominados: 0, percentual: 0 },
            { id: 5, nome: 'Programação Mobile', total: 1, dominados: 0, percentual: 0 },
            { id: 6, nome: 'Projeto Multidisciplinar em Desenvolvimento de Sistemas', total: 1, dominados: 0, percentual: 0 },
            { id: 7, nome: 'Versionamento de Código e Sistemas de Mensageria', total: 1, dominados: 0, percentual: 0 },
            { id: 8, nome: 'Lógica de Programação', total: 1, dominados: 0, percentual: 0 },
            { id: 9, nome: 'Processos de Desenvolvimento de Software', total: 1, dominados: 0, percentual: 0 },
            { id: 10, nome: 'Redes e Segurança', total: 1, dominados: 0, percentual: 0 }
        ]
    }
};

// ⭐ PROGRESSO SIMULADO (MANTÉM ESTADO DURANTE A SESSÃO)
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
    
    // Simula delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // ===== MATÉRIAS =====
    if (endpoint === '/materias') {
        console.log(`✅ [SIMULAÇÃO] ${DADOS_SIMULADOS.materias.length} matérias`);
        return DADOS_SIMULADOS.materias;
    }

    // ===== FLASHCARDS =====
    if (endpoint.includes('/materias/') && endpoint.includes('/flashcards')) {
        const id = parseInt(endpoint.split('/')[2]);
        const flashcards = DADOS_SIMULADOS.flashcards[id] || [];
        console.log(`✅ [SIMULAÇÃO] ${flashcards.length} flashcards da matéria ${id}`);
        return flashcards;
    }

    // ===== PROGRESSO =====
    if (endpoint === '/progresso') {
        const progresso = inicializarProgresso();
        console.log(`✅ [SIMULAÇÃO] Progresso: ${progresso.progresso_geral}%`);
        return progresso;
    }

    // ===== RESPOSTA =====
    if (endpoint.includes('/flashcards/') && endpoint.includes('/responder')) {
        const partes = endpoint.split('/');
        const flashcardId = parseInt(partes[2]);
        const acertou = options.body?.acertou ?? true;
        
        const progresso = inicializarProgresso();
        
        // Encontra a matéria do flashcard
        let materiaId = null;
        for (const [mId, flashcards] of Object.entries(DADOS_SIMULADOS.flashcards)) {
            if (flashcards.some(f => f.id === flashcardId)) {
                materiaId = parseInt(mId);
                break;
            }
        }
        
        // Atualiza progresso
        if (materiaId && acertou) {
            const materiaProgresso = progresso.por_materia.find(m => m.id === materiaId);
            if (materiaProgresso && materiaProgresso.dominados < materiaProgresso.total) {
                materiaProgresso.dominados++;
                materiaProgresso.percentual = Math.round((materiaProgresso.dominados / materiaProgresso.total) * 100);
            }
            
            const total = progresso.por_materia.reduce((acc, m) => acc + m.total, 0);
            const dominados = progresso.por_materia.reduce((acc, m) => acc + m.dominados, 0);
            progresso.flashcards_dominados = dominados;
            progresso.progresso_geral = Math.round((dominados / total) * 100);
        }
        
        console.log(`✅ [SIMULAÇÃO] Resposta registrada`);
        return {
            success: true,
            acertou: acertou,
            mensagem: acertou ? '✅ Correto!' : '❌ Incorreto.'
        };
    }

    // ===== CADASTRO =====
    if (endpoint === '/cadastro') {
        return { mensagem: 'Usuário cadastrado com sucesso!' };
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