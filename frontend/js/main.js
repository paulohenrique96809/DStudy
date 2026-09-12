// frontend/js/main.js

import { materias } from './materias.js';
import { estudo } from './estudo.js';
import { progresso } from './progresso.js';
import { flashcardComponent } from './components/flashcard.js';
import { isModoSimulacao, verificarAPI, get, post } from './api.js';

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
        console.log('📦 Versão: P05.5 - Integração com API Real');
        
        // ⭐ VERIFICA SE A API ESTÁ ONLINE
        const apiOnline = await verificarAPI();
        console.log(`🔧 Modo: ${apiOnline ? 'API REAL' : 'SIMULAÇÃO'}`);
        
        this.setupEventListeners();
        
        await this.progresso.carregar();
        await this.materias.carregar();
        
        console.log('🏁 ===== APLICAÇÃO PRONTA =====');
        console.log('💡 Comandos:');
        console.log('  await app.materias.carregar()');
        console.log('  await app.progresso.carregar()');
        console.log('  await app.testarAPI()');
    }

    setupEventListeners() {
        document.addEventListener('materiaSelecionada', (e) => {
            this.materiaSelecionada = e.detail.materia;
            this.mostrarTelaEstudo();
        });

        window.addEventListener('popstate', (e) => {
            this.mostrarTelaMaterias();
        });
    }

    mostrarTelaMaterias() {
        if (this.telaAtual === 'materias') return;
        
        this.telaAtual = 'materias';
        this.materiaSelecionada = null;
        
        document.getElementById('tela-materias').style.display = 'block';
        document.getElementById('tela-materias').classList.add('ativa');
        document.getElementById('tela-estudo').style.display = 'none';
        document.getElementById('tela-estudo').classList.remove('ativa');
        
        this.estudo.mostrarMensagem('');
        this.flashcardComponent.limpar();
        
        this.progresso.carregar();
        this.materias.renderizar();
    }

    mostrarTelaEstudo() {
        if (!this.materiaSelecionada) {
            console.error('❌ Nenhuma matéria selecionada');
            return;
        }

        this.telaAtual = 'estudo';
        
        document.getElementById('tela-materias').style.display = 'none';
        document.getElementById('tela-materias').classList.remove('ativa');
        document.getElementById('tela-estudo').style.display = 'block';
        document.getElementById('tela-estudo').classList.add('ativa');
        
        window.history.pushState({ tela: 'estudo' }, '', '?estudo');
        
        this.estudo.iniciar(this.materiaSelecionada);
    }

    async testarAPI() {
        console.log('🧪 Testando API...');
        console.log(`Modo atual: ${isModoSimulacao() ? 'SIMULAÇÃO' : 'REAL'}`);
        try {
            const materiasData = await get('/materias');
            console.log('✅ Matérias:', materiasData);
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