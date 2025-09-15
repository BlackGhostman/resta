document.addEventListener('DOMContentLoaded', () => {
    /**
     * Renderiza los íconos de Lucide en la página.
     * Si la librería no está lista, reintenta tras un breve lapso.
     */
    const renderIcons = () => {
        if (window.lucide) {
            window.lucide.createIcons();
        } else {
            setTimeout(renderIcons, 100);
        }
    };

    /**
     * Establece la clase 'active' en el enlace de navegación que corresponde
     * a la página actual, para resaltarlo visualmente.
     */
    const setActiveNavigation = () => {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-buttons a.nav-button');
        
        // Si es la página principal (index.html o raíz), tratarla como articulos.html
        const targetPage = (currentPage === 'index.html' || currentPage === '') ? 'articulos.html' : currentPage;

        navLinks.forEach(link => {
            if (link.getAttribute('href') === targetPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // --- Inicialización ---
    renderIcons();
    setActiveNavigation();
});

