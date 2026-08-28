// frontend/js/main.js

/**
 * MAIN - Ponto de entrada da aplicação
 * 
 * Responsabilidades:
 * - Inicializar a aplicação
 * - Gerenciar o roteamento entre telas
 * - Coordenar os módulos
 * - Gerenciar estado global
 */

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
    post,
    put,
    del
} from './api.js';

class App {
    constructor() {
        // ⭐ ============================================================
        // ⭐ ATRIBUI OS MÓDULOS COMO PROPRIEDADES DA CLASSE
        // ⭐ ============================================================
        this.materias = materias;
        this.estudo = estudo;
        this.progresso = progresso;
        this.flashcardComponent = flashcardComponent;
        this.progressoComponent = progressoComponent;
        
        // Estado da aplicação
        this.telaAtual = 'materias';
        this.materiaSelecionada = null;
        this.apiDisponivel = false;
        
        // Inicializa
        this.init();
    }

    async init() {
    console.log('🚀 ===== APLICAÇÃO INICIADA =====');
    console.log('📦 Versão: P04 - Página de matérias');
    
    this.configurarAPI();
    this.setupEventListeners();
    
    // ⭐ CARREGA TUDO EM SEQUÊNCIA
    await progresso.carregar();  // Primeiro o progresso
    await materias.carregar();   // Depois as matérias (usa o progresso)
    
    console.log('🏁 ===== APLICAÇÃO PRONTA =====');
    console.log('💡 Comandos:');
    console.log('  await app.materias.carregar()');
    console.log('  await app.progresso.carregar()');
    console.log('  await app.testarAPI()');
}

    configurarAPI() {
        setBaseUrl('');
        setModoSimulacao(true);
        console.log(`🔧 API configurada: ${isModoSimulacao() ? 'MODO SIMULAÇÃO' : 'MODO REAL'}`);
    }

    setupEventListeners() {
    // Escuta seleção de matéria
    document.addEventListener('materiaSelecionada', (e) => {
        this.materiaSelecionada = e.detail.materia;
        this.mostrarTelaEstudo();
    });

    // ⭐ ESCUTA ATUALIZAÇÃO DE PROGRESSO
    document.addEventListener('progressoAtualizado', async (e) => {
        console.log('📊 [MAIN] Progresso atualizado, re-renderizando...');
        await this.materias.atualizarProgresso();
        await this.progresso.carregar();
        this.progresso.renderizar();
    });

    // Botões de navegação
    document.addEventListener('DOMContentLoaded', () => {
        const btnVoltar = document.getElementById('btn-voltar');
        if (btnVoltar) {
            btnVoltar.addEventListener('click', () => this.mostrarTelaMaterias());
        }
    });
}

    async carregarDadosIniciais() {
        try {
            await this.materias.carregar();
            console.log('✅ Matérias carregadas');
            
            await this.progresso.carregar();
            console.log('✅ Progresso carregado');
        } catch (error) {
            console.error('❌ Erro ao carregar dados iniciais:', error);
        }
    }

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

    mostrarTelaMaterias() {
        this.telaAtual = 'materias';
        
        const telaMaterias = document.getElementById('tela-materias');
        const telaEstudo = document.getElementById('tela-estudo');
        
        if (telaMaterias) telaMaterias.style.display = 'block';
        if (telaEstudo) telaEstudo.style.display = 'none';
        
        this.carregarDadosIniciais();
        this.estudo.mostrarMensagem('');
        this.flashcardComponent.limpar();
    }

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
        
        await this.estudo.iniciar(this.materiaSelecionada);
    }

    setModoSimulacao(ativo) {
        setModoSimulacao(ativo);
        console.log(`🔄 Modo alterado: ${ativo ? 'SIMULAÇÃO' : 'API REAL'}`);
        this.carregarDadosIniciais();
    }

    // ============================================================
    // ⭐ MÉTODO TESTAR INTEGRAÇÃO
    // ============================================================

    async testarIntegracao() {
        console.log('🧪 ===== TESTE DE INTEGRAÇÃO =====');
        console.log('📋 Verificando todos os módulos...\n');
        
        try {
            // 1. Testa matérias
            console.log('1️⃣ Testando módulo materias');
            await this.materias.carregar();
            console.log(`   ✅ ${this.materias.lista.length} matérias carregadas`);
            console.log(`   📚 ${this.materias.lista.map(m => m.nome).join(', ')}\n`);

            // 2. Testa progresso
            console.log('2️⃣ Testando módulo progresso');
            await this.progresso.carregar();
            console.log(`   ✅ Progresso carregado`);
            console.log(`   📊 Geral: ${this.progresso.dados?.progresso_geral || 0}%\n`);

            // 3. Testa componente flashcard
            console.log('3️⃣ Testando componente flashcard');
            const testFlashcard = {
                id: 999,
                pergunta: 'Teste de integração?',
                resposta: 'Funcionando perfeitamente!'
            };
            this.flashcardComponent.renderizar(testFlashcard);
            console.log('   ✅ Flashcard renderizado\n');

            // 4. Testa componente progresso
            console.log('4️⃣ Testando componente progresso');
            this.progressoComponent.criarBarra(75, 'Teste');
            console.log('   ✅ Componente progresso OK\n');

            // 5. Testa API
            console.log('5️⃣ Testando API');
            const apiStatus = await this.verificarConexaoAPI();
            console.log(`   ✅ API: ${apiStatus ? 'ONLINE' : 'OFFLINE (simulação)'}`);
            console.log(`   📡 Modo: ${isModoSimulacao() ? 'SIMULAÇÃO' : 'REAL'}\n`);

            console.log('🎉 ===== TODOS OS MÓDULOS INTEGRADOS! =====');
            console.log('✅ O sistema está funcionando corretamente.');
            
            alert('✅ Teste de integração concluído com sucesso!\n\nVerifique o console para mais detalhes.');
            
        } catch (error) {
            console.error('❌ ===== TESTE DE INTEGRAÇÃO FALHOU =====');
            console.error('❌ Erro:', error.message);
            console.error('💡 Detalhes:', error);
            
            alert(`❌ Erro no teste de integração:\n\n${error.message}\n\nVerifique o console para mais detalhes.`);
        }
    }

    // ============================================================
    // ⭐ MÉTODO TESTAR API
    // ============================================================

    async testarAPI() {
        console.log('🧪 ===== TESTE DE API =====');
        console.log(`📋 Modo atual: ${isModoSimulacao() ? 'SIMULAÇÃO' : 'API REAL'}`);
        console.log('📋 Testando todas as rotas...\n');
        
        try {
            // 1. Testa matérias
            console.log('1️⃣ Testando GET /materias');
            const materiasData = await get('/materias');
            console.log(`   ✅ ${materiasData.length} matérias encontradas`);
            console.log(`   📚 ${materiasData.map(m => m.nome).join(', ')}\n`);
            
            // 2. Testa flashcards
            if (materiasData.length > 0) {
                const materiaId = materiasData[0].id;
                console.log(`2️⃣ Testando GET /materias/${materiaId}/flashcards`);
                const flashcards = await get(`/materias/${materiaId}/flashcards`);
                console.log(`   ✅ ${flashcards.length} flashcards encontrados`);
                if (flashcards.length > 0) {
                    console.log(`   🃏 ${flashcards[0].pergunta} → ${flashcards[0].resposta}\n`);
                }
            }
            
            // 3. Testa progresso
            console.log('3️⃣ Testando GET /progresso');
            const progressoData = await get('/progresso');
            console.log(`   ✅ Progresso carregado`);
            console.log(`   📊 Geral: ${progressoData.progresso_geral || 0}%\n`);
            
            // 4. Testa resposta
            if (materiasData.length > 0) {
                const materiaId = materiasData[0].id;
                const flashcards = await get(`/materias/${materiaId}/flashcards`);
                if (flashcards.length > 0) {
                    const flashcardId = flashcards[0].id;
                    console.log(`4️⃣ Testando POST /flashcards/${flashcardId}/responder`);
                    const resultado = await post(`/flashcards/${flashcardId}/responder`, {
                        acertou: true
                    });
                    console.log(`   ✅ Resposta registrada!`);
                    console.log(`   📝 ${resultado.mensagem || 'Sucesso!'}\n`);
                }
            }
            
            console.log('🎉 ===== TODOS OS TESTES PASSARAM! =====');
            console.log('💡 A API está funcionando corretamente.');
            
            alert('✅ Teste concluído com sucesso!\n\nVerifique o console para mais detalhes.');
            
        } catch (error) {
            console.error('❌ ===== TESTE FALHOU =====');
            console.error('❌ Erro:', error.message);
            console.error('💡 Detalhes:', error);
            
            alert(`❌ Erro no teste:\n\n${error.message}\n\nVerifique o console para mais detalhes.`);
        }
    }
}

// ============================================================
// CRIA INSTÂNCIA E EXPÕE GLOBALMENTE
// ============================================================

const app = new App();

// ⭐ Torna o app acessível globalmente
window.app = app;

// ⭐ Torna os módulos acessíveis globalmente (também)
window.materias = materias;
window.estudo = estudo;
window.progresso = progresso;
window.flashcardComponent = flashcardComponent;
window.progressoComponent = progressoComponent;

// ⭐ Torna as funções da API acessíveis globalmente
window.get = get;
window.post = post;
window.put = put;
window.del = del;
window.setBaseUrl = setBaseUrl;
window.setModoSimulacao = setModoSimulacao;
window.isModoSimulacao = isModoSimulacao;

console.log('✅ ===== APP PRONTO =====');
console.log('💡 Comandos disponíveis:');
console.log('  await app.materias.carregar()     - Carregar matérias');
console.log('  await app.progresso.carregar()    - Carregar progresso');
console.log('  await app.testarAPI()             - Testar API');
console.log('  await app.testarIntegracao()      - Testar integração');
console.log('  app.setModoSimulacao(true/false)  - Alternar modo');

export default app;