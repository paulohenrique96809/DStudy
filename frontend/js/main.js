// frontend/js/main.js

import { materias } from './materias.js';
import { estudo } from './estudo.js';
import { progresso } from './progresso.js';
import { flashcardComponent } from './components/flashcard.js';
import { progressoComponent } from './components/progresso.js';
import { setModoSimulacao, isModoSimulacao, get, post } from './api.js';
import { auth } from './auth.js'; 

class App {
    constructor() {
        this.materias = materias;
        this.estudo = estudo;
        this.progresso = progresso;
        this.flashcardComponent = flashcardComponent;
        this.progressoComponent = progressoComponent;
        
        this.telaAtual = 'login';
        this.materiaSelecionada = null;
        
        this.init();
    }

    async init() {
        console.log('🚀 ===== APLICAÇÃO INICIADA =====');
        
        if (!auth.estaLogado()) {
            this.mostrarTelaLogin();
            return;
        }

        await this.iniciarAppLogado();
    }

    // ==========================================
    // CONTROLE DE TELAS DE AUTENTICAÇÃO
    // ==========================================

    esconderTodasAsTelas() {
        document.getElementById('tela-login').style.display = 'none';
        document.getElementById('tela-cadastro').style.display = 'none';
        document.getElementById('tela-materias').style.display = 'none';
        document.getElementById('tela-estudo').style.display = 'none';
    }

    mostrarTelaLogin() {
        this.telaAtual = 'login';
        this.esconderTodasAsTelas();
        
        const tela = document.getElementById('tela-login');
        if (tela) tela.style.display = 'block';
        
        // Limpa os formulários ao voltar para o login
        const formLogin = document.getElementById('form-login');
        if (formLogin) formLogin.reset();
        
        this.configurarFormularioLogin();
        this.configurarNavegacaoAuth();
    }

    mostrarTelaCadastro() {
        this.telaAtual = 'cadastro';
        this.esconderTodasAsTelas();
        
        const tela = document.getElementById('tela-cadastro');
        if (tela) tela.style.display = 'block';
        
        // Limpa os formulários ao entrar no cadastro
        const formCadastro = document.getElementById('form-cadastro');
        if (formCadastro) formCadastro.reset();
        
        // Esconde mensagens de erro/sucesso antigas
        const erro = document.getElementById('cadastro-erro');
        const sucesso = document.getElementById('cadastro-sucesso');
        if (erro) erro.style.display = 'none';
        if (sucesso) sucesso.style.display = 'none';

        this.configurarFormularioCadastro();
        this.configurarNavegacaoAuth();
    }

    configurarNavegacaoAuth() {
        const linkCadastro = document.getElementById('link-cadastro');
        const linkLogin = document.getElementById('link-login');

        if (linkCadastro) {
            linkCadastro.onclick = (e) => { e.preventDefault(); this.mostrarTelaCadastro(); };
        }
        if (linkLogin) {
            linkLogin.onclick = (e) => { e.preventDefault(); this.mostrarTelaLogin(); };
        }
    }

    // ==========================================
    // LOGIN
    // ==========================================

    configurarFormularioLogin() {
        const form = document.getElementById('form-login');
        const erroDiv = document.getElementById('login-erro');

        if (!form) return;

        const novoForm = form.cloneNode(true);
        form.parentNode.replaceChild(novoForm, form);

        novoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value.trim();
            const senha = document.getElementById('login-senha').value;
            const btnSubmit = novoForm.querySelector('button[type="submit"]');

            if (!email || !senha) {
                if (erroDiv) {
                    erroDiv.textContent = 'Preencha todos os campos.';
                    erroDiv.style.display = 'block';
                }
                return;
            }

            try {
                if (erroDiv) erroDiv.style.display = 'none';
                if (btnSubmit) {
                    btnSubmit.textContent = 'ENTRANDO...';
                    btnSubmit.disabled = true;
                }

                const resposta = await post('/login', { email, senha });
                auth.salvarSessao(resposta.access_token, resposta.usuario);
                window.location.reload();

            } catch (error) {
                if (erroDiv) {
                    erroDiv.textContent = error.message || 'E-mail ou senha incorretos.';
                    erroDiv.style.display = 'block';
                }
                if (btnSubmit) {
                    btnSubmit.textContent = 'ENTRAR';
                    btnSubmit.disabled = false;
                }
            }
        });
    }

    // ==========================================
    // CADASTRO
    // ==========================================

    configurarFormularioCadastro() {
        const form = document.getElementById('form-cadastro');
        const erroDiv = document.getElementById('cadastro-erro');
        const sucessoDiv = document.getElementById('cadastro-sucesso');

        if (!form) return;

        const novoForm = form.cloneNode(true);
        form.parentNode.replaceChild(novoForm, form);

        novoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nome = document.getElementById('cadastro-nome').value.trim();
            const email = document.getElementById('cadastro-email').value.trim();
            const senha = document.getElementById('cadastro-senha').value;
            const btnSubmit = novoForm.querySelector('button[type="submit"]');

            // 1. Validação básica local
            if (!nome || !email || !senha) {
                if (erroDiv) {
                    erroDiv.textContent = 'Preencha todos os campos.';
                    erroDiv.style.display = 'block';
                }
                return;
            }

            if (senha.length < 6) {
                if (erroDiv) {
                    erroDiv.textContent = 'A senha deve ter no mínimo 6 caracteres.';
                    erroDiv.style.display = 'block';
                }
                return;
            }

            try {
                if (erroDiv) erroDiv.style.display = 'none';
                if (sucessoDiv) sucessoDiv.style.display = 'none';
                
                if (btnSubmit) {
                    btnSubmit.textContent = 'CRIANDO...';
                    btnSubmit.disabled = true;
                }

                // 2. Envia para o Back-End
                await post('/cadastro', { nome, email, senha });

                // 3. Sucesso!
                if (sucessoDiv) {
                    sucessoDiv.textContent = 'Conta criada com sucesso! Redirecionando...';
                    sucessoDiv.style.display = 'block';
                }
                if (btnSubmit) btnSubmit.textContent = 'SUCESSO!';

                // 4. Redireciona para o login após 2 segundos
                setTimeout(() => {
                    this.mostrarTelaLogin();
                }, 2000);

            } catch (error) {
                if (erroDiv) {
                    erroDiv.textContent = error.message || 'Erro ao criar conta. Tente novamente.';
                    erroDiv.style.display = 'block';
                }
                if (btnSubmit) {
                    btnSubmit.textContent = 'CADASTRAR';
                    btnSubmit.disabled = false;
                }
            }
        });
    }

    // ==========================================
    // APP LOGADO
    // ==========================================

    async iniciarAppLogado() {
        this.telaAtual = 'materias';
        this.esconderTodasAsTelas();

        const tela = document.getElementById('tela-materias');
        if (tela) tela.style.display = 'block';

        this.setupEventListeners();
        
        try {
            await materias.carregar();
            await this.progresso.carregarTudo(materias.lista);
            materias.renderizar();
            console.log('🏁 ===== APLICAÇÃO PRONTA =====');
        } catch (error) {
            console.error('❌ [MAIN] Erro na inicialização:', error);
        }
    }

    setupEventListeners() {
        document.addEventListener('materiaSelecionada', (e) => {
            this.materiaSelecionada = e.detail.materia;
            this.mostrarTelaEstudo();
        });

        window.addEventListener('popstate', (e) => {
            if (this.telaAtual === 'estudo') this.mostrarTelaMaterias();
        });
    }

    mostrarTelaEstudo() {
        if (!this.materiaSelecionada) return;
        this.telaAtual = 'estudo';
        this.esconderTodasAsTelas();
        
        const tela = document.getElementById('tela-estudo');
        if (tela) tela.style.display = 'block';
        
        window.history.pushState({ tela: 'estudo' }, '', '?estudo');
        this.estudo.iniciar(this.materiaSelecionada);
    }

    async mostrarTelaMaterias() {
        if (this.telaAtual === 'materias') return;
        this.telaAtual = 'materias';
        this.materiaSelecionada = null;
        this.esconderTodasAsTelas();
        
        const tela = document.getElementById('tela-materias');
        if (tela) tela.style.display = 'block';
        
        this.estudo.mostrarMensagem('');
        this.flashcardComponent.limpar();
        
        try {
            await this.progresso.carregarTudo(materias.lista);
            materias.renderizar();
        } catch (error) {
            console.error('❌ [MAIN] Erro ao atualizar progresso:', error);
        }
    }

    logout() {
        auth.logout();
        window.location.reload();
    }
}

const app = new App();
window.app = app;
export default app;