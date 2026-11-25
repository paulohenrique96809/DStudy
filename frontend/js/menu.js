// frontend/js/menu.js

/**
 * Abre/fecha o menu da tela de matérias (alterna a classe "aberto").
 * Chame iniciarMenu() uma vez, depois que o app logado for iniciado.
 */
export function iniciarMenu() {
    const btn = document.getElementById('btn-menu');
    const menu = document.getElementById('menu-lateral');
    const fundo = document.getElementById('menu-fundo');

    if (!btn || !menu || btn.dataset.menuPronto) return;
    btn.dataset.menuPronto = '1';

    const definir = (aberto) => {
        menu.classList.toggle('aberto', aberto);
        if (fundo) fundo.classList.toggle('aberto', aberto);
        menu.setAttribute('aria-hidden', String(!aberto));
        btn.setAttribute('aria-expanded', String(aberto));
    };

    btn.addEventListener('click', () => definir(!menu.classList.contains('aberto')));
    if (fundo) fundo.addEventListener('click', () => definir(false));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') definir(false);
    });

    // Telas "sobre", "apoio" e "perfil" ainda não existem: por enquanto só fecham o menu
    menu.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            definir(false);
        });
    });
}
