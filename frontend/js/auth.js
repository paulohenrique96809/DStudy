// frontend/js/auth.js

export class Auth {
    constructor() {
        // Onde o token fica salvo
        this.chaveToken = 'dstudy_token';
        this.chaveUsuario = 'dstudy_usuario';
    }

    /**
     * Salva o token e os dados do usuário após o login
     */
    salvarSessao(token, usuario) {
        localStorage.setItem(this.chaveToken, token);
        localStorage.setItem(this.chaveUsuario, JSON.stringify(usuario));
        console.log('🔐 [AUTH] Sessão salva com sucesso.');
    }

    /**
     * Retorna o token para o api.js usar
     */
    getToken() {
        return localStorage.getItem(this.chaveToken);
    }

    /**
     * Retorna os dados do usuário (id, nome, email)
     */
    getUsuario() {
        const dados = localStorage.getItem(this.chaveUsuario);
        return dados ? JSON.parse(dados) : null;
    }

    /**
     * Verifica se o usuário está logado
     */
    estaLogado() {
        return !!this.getToken();
    }

    /**
     * Limpa a sessão (logout)
     */
    logout() {
        localStorage.removeItem(this.chaveToken);
        localStorage.removeItem(this.chaveUsuario);
        console.log('🚪 [AUTH] Logout realizado.');
    }
}

export const auth = new Auth();