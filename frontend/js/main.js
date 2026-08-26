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
 * Agora com a arquitetura completa de módulos!
 */

// Importa os módulos
import { materias } from './materias.js';
import { estudo } from './estudo.js';
import { progresso } from './progresso.js';
import { flashcardComponent } from './components/flashcard.js';
import { progressoComponent } from './components/progresso.js';

/**
 * Classe principal da aplicação
 */
class App {
    constructor() {
        // Estado
        this.telaAtual = 'materias';
        this.materiaSelecionada = null;
        
        // Inicializa
        this.init();
    }

    /**
     * Inicialização da aplicação
     */
    async init() {
        console.log('🚀 ===== APLICAÇÃO INICIADA =====');
        console.log('📦 Versão: P02 - Arquitetura dos módulos');
        console.log('📁 Módulos carregados:');
        console.log('  - materias.js ✅');
        console.log('  - estudo.js ✅');
        console.log('  - progresso.js ✅');
        console.log('  - components/flashcard.js ✅');
        console.log('  - components/progresso.js ✅');
        
        // Configura eventos
        this.setupEventListeners();
        
        // Carrega matérias automaticamente
        await this.carregarMaterias();
        
        // Carrega progresso
        await this.carregarProgresso();
        
        console.log('🏁 ===== APLICAÇÃO PRONTA =====');
        console.log('💡 Digite "app" no console para interagir');
        console.log('💡 Módulos disponíveis:');
        console.log('  - app.materias');
        console.log('  - app.estudo');
        console.log('  - app.progresso');
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
     * Carrega as matérias
     */
    async carregarMaterias() {
        try {
            await materias.carregar();
            console.log('✅ Matérias carregadas com sucesso');
        } catch (error) {
            console.error('❌ Erro ao carregar matérias:', error);
        }
    }

    /**
     * Carrega o progresso
     */
    async carregarProgresso() {
        try {
            await progresso.carregar();
            console.log('✅ Progresso carregado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao carregar progresso:', error);
        }
    }

    /**
     * Mostra a tela de matérias
     */
    mostrarTelaMaterias() {
        this.telaAtual = 'materias';
        
        document.getElementById('tela-materias').style.display = 'block';
        document.getElementById('tela-estudo').style.display = 'none';
        
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
        
        document.getElementById('tela-materias').style.display = 'none';
        document.getElementById('tela-estudo').style.display = 'block';
        
        // Inicia o estudo
        await estudo.iniciar(this.materiaSelecionada);
    }

    /**
     * Teste de integração entre módulos
     */
    async testarIntegracao() {
        console.log('🧪 Testando integração entre módulos...');
        
        try {
            // Testa matérias
            await materias.carregar();
            console.log('✅ Módulo materias OK');
            
            // Testa progresso
            await progresso.carregar();
            console.log('✅ Módulo progresso OK');
            
            // Testa componentes
            const testFlashcard = {
                id: 999,
                pergunta: 'Teste de integração?',
                resposta: 'Funcionando perfeitamente!'
            };
            flashcardComponent.renderizar(testFlashcard);
            console.log('✅ Componente flashcard OK');
            
            console.log('🎉 Todos os módulos integrados com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro no teste de integração:', error);
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

export default app;