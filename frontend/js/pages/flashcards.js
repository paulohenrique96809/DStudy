// frontend/js/pages/flashcards.js
// URL: flashcards.html?materia=ID
import { exigirLogin } from '../auth.js';
import { get } from '../api.js';
import { estudo } from '../estudo.js';
import { ligarLogo } from '../ui.js';

async function iniciar() {
    ligarLogo('materias.html');

    const id = parseInt(new URLSearchParams(window.location.search).get('materia'));
    if (!id) {
        window.location.replace('materias.html');
        return;
    }

    try {
        const lista = await get('/materias');
        const materia = lista.find(m => m.id === id);

        if (!materia) {
            window.location.replace('materias.html');
            return;
        }

        await estudo.iniciar(materia);
    } catch (error) {
        console.error('❌ [FLASHCARDS] Erro:', error);
        estudo.mostrarMensagem('Erro ao carregar a matéria.');
    }
}

if (exigirLogin()) iniciar();
