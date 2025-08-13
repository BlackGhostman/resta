document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'api/ubicaciones.php';
    const form = document.getElementById('ubicacion-form');
    const formTitle = document.getElementById('form-title');
    const ubicacionIdInput = document.getElementById('ubicacion-id');
    const nombreInput = document.getElementById('nombre-ubicacion');
    const list = document.getElementById('ubicaciones-list');
    const cancelBtn = document.getElementById('cancel-edit-btn');

    // Cargar ubicaciones al iniciar
    const cargarUbicaciones = async () => {
        list.innerHTML = '<li>Cargando...</li>';
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Error en la respuesta de la API');
            const ubicaciones = await response.json();

            list.innerHTML = '';
            if (ubicaciones.length === 0) {
                list.innerHTML = '<li>No hay ubicaciones registradas.</li>';
                listaUbicaciones.innerHTML = ''; // Limpiar lista
                if (ubicaciones.length === 0) {
                    listaUbicaciones.innerHTML = '<p class="list-item">No hay ubicaciones registradas.</p>';
                    return;
                }
                ubicaciones.forEach(ubicacion => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'list-item'; // Usar la nueva clase
                    itemDiv.innerHTML = `
                        <span>${ubicacion.nombre_ubicacion}</span>
                        <div class="item-actions">
                            <button class="btn btn-sm btn-warning btn-edit" data-id="${ubicacion.id_ubicaciones_mesas}" data-nombre="${ubicacion.nombre_ubicacion}">Editar</button>
                            <button class="btn btn-sm btn-danger btn-delete" data-id="${ubicacion.id_ubicaciones_mesas}">Eliminar</button>
                        </div>
                    `;
                    listaUbicaciones.appendChild(itemDiv);
                });
            } else {
                ubicaciones.forEach(ubicacion => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'list-item'; // Usar la nueva clase
                    itemDiv.innerHTML = `
                        <span>${ubicacion.nombre_ubicacion}</span>
                        <div class="item-actions">
                            <button class="btn btn-sm btn-warning btn-edit" data-id="${ubicacion.id_ubicaciones_mesas}" data-nombre="${ubicacion.nombre_ubicacion}">Editar</button>
                            <button class="btn btn-sm btn-danger btn-delete" data-id="${ubicacion.id_ubicaciones_mesas}">Eliminar</button>
                        </div>
                    `;
                    listaUbicaciones.appendChild(itemDiv);
                });
            }
        } catch (error) {
            list.innerHTML = '<li>Error al cargar las ubicaciones.</li>';
            console.error(error);
        }
    };

    // Resetear el formulario
    const resetForm = () => {
        form.reset();
        ubicacionIdInput.value = '';
        formTitle.textContent = 'Agregar Nueva Ubicación';
        cancelBtn.style.display = 'none';
    };

    // Manejar envío del formulario (Crear/Actualizar)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = ubicacionIdInput.value;
        const nombre = nombreInput.value.trim();
        if (!nombre) return;

        const url = id ? `${apiUrl}?id=${id}` : apiUrl;
        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre })
            });

            const result = await response.json();
            if (result.success) {
                resetForm();
                cargarUbicaciones();
            } else {
                alert(result.message || 'Ocurrió un error.');
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            alert('No se pudo conectar con el servidor.');
        }
    });

    // Manejar clics en la lista (Editar/Eliminar)
    list.addEventListener('click', (e) => {
        const target = e.target;
        const li = target.closest('li');
        if (!li) return;
        const id = li.dataset.id;

        // Botón Editar
        if (target.classList.contains('edit-btn')) {
            const nombre = li.querySelector('span').textContent;
            formTitle.textContent = 'Editando Ubicación';
            ubicacionIdInput.value = id;
            nombreInput.value = nombre;
            cancelBtn.style.display = 'inline-block';
            window.scrollTo(0, 0);
        }

        // Botón Eliminar
        if (target.classList.contains('delete-btn')) {
            if (confirm('¿Estás seguro de que quieres eliminar esta ubicación?')) {
                fetch(`${apiUrl}?id=${id}`, { method: 'DELETE' })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            cargarUbicaciones();
                        } else {
                            alert(result.message || 'Error al eliminar.');
                        }
                    })
                    .catch(error => console.error('Error al eliminar:', error));
            }
        }
    });

    // Botón Cancelar Edición
    cancelBtn.addEventListener('click', resetForm);

    // Carga inicial
    cargarUbicaciones();
});
