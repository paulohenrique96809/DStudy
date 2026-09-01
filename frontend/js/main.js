// frontend/js/main.js

import { materias } from './materias.js';
import { estudo } from './estudo.js';
import { progresso } from './progresso.js';
import { flashcardComponent } from './components/flashcard.js';
import { setModoSimulacao, isModoSimulacao, get, post } from './api.js';

class App {
    constructor() {
        this.materias = materias;
        this.estudo = estudo;
        this.progresso = progresso;
        this.flashcardComponent = flashcardComponent;
        
        this.telaAtual = 'materias';
        this.materiaSelecionada = null;
        
        this.init();
    }

    async init() {
        console.log('🚀 ===== APLICAÇÃO INICIADA =====');
        console.log('📦 Versão: P05 - Seleção de matéria');
        
        setModoSimulacao(true);
        console.log(`🔧 API: ${isModoSimulacao() ? 'SIMULAÇÃO' : 'REAL'}`);
        
        this.setupEventListeners();
        
        // Carrega dados
        await this.progresso.carregar();
        await this.materias.carregar();
        
        console.log('🏁 ===== APLICAÇÃO PRONTA =====');
        console.log('💡 Comandos:');
        console.log('  await app.materias.carregar()');
        console.log('  await app.progresso.carregar()');
        console.log('  await app.testarAPI()');
    }

    setupEventListeners() {
        // ⭐ ESCUTA SELEÇÃO DE MATÉRIA
        document.addEventListener('materiaSelecionada', (e) => {
            this.materiaSelecionada = e.detail.materia;
            this.mostrarTelaEstudo();
        });

        // ⭐ ESCUTA O BOTÃO VOLTAR DO NAVEGADOR
        window.addEventListener('popstate', (e) => {
            console.log('🔙 [MAIN] Popstate detectado, voltando para matérias...');
            this.mostrarTelaMaterias();
        });
    }

    /**
     * ⭐ MOSTRA TELA DE MATÉRIAS
     */
    mostrarTelaMaterias() {
        this.telaAtual = 'materias';
        this.materiaSelecionada = null;
        
        // Troca as telas
        document.getElementById('tela-materias').style.display = 'block';
        document.getElementById('tela-materias').classList.add('ativa');
        document.getElementById('tela-estudo').style.display = 'none';
        document.getElementById('tela-estudo').classList.remove('ativa');
        
        // Limpa o estudo
        this.estudo.mostrarMensagem('');
        this.flashcardComponent.limpar();
        
        // Recarrega dados
        this.progresso.carregar();
        this.materias.renderizar();
        
        console.log('📊 [MAIN] Voltou para matérias');
    }

    /**
     * ⭐ MOSTRA TELA DE ESTUDO
     */
    mostrarTelaEstudo() {
        if (!this.materiaSelecionada) {
            console.error('❌ Nenhuma matéria selecionada');
            return;
        }

        this.telaAtual = 'estudo';
        
        // Troca as telas
        document.getElementById('tela-materias').style.display = 'none';
        document.getElementById('tela-materias').classList.remove('ativa');
        document.getElementById('tela-estudo').style.display = 'block';
        document.getElementById('tela-estudo').classList.add('ativa');
        
        // ⭐ ADICIONA AO HISTÓRICO DO NAVEGADOR
        window.history.pushState({ tela: 'estudo' }, '', '?estudo');
        
        // Inicia o estudo
        this.estudo.iniciar(this.materiaSelecionada);
    }

    async testarAPI() {
        console.log('🧪 Testando API...');
        try {
            const materiasData = await get('/materias');
            console.log('✅ Matérias:', materiasData);
            const progressoData = await get('/progresso');
            console.log('✅ Progresso:', progressoData);
            alert('✅ API funcionando!');
        } catch (error) {
            console.error('❌ Erro:', error);
            alert('❌ Erro na API!');
        }
    }
}

const app = new App();
window.app = app;

export default app;