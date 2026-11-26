// frontend/js/pages/login.js
import { post } from '../api.js';
import { auth, redirecionarSeLogado } from '../auth.js';
import { ligarLogo, mostrar, esconder } from '../ui.js';

function iniciar() {
    ligarLogo('home.html');

    const form = document.getElementById('form-login');
    const erro = document.getElementById('login-erro');
    const btn = document.getElementById('btn-confirmar');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        const textoOriginal = btn.textContent;

        if (!email || !senha) {
            mostrar(erro, 'Preencha todos os campos.');
            return;
        }

        try {
            esconder(erro);
            btn.textContent = 'Entrando...';
            btn.disabled = true;

            const resposta = await post('/login', { email, senha });
            auth.salvarSessao(resposta.access_token, resposta.usuario);
            window.location.href = 'materias.html';

        } catch (error) {
            mostrar(erro, error.message || 'E-mail ou senha incorretos.');
            btn.textContent = textoOriginal;
            btn.disabled = false;
        }
    });
}

if (redirecionarSeLogado()) iniciar();
