// frontend/js/menu.js

/**
 * Menu da página de matérias: abre/fecha alternando a classe "aberto" no #menu-lateral
 * (a camada #menu-fundo aparece sozinha pelo CSS, por ser irmã do nav).
 * Os itens são links normais (materias.html, apoio.html...): navegar é com o navegador.
 */
export function iniciarMenu() {
    const btn = document.getElementById('btn-menu');
    const menu = document.getElementById('menu-lateral');
    const fundo = document.getElementById('menu-fundo');

    if (!btn || !menu) return;

    const definir = (aberto) => {
        menu.classList.toggle('aberto', aberto);
        menu.setAttribute('aria-hidden', String(!aberto));
        btn.setAttribute('aria-expanded', String(aberto));
    };

    btn.addEventListener('click', () => definir(!menu.classList.contains('aberto')));
    if (fundo) fundo.addEventListener('click', () => definir(false));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') definir(false);
    });

    // Itens sem destino ainda (ex.: CONFIG.) só fecham o menu
    menu.querySelectorAll('.menu-item[href="#"]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            definir(false);
        });
    });
}
