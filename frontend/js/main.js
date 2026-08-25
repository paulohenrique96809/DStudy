// frontend/js/main.js

/**
 * MAIN - Ponto de entrada da aplicação
 * 
 * Responsabilidades:
 * - Inicializar a aplicação quando a página carrega
 * - Gerenciar o estado global (usuário, matérias, etc.)
 * - Coordenar a navegação entre telas
 * 
 * Por enquanto, apenas testa se a estrutura está funcionando
 */

// Importa funções da API
import { 
    get, 
    post, 
    getSimulado,
    dadosSimulados 
} from './api.js';

/**
 * Classe principal da aplicação
 * Tudo começa aqui
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
     * - Configura listeners
     * - Carrega dados iniciais
     * - Mostra status no console
     */
    async init() {
        console.log('🚀 ===== APLICAÇÃO INICIADA =====');
        console.log('📅', new Date().toLocaleString());
        console.log('📦 Versão: P01 - Preparação do JavaScript');
        
        // Configura os eventos da página
        this.setupEventListeners();
        
        // Testa a API simulada
        await this.testarConexao();
        
        // Carrega as matérias (simulado)
        await this.carregarMaterias();
        
        // Mostra status na tela
        this.mostrarStatus('✅ JavaScript carregado com sucesso!', 'success');
        
        console.log('💡 Dica: Digite "app" no console para acessar a aplicação');
        console.log('💡 Exemplo: await app.carregarMaterias()');
        console.log('💡 Exemplo: await app.testarConexao()');
        console.log('🏁 ===== APLICAÇÃO PRONTA =====');
    }

    /**
     * Configura os listeners de eventos da página
     */
    setupEventListeners() {
        // Aguarda o DOM carregar
        document.addEventListener('DOMContentLoaded', () => {
            console.log('📄 DOM carregado!');
            
            // Botão de teste
            const btnTeste = document.getElementById('btn-teste');
            if (btnTeste) {
                btnTeste.addEventListener('click', () => {
                    this.testarConexao();
                });
            }
            
            // Botão para carregar matérias
            const btnMaterias = document.getElementById('btn-materias');
            if (btnMaterias) {
                btnMaterias.addEventListener('click', () => {
                    this.carregarMaterias();
                });
            }
        });
    }

    /**
     * Testa a conexão com a API
     * Tenta usar a API real, se falhar, usa a simulação
     */
    async testarConexao() {
        console.log('🧪 Testando conexão com a API...');
        
        try {
            // Tenta fazer uma requisição real
            // const resultado = await get('/materias');
            // console.log('✅ API real respondendo!', resultado);
            
            // Por enquanto, usamos simulação
            console.log('🔵 Usando modo de simulação (Flask não está rodando)');
            const materiasSimuladas = await getSimulado('/materias');
            console.log('✅ Teste de simulação bem-sucedido!', materiasSimuladas);
            
            this.mostrarStatus('✅ Modo de simulação ativo. Teste concluído!', 'success');
            
        } catch (error) {
            console.error('❌ Erro no teste de conexão:', error);
            this.mostrarStatus('❌ Erro na conexão. Verifique o console.', 'error');
        }
    }

    /**
     * Carrega as matérias (simulado)
     */
    async carregarMaterias() {
        console.log('📚 Carregando matérias...');
        
        try {
            // Usa dados simulados
            const materias = await getSimulado('/materias');
            this.materias = materias;
            
            console.log('📚 Matérias carregadas:', this.materias);
            this.renderizarMaterias();
            this.mostrarStatus(`✅ ${this.materias.length} matérias carregadas!`, 'success');
            
        } catch (error) {
            console.error('❌ Erro ao carregar matérias:', error);
            this.mostrarStatus('❌ Erro ao carregar matérias.', 'error');
        }
    }

    /**
     * Renderiza as matérias na tela (versão simplificada para P01)
     */
    renderizarMaterias() {
        const container = document.getElementById('materias-container');
        if (!container) {
            console.warn('⚠️ Container de matérias não encontrado');
            return;
        }

        if (!this.materias || this.materias.length === 0) {
            container.innerHTML = '<p>Nenhuma matéria encontrada.</p>';
            return;
        }

        // Cria cards para cada matéria
        container.innerHTML = this.materias.map(materia => `
            <div class="materia-card" data-id="${materia.id}">
                <h3>${materia.nome}</h3>
                <p>${materia.descricao || 'Descrição não disponível'}</p>
                <button onclick="app.selecionarMateria(${materia.id})">
                    Estudar
                </button>
            </div>
        `).join('');

        console.log(`✅ ${this.materias.length} matérias renderizadas`);
    }

    /**
     * Seleciona uma matéria para estudo
     * @param {number} materiaId - ID da matéria
     */
    async selecionarMateria(materiaId) {
        console.log(`📖 Selecionando matéria ${materiaId}...`);
        
        try {
            // Busca flashcards da matéria
            const flashcards = await getSimulado(`/materias/${materiaId}/flashcards`);
            
            if (flashcards.length === 0) {
                this.mostrarStatus('⚠️ Esta matéria não tem flashcards ainda.', 'warning');
                return;
            }
            
            console.log(`🃏 ${flashcards.length} flashcards encontrados:`, flashcards);
            
            // Mostra o primeiro flashcard no console
            this.flashcardAtual = flashcards[0];
            console.log('📝 Primeiro flashcard:', this.flashcardAtual);
            
            // Feedback visual
            this.mostrarStatus(`✅ ${flashcards.length} flashcards carregados! Pronto para estudar.`, 'success');
            
            // Abre um alerta com o flashcard (temporário para teste)
            alert(`📚 Matéria selecionada!\n\nPergunta: ${this.flashcardAtual.pergunta}\nResposta: ${this.flashcardAtual.resposta}\n\n(Em breve isso será a tela de estudo)`);
            
        } catch (error) {
            console.error('❌ Erro ao selecionar matéria:', error);
            this.mostrarStatus('❌ Erro ao carregar flashcards.', 'error');
        }
    }

    /**
     * Mostra mensagens de status na tela
     * @param {string} mensagem - Texto da mensagem
     * @param {string} tipo - success, error, warning
     */
    mostrarStatus(mensagem, tipo = 'info') {
        const statusDiv = document.getElementById('app-status');
        if (!statusDiv) return;
        
        // Cores por tipo
        const cores = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        statusDiv.textContent = mensagem;
        statusDiv.style.color = cores[tipo] || cores.info;
        statusDiv.style.display = 'block';
        statusDiv.style.padding = '10px';
        statusDiv.style.borderRadius = '4px';
        statusDiv.style.backgroundColor = '#f8f9fa';
        statusDiv.style.border = `1px solid ${cores[tipo] || cores.info}`;
        
        // Se for erro, mostra no console também
        if (tipo === 'error') {
            console.error('❌', mensagem);
        }
    }
}

// Cria uma instância global da aplicação
const app = new App();

// Torna a aplicação acessível globalmente para testes no console
window.app = app;

// Exporta a instância para uso em outros módulos
export default app;