// frontend/js/pages/apoio.js
import { exigirLogin } from '../auth.js';

function iniciar() {
    const btnCopiar = document.getElementById('btn-copiar');
    const campo = document.getElementById('chave-pix');

    btnCopiar.addEventListener('click', async () => {
        const textoOriginal = btnCopiar.textContent;
        let copiou = false;

        try {
            await navigator.clipboard.writeText(campo.value);
            copiou = true;
        } catch {
            // Fallback para contextos sem a Clipboard API
            campo.select();
            copiou = document.execCommand('copy');
        }

        btnCopiar.textContent = copiou ? 'Copiado!' : 'Erro ao copiar';
        setTimeout(() => { btnCopiar.textContent = textoOriginal; }, 1500);
    });
}

if (exigirLogin()) iniciar();
