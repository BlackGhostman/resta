document.addEventListener('DOMContentLoaded', () => {
    const navButtonsContainer = document.querySelector('.nav-buttons');

    if (!navButtonsContainer) {
        console.log('Contenedor de navegación lateral no encontrado en esta página.');
        return;
    }

    fetch('api/familias.php')
        .then(response => response.json())
        .then(familias => {
            if (familias.error) {
                throw new Error(familias.error);
            }

            navButtonsContainer.innerHTML = ''; // Limpiar botones existentes

            familias.forEach(familia => {
                const viewName = familia.descripcion.toLowerCase().replace(/\s+/g, '-');

                const button = document.createElement('button');
                button.className = 'nav-button';
                button.dataset.view = viewName;
                button.dataset.familiaId = familia.id_familias;

                let iconName = 'utensils'; // Icono por defecto
                if (['bebidas', 'licores', 'refrescos', 'cervezas'].some(term => familia.descripcion.toLowerCase().includes(term))) iconName = 'beer';
                else if (familia.descripcion.toLowerCase().includes('snacks')) iconName = 'coffee';
                else if (familia.descripcion.toLowerCase().includes('comidas')) iconName = 'utensils-crossed';

                button.innerHTML = `<i data-lucide="${iconName}"></i><span>${familia.descripcion}</span>`;
                navButtonsContainer.appendChild(button);
            });

            // Re-inicializar los iconos después de añadirlos al DOM
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            // Disparar un evento personalizado para notificar que el menú está listo
            document.dispatchEvent(new CustomEvent('sidebarReady'));
        })
        .catch(error => {
            console.error('Error al cargar las familias en el sidebar:', error);
            if (navButtonsContainer) {
                navButtonsContainer.innerHTML = '<p>Error al cargar categorías.</p>';
            }
        });
});
