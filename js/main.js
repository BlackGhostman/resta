document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');

    if (!mainContent) {
        console.error('Contenedor principal no encontrado.');
        return;
    }

    // Función para cargar artículos en una vista
    const loadArticles = (familiaId, viewName) => {
        const itemList = document.getElementById(`${viewName}-list`);
        if (!itemList) return;

        itemList.innerHTML = '<p>Cargando...</p>';
        fetch(`api/articulos.php?id_familia=${familiaId}`)
            .then(response => response.json())
            .then(articulos => {
                itemList.innerHTML = ''; // Limpiar
                if (articulos.error) {
                    throw new Error(articulos.error);
                }
                if (articulos.length === 0) {
                    itemList.innerHTML = '<p>No hay artículos en esta categoría.</p>';
                } else {
                    articulos.forEach(articulo => {
                        const item = document.createElement('div');
                        item.className = 'list-item';
                        item.textContent = articulo.nombre;
                        itemList.appendChild(item);
                    });
                }
            })
            .catch(error => {
                console.error('Error al cargar artículos:', error);
                itemList.innerHTML = `<p>Error al cargar artículos.</p>`;
            });
    };

    // Función para cambiar de vista
    const switchView = (button) => {
        document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

        button.classList.add('active');
        const viewId = `${button.dataset.view}-view`;
        const targetView = document.getElementById(viewId);

        if (targetView) {
            targetView.classList.add('active');
            const itemList = targetView.querySelector('.item-list');
            if (itemList && itemList.children.length <= 1) {
                loadArticles(button.dataset.familiaId, button.dataset.view);
            }
        }
    };

    // Función para inicializar la página de productos
    const initProductPage = () => {
        const buttons = document.querySelectorAll('.nav-button');
        if (buttons.length === 0) return; // Salir si los botones aún no están listos

        mainContent.innerHTML = ''; // Limpiar contenido principal

        buttons.forEach((button, index) => {
            const viewName = button.dataset.view;
            const familia = { descripcion: button.querySelector('span').textContent, id_familias: button.dataset.familiaId };

            // Crear vista de contenido
            const view = document.createElement('div');
            view.id = `${viewName}-view`;
            view.className = 'view';
            view.innerHTML = `<h2>${familia.descripcion.toUpperCase()}</h2>
                              <input type="text" placeholder="FILTRO" class="filter-input" data-target="${viewName}-list">
                              <div id="${viewName}-list" class="item-list"></div>`;
            mainContent.appendChild(view);

            if (index === 0) {
                button.classList.add('active');
                view.classList.add('active');
                loadArticles(familia.id_familias, viewName);
            }
        });

        // Añadir listeners a los botones
        buttons.forEach(button => {
            button.addEventListener('click', () => switchView(button));
        });
    };

    // Esperar a que el sidebar esté listo antes de inicializar
    document.addEventListener('sidebarReady', initProductPage);

    // Si el sidebar ya está listo (en caso de que el script se cargue después)
    if (document.querySelector('.nav-buttons').children.length > 0) {
        initProductPage();
    }
});

