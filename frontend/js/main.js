// frontend/js/main.js

// Importa as funções da API
import { get, post, simularResposta } from './api.js';

/**
 * Classe principal que gerencia a aplicação
 * 
 * O que ela faz:
 * - Inicializa a aplicação quando a página carrega
 * - Gerencia a navegação entre as telas
 * - Mantém o estado da aplicação (ex: usuário logado)
 */
class App {
    constructor() {
        // Estado da aplicação
        this.usuario = null;
        this.materias = [];
        this.flashcardAtual = null;
        
        // Inicializa quando a página carrega
        this.init();
    }

    /**
     * Método de inicialização
     * - Configura event listeners
     * - Carrega dados iniciais
     */
    async init() {
        console.log('🚀 Aplicação iniciada!');
        
        // Configura os eventos da página
        this.setupEventListeners();
        
        // Carrega as matérias (exemplo)
        await this.carregarMaterias();
        
        // Exibe um feedback visual de que está funcionando
        this.mostrarStatusInicial();
    }

    /**
     * Configura os listeners de eventos da página
     * Exemplo: cliques em botões, submit de formulários
     */
    setupEventListeners() {
        // Exemplo: quando o DOM estiver carregado, podemos adicionar listeners
        document.addEventListener('DOMContentLoaded', () => {
            console.log('📄 DOM carregado!');
            
            // Exemplo: botão de teste
            const btnTeste = document.getElementById('btn-teste');
            if (btnTeste) {
                btnTeste.addEventListener('click', () => {
                    this.testarAPI();
                });
            }
        });
    }

    /**
     * Carrega a lista de matérias da API
     * 
     * Quando o Flask estiver pronto, isso vai buscar dados reais
     * Por enquanto, usamos dados simulados para testes
     */
    async carregarMaterias() {
        try {
            // Tenta buscar da API real
            // const materias = await get('/materias');
            
            // Por enquanto, usamos dados simulados
            const materiasSimuladas = [
                { id: 1, nome: 'Back-End', descricao: 'APIs, bancos de dados e lógica de servidor' },
                { id: 2, nome: 'Front-End', descricao: 'HTML, CSS e interatividade' },
                { id: 3, nome: 'Mobile', descricao: 'Desenvolvimento para dispositivos móveis' },
                { id: 4, nome: 'Inteligência Artificial', descricao: 'Machine Learning e algoritmos' },
                { id: 5, nome: 'Lógica de Programação', descricao: 'Algoritmos e estruturas de dados' },
                { id: 6, nome: 'Redes', descricao: 'TCP/IP, roteamento e segurança' },
                { id: 7, nome: 'Processos', descricao: 'Metodologias e ciclos de desenvolvimento' }
            ];
            
            this.materias = simularResposta(materiasSimuladas);
            this.renderizarMaterias();
            
        } catch (error) {
            console.error('❌ Erro ao carregar matérias:', error);
            this.mostrarErro('Não foi possível carregar as matérias.');
        }
    }

    /**
     * Renderiza as matérias no HTML
     * Por enquanto, apenas mostra no console
     * Depois, isso vai gerar elementos HTML dinâmicos
     */
    renderizarMaterias() {
        console.log('📚 Matérias carregadas:', this.materias);
        
        // Exemplo de como poderia renderizar no HTML
        const container = document.getElementById('materias-container');
        if (container) {
            container.innerHTML = this.materias.map(materia => `
                <div class="materia-card" data-id="${materia.id}">
                    <h3>${materia.nome}</h3>
                    <p>${materia.descricao}</p>
                    <button onclick="app.iniciarEstudo(${materia.id})">Estudar</button>
                </div>
            `).join('');
        }
    }

    /**
     * Função de teste para verificar se a API está funcionando
     * Exemplo de como faríamos uma requisição POST
     */
    async testarAPI() {
        console.log('🧪 Testando API...');
        
        try {
            // Exemplo de requisição POST (simulado)
            const dadosTeste = {
                flashcardId: 1,
                acertou: true
            };
            
            // Quando o Flask estiver pronto, seria:
            // const resultado = await post('/flashcards/responder', dadosTeste);
            
            // Por enquanto, simulamos
            const resultadoSimulado = {
                success: true,
                flashcard: {
                    id: 1,
                    pergunta: 'O que é uma API?',
                    resposta: 'Interface de Programação de Aplicações'
                },
                status: 'acertou',
                sequencia: 1
            };
            
            const resultado = simularResposta(resultadoSimulado);
            console.log('✅ Teste concluído:', resultado);
            
            alert('✅ Teste concluído! Verifique o console para ver os detalhes.');
            
        } catch (error) {
            console.error('❌ Erro no teste:', error);
            alert('❌ Erro no teste. Verifique o console.');
        }
    }

    /**
     * Inicia o estudo de uma matéria
     * @param {number} materiaId - ID da matéria
     */
    async iniciarEstudo(materiaId) {
        console.log(`📖 Iniciando estudo da matéria ${materiaId}`);
        
        try {
            // Quando o Flask estiver pronto:
            // const flashcards = await get(`/materias/${materiaId}/flashcards`);
            
            // Por enquanto, simulamos
            const flashcardsSimulados = [
                { id: 1, pergunta: 'O que é REST?', resposta: 'Arquitetura para APIs' },
                { id: 2, pergunta: 'O que é JSON?', resposta: 'Formato de dados' }
            ];
            
            const flashcards = simularResposta(flashcardsSimulados);
            
            // Navega para a tela de estudo
            this.mostrarTelaEstudo(flashcards);
            
        } catch (error) {
            console.error('❌ Erro ao iniciar estudo:', error);
            this.mostrarErro('Não foi possível iniciar o estudo.');
        }
    }

    /**
     * Mostra a tela de estudo com os flashcards
     * @param {array} flashcards - Lista de flashcards
     */
    mostrarTelaEstudo(flashcards) {
        // Aqui futuramente iremos renderizar a tela de estudo
        console.log('🃏 Flashcards para estudar:', flashcards);
        
        // Por enquanto, apenas um alerta
        alert(`📚 Iniciando estudo com ${flashcards.length} flashcards!`);
    }

    /**
     * Mostra um feedback visual de que a aplicação está rodando
     */
    mostrarStatusInicial() {
        console.log('✅ Aplicação pronta para uso!');
        console.log('💡 Dica: Use app.testarAPI() para testar a comunicação');
        
        // Adiciona um indicador visual no HTML
        const statusDiv = document.getElementById('app-status');
        if (statusDiv) {
            statusDiv.innerHTML = '✅ JavaScript carregado com sucesso!';
            statusDiv.style.color = 'green';
        }
    }

    /**
     * Mostra mensagens de erro
     * @param {string} mensagem - Mensagem de erro
     */
    mostrarErro(mensagem) {
        console.error('❌', mensagem);
        
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.textContent = mensagem;
            errorDiv.style.display = 'block';
        }
    }
}

// Cria uma instância global da aplicação
// Isso permite acessar o app de qualquer lugar (ex: onclick)
const app = new App();

// Exporta a instância para uso em outros módulos
export default app;

