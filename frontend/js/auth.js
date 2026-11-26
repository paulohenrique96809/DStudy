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

// ===== GUARDAS DE PÁGINA =====

/**
 * Páginas que exigem login (matérias, flashcards, apoio).
 * Devolve true se pode continuar; senão manda para o login e devolve false.
 */
export function exigirLogin(destino = 'login.html') {
    if (auth.estaLogado()) return true;
    window.location.replace(destino);
    return false;
}

/**
 * Páginas públicas (home, login, cadastro): quem já está logado vai direto às matérias.
 * Devolve true se a página pode seguir; false se está redirecionando.
 */
export function redirecionarSeLogado(destino = 'materias.html') {
    if (!auth.estaLogado()) return true;
    window.location.replace(destino);
    return false;
}
