// frontend/js/api.js

let MODO_SIMULACAO = true;

// ===== PROGRESSO PERSISTENTE =====
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
        { id: 7, nome: 'Processos', descricao: 'Metodologias e ciclos de desenvolvimento' },
        // ⭐ NOVAS MATÉRIAS
        { id: 8, nome: 'Versionamento de Código', descricao: 'Git, GitHub e controle de versão' },
        { id: 9, nome: 'Carreiras e Competências', descricao: 'Soft skills, mercado de trabalho e desenvolvimento profissional' },
        { id: 10, nome: 'Projeto Multidisciplinar', descricao: 'Integração de conhecimentos em projetos práticos' }
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
        ],
        // ⭐ FLASHCARDS DAS NOVAS MATÉRIAS
        8: [
            { id: 19, pergunta: 'O que é Git?', resposta: 'Sistema de controle de versão distribuído' },
            { id: 20, pergunta: 'O que é GitHub?', resposta: 'Plataforma de hospedagem de código' },
            { id: 21, pergunta: 'O que é um commit?', resposta: 'Registro de alterações no código' },
            { id: 22, pergunta: 'O que é um branch?', resposta: 'Ramo de desenvolvimento paralelo' },
            { id: 23, pergunta: 'O que é um merge?', resposta: 'Unificação de branches' }
        ],
        9: [
            { id: 24, pergunta: 'O que são soft skills?', resposta: 'Habilidades comportamentais e interpessoais' },
            { id: 25, pergunta: 'O que é inteligência emocional?', resposta: 'Capacidade de gerenciar emoções' },
            { id: 26, pergunta: 'O que é networking?', resposta: 'Construção de uma rede de contatos profissionais' },
            { id: 27, pergunta: 'O que é um plano de carreira?', resposta: 'Estratégia de desenvolvimento profissional' }
        ],
        10: [
            { id: 28, pergunta: 'O que é um projeto multidisciplinar?', resposta: 'Projeto que integra múltiplas áreas do conhecimento' },
            { id: 29, pergunta: 'O que é metodologia de projeto?', resposta: 'Abordagem estruturada para desenvolvimento de projetos' },
            { id: 30, pergunta: 'O que é documentação de projeto?', resposta: 'Registro formal das decisões e etapas do projeto' },
            { id: 31, pergunta: 'O que é um MVP?', resposta: 'Produto Mínimo Viável para validação' }
        ]
    }
};

// ===== INICIALIZA PROGRESSO =====
function inicializarProgresso() {
    if (progressoPersistente) return progressoPersistente;
    
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
    
    return progressoPersistente;
}

// ===== EXPORTS =====
export function setModoSimulacao(ativo) { MODO_SIMULACAO = ativo; }
export function isModoSimulacao() { return MODO_SIMULACAO; }

// ===== REQUISIÇÃO =====
export async function get(endpoint) {
    if (MODO_SIMULACAO) {
        return simularGet(endpoint);
    }
    
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Erro ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('❌ Erro na requisição:', error);
        throw error;
    }
}

export async function post(endpoint, data) {
    if (MODO_SIMULACAO) {
        return simularPost(endpoint, data);
    }
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`Erro ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('❌ Erro na requisição:', error);
        throw error;
    }
}

// ===== SIMULAÇÃO GET =====
async function simularGet(endpoint) {
    console.log(`🔵 [GET] ${endpoint}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    inicializarProgresso();

    if (endpoint === '/materias') {
        return DADOS_SIMULADOS.materias;
    }
    
    if (endpoint.includes('/materias/') && endpoint.includes('/flashcards')) {
        const partes = endpoint.split('/');
        const materiaId = parseInt(partes[2]);
        return DADOS_SIMULADOS.flashcards[materiaId] || [];
    }
    
    if (endpoint === '/progresso') {
        return progressoPersistente;
    }
    
    return { error: 'Rota não encontrada' };
}

// ===== SIMULAÇÃO POST =====
async function simularPost(endpoint, data) {
    console.log(`🔵 [POST] ${endpoint}`, data);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    inicializarProgresso();

    if (endpoint.includes('/flashcards/') && endpoint.includes('/responder')) {
        const partes = endpoint.split('/');
        const flashcardId = parseInt(partes[2]);
        const acertou = data?.acertou ?? true;
        
        // Encontra a matéria
        let materiaId = null;
        for (const [mId, flashcards] of Object.entries(DADOS_SIMULADOS.flashcards)) {
            if (flashcards.some(f => f.id === flashcardId)) {
                materiaId = parseInt(mId);
                break;
            }
        }
        
        // Atualiza progresso
        if (materiaId && progressoPersistente) {
            const materiaProgresso = progressoPersistente.por_materia.find(m => m.id === materiaId);
            if (materiaProgresso && acertou && materiaProgresso.dominados < materiaProgresso.total) {
                materiaProgresso.dominados++;
                materiaProgresso.percentual = Math.round((materiaProgresso.dominados / materiaProgresso.total) * 100);
            }
            
            const total = progressoPersistente.por_materia.reduce((acc, m) => acc + m.total, 0);
            const dominados = progressoPersistente.por_materia.reduce((acc, m) => acc + m.dominados, 0);
            progressoPersistente.flashcards_dominados = dominados;
            progressoPersistente.progresso_geral = Math.round((dominados / total) * 100);
            progressoPersistente.materias_concluidas = progressoPersistente.por_materia.filter(m => m.percentual >= 100).length;
        }
        
        return {
            success: true,
            flashcard_id: flashcardId,
            acertou: acertou,
            mensagem: acertou ? '✅ Resposta correta!' : '❌ Resposta incorreta.'
        };
    }
    
    return { error: 'Rota não encontrada' };
}