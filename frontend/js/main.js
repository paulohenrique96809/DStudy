// frontend/js/main.js

/**
 * MAIN - Ponto de entrada da aplicação
 * 
 * Responsabilidades:
 * - Inicializar a aplicação
 * - Gerenciar o roteamento entre telas
 * - Coordenar os módulos
 * - Gerenciar estado global
 * 
 * Agora com suporte a API real e simulada!
 */

// Importa os módulos
import { materias } from './materias.js';
import { estudo } from './estudo.js';
import { progresso } from './progresso.js';
import { flashcardComponent } from './components/flashcard.js';
import { progressoComponent } from './components/progresso.js';
import { 
    setBaseUrl, 
    setModoSimulacao, 
    isModoSimulacao,
    verificarAPI,
    get,
    post
} from './api.js';

/**
 * Classe principal da aplicação
 */
class App {
    constructor() {
        // Estado
        this.telaAtual = 'materias';
        this.materiaSelecionada = null;
        this.apiDisponivel = false;
        
        // Inicializa
        this.init();
    }

    /**
     * Inicialização da aplicação
     */
    async init() {
        console.log('🚀 ===== APLICAÇÃO INICIADA =====');
        console.log('📦 Versão: P03 - Comunicação com a API');
        
        // ===== CONFIGURAÇÃO DA API =====
        this.configurarAPI();
        
        // ===== CARREGA MÓDULOS =====
        console.log('📁 Módulos carregados:');
        console.log('  - materias.js ✅');
        console.log('  - estudo.js ✅');
        console.log('  - progresso.js ✅');
        console.log('  - components/flashcard.js ✅');
        console.log('  - components/progresso.js ✅');
        
        // ===== CONFIGURA EVENTOS =====
        this.setupEventListeners();
        
        // ===== CARREGA DADOS =====
        await this.carregarDadosIniciais();
        
        // ===== VERIFICA API =====
        await this.verificarConexaoAPI();
        
        console.log('🏁 ===== APLICAÇÃO PRONTA =====');
        console.log('💡 Digite "app" no console para interagir');
        console.log('💡 Comandos úteis:');
        console.log('  - app.verificarConexaoAPI()');
        console.log('  - app.setModoSimulacao(true/false)');
        console.log('  - await app.materias.carregar()');
    }

    /**
     * Configura a API
     */
    configurarAPI() {
        // ===== CONFIGURAR URL DA API =====
        // Em desenvolvimento local:
        // setBaseUrl('http://localhost:5000/api');
        
        // Em produção:
        // setBaseUrl('https://seuservidor.com/api');
        
        // Por enquanto, mantém vazio (usará simulação)
        setBaseUrl('');
        
        // ===== CONFIGURAR MODO DE SIMULAÇÃO =====
        // true = usa dados simulados (recomendado para testes iniciais)
        // false = usa API real (quando o Flask estiver pronto)
        setModoSimulacao(true);
        
        console.log(`🔧 API configurada: ${isModoSimulacao() ? 'MODO SIMULAÇÃO' : 'MODO REAL'}`);
    }

    /**
     * Configura os listeners de eventos
     */
    setupEventListeners() {
        // Escuta seleção de matéria
        document.addEventListener('materiaSelecionada', (e) => {
            this.materiaSelecionada = e.detail.materia;
            this.mostrarTelaEstudo();
        });

        // Botões de navegação
        document.addEventListener('DOMContentLoaded', () => {
            const btnVoltar = document.getElementById('btn-voltar');
            if (btnVoltar) {
                btnVoltar.addEventListener('click', () => this.mostrarTelaMaterias());
            }
        });
    }

    /**
     * Carrega os dados iniciais
     */
    async carregarDadosIniciais() {
        try {
            // Carrega matérias
            await materias.carregar();
            console.log('✅ Matérias carregadas');
            
            // Carrega progresso
            await progresso.carregar();
            console.log('✅ Progresso carregado');
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados iniciais:', error);
        }
    }

    /**
     * Verifica a conexão com a API
     */
    async verificarConexaoAPI() {
        try {
            this.apiDisponivel = await verificarAPI();
            console.log(`📡 API: ${this.apiDisponivel ? '✅ ONLINE' : '❌ OFFLINE'}`);
            
            if (!this.apiDisponivel && !isModoSimulacao()) {
                console.warn('⚠️ API offline. Ativando modo de simulação...');
                setModoSimulacao(true);
            }
            
            return this.apiDisponivel;
        } catch (error) {
            console.warn('⚠️ Não foi possível verificar API:', error);
            return false;
        }
    }

    /**
     * Mostra a tela de matérias
     */
    mostrarTelaMaterias() {
        this.telaAtual = 'materias';
        
        const telaMaterias = document.getElementById('tela-materias');
        const telaEstudo = document.getElementById('tela-estudo');
        
        if (telaMaterias) telaMaterias.style.display = 'block';
        if (telaEstudo) telaEstudo.style.display = 'none';
        
        // Recarrega dados ao voltar
        this.carregarDadosIniciais();
        
        // Limpa o estudo
        estudo.mostrarMensagem('');
        flashcardComponent.limpar();
    }

    /**
     * Mostra a tela de estudo
     */
    async mostrarTelaEstudo() {
        if (!this.materiaSelecionada) {
            console.error('❌ Nenhuma matéria selecionada');
            return;
        }

        this.telaAtual = 'estudo';
        
        const telaMaterias = document.getElementById('tela-materias');
        const telaEstudo = document.getElementById('tela-estudo');
        
        if (telaMaterias) telaMaterias.style.display = 'none';
        if (telaEstudo) telaEstudo.style.display = 'block';
        
        // Inicia o estudo
        await estudo.iniciar(this.materiaSelecionada);
    }

    /**
     * Alterna entre modo de simulação e API real
     * @param {boolean} ativo - true para simulação
     */
    setModoSimulacao(ativo) {
        setModoSimulacao(ativo);
        console.log(`🔄 Modo alterado: ${ativo ? 'SIMULAÇÃO' : 'API REAL'}`);
        
        // Recarrega dados
        this.carregarDadosIniciais();
    }

    /**
     * Teste completo da API
     */
    async testarAPI() {
        console.log('🧪 TESTE DE API');
        console.log('📋 Testando todas as rotas...');
        
        try {
            // 1. Testa matérias
            console.log('1️⃣ Testando GET /materias');
            const materiasData = await materias.carregar();
            console.log(`   ✅ ${materiasData.length} matérias`);
            
            // 2. Testa flashcards
            if (materiasData.length > 0) {
                const materiaId = materiasData[0].id;
                console.log(`2️⃣ Testando GET /materias/${materiaId}/flashcards`);
                const flashcards = await get(`/materias/${materiaId}/flashcards`);
                console.log(`   ✅ ${flashcards.length} flashcards`);
            }
            
            // 3. Testa progresso
            console.log('3️⃣ Testando GET /progresso');
            const progressoData = await progresso.carregar();
            console.log(`   ✅ Progresso carregado`);
            
            // 4. Testa resposta
            if (materiasData.length > 0) {
                const materiaId = materiasData[0].id;
                const flashcards = await get(`/materias/${materiaId}/flashcards`);
                if (flashcards.length > 0) {
                    console.log(`4️⃣ Testando POST /flashcards/${flashcards[0].id}/responder`);
                    const resultado = await post(`/flashcards/${flashcards[0].id}/responder`, {
                        acertou: true
                    });
                    console.log(`   ✅ Resposta registrada:`, resultado);
                }
            }
            
            console.log('🎉 TODOS OS TESTES PASSARAM!');
            
        } catch (error) {
            console.error('❌ Teste falhou:', error);
        }
    }
}

// Cria instância global
const app = new App();

// Torna os módulos acessíveis globalmente para testes
window.app = app;
window.materias = materias;
window.estudo = estudo;
window.progresso = progresso;
window.flashcardComponent = flashcardComponent;
window.progressoComponent = progressoComponent;


// Exporta funções da API para testes
export { get, post, put, del, setBaseUrl, setModoSimulacao, isModoSimulacao } from './api.js';

export default app;