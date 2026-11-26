// frontend/js/pages/cadastro.js
import { post } from '../api.js';
import { redirecionarSeLogado } from '../auth.js';
import { ligarLogo, mostrar, esconder } from '../ui.js';

function iniciar() {
    ligarLogo('home.html');

    const form = document.getElementById('form-cadastro');
    const erro = document.getElementById('cadastro-erro');
    const sucesso = document.getElementById('cadastro-sucesso');
    const btn = document.getElementById('btn-confirmar');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        const confirmar = document.getElementById('confirmar-senha').value;
        const textoOriginal = btn.textContent;

        esconder(sucesso);

        if (!nome || !email || !senha) return mostrar(erro, 'Preencha todos os campos.');
        if (senha.length < 6) return mostrar(erro, 'A senha deve ter no mínimo 6 caracteres.');
        if (senha !== confirmar) return mostrar(erro, 'As senhas não coincidem.');

        try {
            esconder(erro);
            btn.textContent = 'Criando...';
            btn.disabled = true;

            await post('/cadastro', { nome, email, senha });

            mostrar(sucesso, 'Conta criada com sucesso! Redirecionando...');
            btn.textContent = 'Sucesso!';
            setTimeout(() => { window.location.href = 'login.html'; }, 2000);

        } catch (error) {
            mostrar(erro, error.message || 'Erro ao criar conta. Tente novamente.');
            btn.textContent = textoOriginal;
            btn.disabled = false;
        }
    });
}

if (redirecionarSeLogado()) iniciar();
