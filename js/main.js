document.addEventListener('DOMContentLoaded', () => {
    const navButtonsContainer = document.querySelector('.nav-buttons');
    const mainContent = document.getElementById('main-content');

    if (!navButtonsContainer || !mainContent) {
        console.error('No se encontraron los contenedores necesarios.');
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
            // Cargar artículos solo si la lista está vacía (o solo tiene el mensaje de carga/error)
            if (itemList && itemList.children.length <= 1) {
                loadArticles(button.dataset.familiaId, button.dataset.view);
            }
        }
    };

    // Cargar familias y construir la UI
    fetch('api/familias.php')
        .then(response => response.json())
        .then(familias => {
            if (familias.error) throw new Error(familias.error);

            navButtonsContainer.innerHTML = '';
            mainContent.innerHTML = '';

            familias.forEach((familia, index) => {
                const viewName = familia.descripcion.toLowerCase().replace(/\s+/g, '-');

                // Crear botón de navegación
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

                // Crear vista de contenido
                const view = document.createElement('div');
                view.id = `${viewName}-view`;
                view.className = 'view';
                view.innerHTML = `<h2>${familia.descripcion.toUpperCase()}</h2>
                                  <input type="text" placeholder="FILTRO" class="filter-input" data-target="${viewName}-list">
                                  <div id="${viewName}-list" class="item-list"></div>`;
                mainContent.appendChild(view);

                // Activar el primer elemento y cargar sus artículos
                if (index === 0) {
                    button.classList.add('active');
                    view.classList.add('active');
                    loadArticles(familia.id_familias, viewName);
                }
            });

            // Añadir listeners a los botones
            document.querySelectorAll('.nav-button').forEach(button => {
                button.addEventListener('click', () => switchView(button));
            });

            lucide.createIcons();
        })
        .catch(error => {
            console.error('Error al inicializar la aplicación:', error);
            mainContent.innerHTML = '<p>Error al cargar la aplicación. Verifique la consola.</p>';
        });
});
