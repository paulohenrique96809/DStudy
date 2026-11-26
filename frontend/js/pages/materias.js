// frontend/js/pages/materias.js
import { auth, exigirLogin } from '../auth.js';
import { materias } from '../materias.js';
import { progresso } from '../progresso.js';
import { iniciarMenu } from '../menu.js';

async function iniciar() {
    iniciarMenu();

    document.getElementById('btn-logout').addEventListener('click', () => {
        if (confirm('Deseja realmente sair?')) {
            auth.logout();
            window.location.href = 'home.html';
        }
    });

    try {
        await materias.carregar();
        materias.renderizar(); // já mostra as matérias, mesmo antes do progresso chegar

        await progresso.carregarTudo(materias.lista);
        materias.renderizar(); // atualiza dicas e GIF de progresso
    } catch (error) {
        console.error('❌ [MATERIAS] Erro na inicialização:', error);
    }
}

if (exigirLogin()) iniciar();
