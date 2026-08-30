// frontend/js/main.js

import { materias } from './materias.js';
import { estudo } from './estudo.js';
import { progresso } from './progresso.js';
import { flashcardComponent } from './components/flashcard.js';
import { progressoComponent } from './components/progresso.js';
// ⭐ REMOVE verificarAPI da importação
import { 
    setBaseUrl, 
    setModoSimulacao, 
    isModoSimulacao,
    get,
    post,
    put,
    del
} from './api.js';

class App {
    constructor() {
        this.materias = materias;
        this.estudo = estudo;
        this.progresso = progresso;
        this.flashcardComponent = flashcardComponent;
        this.progressoComponent = progressoComponent;
        
        this.telaAtual = 'materias';
        this.materiaSelecionada = null;
        this.apiDisponivel = false;
        
        this.init();
    }

    async init() {
        console.log('🚀 ===== APLICAÇÃO INICIADA =====');
        console.log('📦 Versão: P04 - Página de matérias');
        
        this.configurarAPI();
        this.setupEventListeners();
        
        await progresso.carregar();
        await materias.carregar();
        
        console.log('🏁 ===== APLICAÇÃO PRONTA =====');
        console.log('💡 Comandos:');
        console.log('  await app.materias.carregar()');
        console.log('  await app.progresso.carregar()');
        console.log('  await app.testarAPI()');
    }

    configurarAPI() {
        setBaseUrl('');
        setModoSimulacao(true);
        console.log(`🔧 API: ${isModoSimulacao() ? 'SIMULAÇÃO' : 'REAL'}`);
    }

    setupEventListeners() {
        document.addEventListener('materiaSelecionada', (e) => {
            this.materiaSelecionada = e.detail.materia;
            this.mostrarTelaEstudo();
        });

        document.addEventListener('DOMContentLoaded', () => {
            const btnVoltar = document.getElementById('btn-voltar');
            if (btnVoltar) {
                btnVoltar.addEventListener('click', () => this.mostrarTelaMaterias());
            }
        });
    }

    mostrarTelaMaterias() {
        this.telaAtual = 'materias';
        
        const telaMaterias = document.getElementById('tela-materias');
        const telaEstudo = document.getElementById('tela-estudo');
        
        if (telaMaterias) telaMaterias.style.display = 'block';
        if (telaEstudo) telaEstudo.style.display = 'none';
        
        this.materias.renderizar();
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
        console.log(`🔄 Modo: ${ativo ? 'SIMULAÇÃO' : 'REAL'}`);
        this.carregarDadosIniciais();
    }

    async carregarDadosIniciais() {
        await progresso.carregar();
        await materias.carregar();
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
window.materias = materias;
window.estudo = estudo;
window.progresso = progresso;
window.flashcardComponent = flashcardComponent;
window.progressoComponent = progressoComponent;
window.get = get;
window.post = post;
window.put = put;
window.del = del;

export default app;