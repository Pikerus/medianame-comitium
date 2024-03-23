//abre y cierra menú nav
document.addEventListener('DOMContentLoaded', function () {
    const btnHamburguer = document.querySelector('.js-open-nav');
    const navMenu = document.getElementById('navMenu');
    const body = document.body;

    btnHamburguer.addEventListener('click', function () {
        const isHidden = navMenu.getAttribute('aria-hidden') === 'true';

        btnHamburguer.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        navMenu.setAttribute('aria-hidden', !isHidden);

        if (isHidden) {
            body.classList.add('is-no-scroll');
        } else {
            body.classList.remove('is-no-scroll');
        }
    });

    function adjustAriaHiddenForWindowSize() {
        // Verificar si la ventana es igual o mayor a 1024px
        if (window.innerWidth >= 1024) {
            // Elimina el atributo 'aria-hidden' si la ventana es lo suficientemente grande
            navMenu.removeAttribute('aria-hidden');
        } else {
            // Asegura que 'aria-hidden' esté presente y sea 'true' si la ventana es más pequeña
            if (navMenu.getAttribute('aria-hidden') === null) {
                navMenu.setAttribute('aria-hidden', 'true');
            }
        }
    }

    // Ajustar 'aria-hidden' al cargar la página y al cambiar el tamaño de la ventana
    adjustAriaHiddenForWindowSize();
    window.addEventListener('resize', adjustAriaHiddenForWindowSize);

});
