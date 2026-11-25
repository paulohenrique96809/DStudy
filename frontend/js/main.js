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

        this.telaAtual = 'home';
        this.materiaSelecionada = null;

        this.init();
    }

    async init() {
        console.log('🚀 ===== APLICAÇÃO INICIADA =====');
        console.log(`🔧 API: ${isModoSimulacao() ? 'SIMULAÇÃO' : 'REAL'}`);

        // ⭐ Configura a logo global (se existir)
    const logoGlobal = document.getElementById('btn-voltar-home-global');
    if (logoGlobal) {
        logoGlobal.onclick = () => {
            if (auth.estaLogado()) {
                this.mostrarTelaMaterias();
            } else {
                this.mostrarTelaHome();
            }
        };
    }

        if (!auth.estaLogado()) {
            this.mostrarTelaHome();
            return;
        }

        await this.iniciarAppLogado();

        
    }

    // ==========================================
    // CONTROLE DE TELAS
    // ==========================================

    esconderTodasAsTelas() {
        const telas = ['tela-home', 'tela-login', 'tela-cadastro', 'tela-materias', 'tela-estudo'];
        telas.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
    }

    /**
     * ⭐ NOVO: Tela inicial (home com axolote e botões)
     */
    mostrarTelaHome() {
        this.telaAtual = 'home';
        this.esconderTodasAsTelas();

        const tela = document.getElementById('tela-home');
        if (tela) tela.style.display = 'block';

        

        const btnComecar = document.getElementById('btn-comece-agora');
        const btnJaTenho = document.getElementById('btn-ja-tenho-conta');

        if (btnComecar) {
            btnComecar.onclick = () => this.mostrarTelaCadastro();
        }
        if (btnJaTenho) {
            btnJaTenho.onclick = () => this.mostrarTelaLogin();
        }
    }

    mostrarTelaLogin() {
        this.telaAtual = 'login';
        this.esconderTodasAsTelas();

        const tela = document.getElementById('tela-login');
        if (tela) tela.style.display = 'block';

        const formLogin = document.getElementById('form-login');
        if (formLogin) formLogin.reset();

        const logoLogin = document.getElementById('btn-voltar-home-login');
    if (logoLogin) {
        logoLogin.onclick = () => {
            if (auth.estaLogado()) {
                this.mostrarTelaMaterias();
            } else {
                this.mostrarTelaHome();
            }
        }
    }

        this.configurarFormularioLogin();
        this.configurarNavegacaoAuth();
    }

    mostrarTelaCadastro() {
        this.telaAtual = 'cadastro';
        this.esconderTodasAsTelas();

        const tela = document.getElementById('tela-cadastro');
        if (tela) tela.style.display = 'block';

        const formCadastro = document.getElementById('form-cadastro');
        if (formCadastro) formCadastro.reset();

        const erro = document.getElementById('cadastro-erro');
        const sucesso = document.getElementById('cadastro-sucesso');
        if (erro) erro.style.display = 'none';
        if (sucesso) sucesso.style.display = 'none';

const logoCadastro = document.getElementById('btn-voltar-home-cadastro');
    if (logoCadastro) {
        logoCadastro.onclick = () => this.mostrarTelaHome();
    }

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
            const confirmar = document.getElementById('cadastro-confirmar-senha')?.value;
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

            // ⭐ NOVO: valida confirmação de senha (se o campo existir)
            if (confirmar !== undefined && senha !== confirmar) {
                if (erroDiv) {
                    erroDiv.textContent = 'As senhas não coincidem.';
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

                await post('/cadastro', { nome, email, senha });

                if (sucessoDiv) {
                    sucessoDiv.textContent = 'Conta criada com sucesso! Redirecionando...';
                    sucessoDiv.style.display = 'block';
                }
                if (btnSubmit) btnSubmit.textContent = 'SUCESSO!';

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

        // ⭐ NOVO: configura o botão de logout
        const btnLogout = document.getElementById('btn-logout');
        if (btnLogout) {
            btnLogout.onclick = () => this.logout();
        }

        this.setupEventListeners();

        try {
            console.log('📚 Carregando matérias...');
            await materias.carregar();

            console.log('📊 Carregando progresso...');
            await this.progresso.carregarTudo(materias.lista);

            console.log('🎨 Renderizando interface...');
            materias.renderizar();

            console.log('🏁 ===== APLICAÇÃO PRONTA =====');
        } catch (error) {
            console.error('❌ [MAIN] Erro na inicialização:', error);
        }
    }

    setupEventListeners() {
        document.addEventListener('materiaSelecionada', (e) => {
            console.log('📖 [MAIN] Evento materiaSelecionada recebido!');
            this.materiaSelecionada = e.detail.materia;
            this.mostrarTelaEstudo();
        });

        window.addEventListener('popstate', (e) => {
            if (this.telaAtual === 'estudo') this.mostrarTelaMaterias();
        });
        // ⭐ Evento do botão de Logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if (confirm('Deseja realmente sair?')) {
                this.logout();
            }
        });
    }
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

// Cria a instância global
const app = new App();
window.app = app;
export default app;