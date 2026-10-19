// frontend/js/main.js

import { materias } from './materias.js';
import { estudo } from './estudo.js';
import { progresso } from './progresso.js';
import { flashcardComponent } from './components/flashcard.js';
import { progressoComponent } from './components/progresso.js';
import { setModoSimulacao, isModoSimulacao, verificarAPI, get, post } from './api.js';

class App {
    constructor() {
        this.materias = materias;
        this.estudo = estudo;
        this.progresso = progresso;
        this.flashcardComponent = flashcardComponent;
        this.progressoComponent = progressoComponent;
        
        this.telaAtual = 'materias';
        this.materiaSelecionada = null;
        
        this.init();
    }

    async init() {
        console.log('🚀 ===== APLICAÇÃO INICIADA =====');
        
        this.setupEventListeners();
        
        // ⭐ ORDEM CORRETA:
        // 1. Carrega a lista de matérias (sem renderizar)
        await materias.carregar(); 
        
        // 2. Busca o progresso de TODAS as matérias
        await this.progresso.carregarTudo(materias.lista);
        
        // 3. Agora sim, renderiza os cards com os dados do progresso prontos
        materias.renderizar();
        
        console.log('🏁 ===== APLICAÇÃO PRONTA =====');
    }


    setupEventListeners() {
        document.addEventListener('materiaSelecionada', (e) => {
            console.log('📖 [MAIN] Evento materiaSelecionada recebido!');
            this.materiaSelecionada = e.detail.materia;
            this.mostrarTelaEstudo();
        });

        window.addEventListener('popstate', (e) => {
            this.mostrarTelaMaterias();
        });
    }

    async mostrarTelaMaterias() {
        if (this.telaAtual === 'materias') return;
        
        this.telaAtual = 'materias';
        this.materiaSelecionada = null;
        
        document.getElementById('tela-materias').style.display = 'block';
        document.getElementById('tela-materias').classList.add('ativa');
        document.getElementById('tela-estudo').style.display = 'none';
        document.getElementById('tela-estudo').classList.remove('ativa');
        
        this.estudo.mostrarMensagem('');
        this.flashcardComponent.limpar();
        
        // Atualiza o progresso e só depois renderiza
        await this.progresso.carregarTudo(materias.lista);
        materias.renderizar();
    }

    mostrarTelaEstudo() {
        if (!this.materiaSelecionada) return;

        this.telaAtual = 'estudo';
        
        document.getElementById('tela-materias').style.display = 'none';
        document.getElementById('tela-materias').classList.remove('ativa');
        document.getElementById('tela-estudo').style.display = 'block';
        document.getElementById('tela-estudo').classList.add('ativa');
        
        window.history.pushState({ tela: 'estudo' }, '', '?estudo');
        
        this.estudo.iniciar(this.materiaSelecionada);
    }
}

const app = new App();
window.app = app;

export default app;