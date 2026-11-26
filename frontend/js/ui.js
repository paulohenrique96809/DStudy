// frontend/js/ui.js
// Pequenos helpers de interface compartilhados pelas páginas.

/** Deixa a logo do cabeçalho (.topo) clicável, levando para `destino` */
export function ligarLogo(destino) {
    const topo = document.querySelector('.topo');
    if (!topo) return;
    topo.style.cursor = 'pointer';
    topo.addEventListener('click', () => { window.location.href = destino; });
}

/** Mostra uma mensagem num elemento (usa o atributo [hidden]) */
export function mostrar(el, texto) {
    if (!el) return;
    el.textContent = texto;
    el.hidden = false;
}

export function esconder(el) {
    if (el) el.hidden = true;
}
