document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const form = document.getElementById('form-ubicacion');
    const tablaCuerpo = document.getElementById('cuerpo-tabla-ubicaciones');
    const filtroInput = document.getElementById('filtro-ubicaciones');
    const modal = document.getElementById('ubicacion-modal');
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const closeButton = modal.querySelector('.close-button');
    const modalTitle = document.getElementById('modal-title');
    const btnGuardar = document.getElementById('btn-guardar');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const idUbicacionInput = document.getElementById('id_ubicacion_inventario');

    // --- URL de API ---
    const API_URL = 'api/ubicaciones_inventario.php';

    // --- Almacenamiento de datos ---
    let todasLasUbicaciones = [];

    // --- Lógica del Modal ---
    const openModal = () => modal.style.display = 'block';
    const closeModal = () => modal.style.display = 'none';

    btnAbrirModal.addEventListener('click', () => {
        limpiarFormulario();
        modalTitle.textContent = 'Agregar Ubicación';
        btnGuardar.textContent = 'Guardar';
        openModal();
    });
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    // --- Carga de Datos ---
    const cargarUbicaciones = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al obtener las ubicaciones');
            const result = await response.json();
            if (result.success) {
                todasLasUbicaciones = result.data;
                mostrarUbicaciones(todasLasUbicaciones);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error al cargar ubicaciones:', error);
            alert('No se pudieron cargar las ubicaciones.');
        }
    };

    // --- Funciones de Ayuda ---
    const mostrarUbicaciones = (ubicaciones) => {
        tablaCuerpo.innerHTML = '';
        if (!ubicaciones || ubicaciones.length === 0) {
            tablaCuerpo.innerHTML = '<tr><td colspan="2">No hay ubicaciones registradas.</td></tr>';
            return;
        }
        ubicaciones.forEach(u => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${u.descripcion}</td>
                <td class="acciones text-right">
                    <div class="flex items-center justify-end gap-2">
                        <button class="btn-editar p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 hover:text-blue-600 transition-colors" title="Editar" data-id="${u.id_ubicaciones_inventario}">
                            <span class="material-symbols-outlined text-xl pointer-events-none">edit</span>
                        </button>
                        <button class="btn-eliminar p-2 rounded-lg text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors" title="Eliminar" data-id="${u.id_ubicaciones_inventario}">
                            <span class="material-symbols-outlined text-xl pointer-events-none">delete</span>
                        </button>
                    </div>
                </td>
            `;
            tablaCuerpo.appendChild(fila);
        });
    };

    const limpiarFormulario = () => {
        form.reset();
        idUbicacionInput.value = '';
    };

    // --- Event Listeners ---
    filtroInput.addEventListener('input', () => {
        const termino = filtroInput.value.toLowerCase();
        const ubicacionesFiltradas = todasLasUbicaciones.filter(u =>
            u.descripcion.toLowerCase().includes(termino)
        );
        mostrarUbicaciones(ubicacionesFiltradas);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());
        const id = idUbicacionInput.value;
        const url = id ? `${API_URL}?id=${id}` : API_URL;
        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            const result = await response.json();
            if (result.success) {
                alert(result.message);
                closeModal();
                cargarUbicaciones();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            alert(`Error: ${error.message}`);
        }
    });

    tablaCuerpo.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains('btn-editar')) {
            try {
                const response = await fetch(`${API_URL}?id=${id}`);
                const result = await response.json();
                if (result.success && result.data) {
                    const ubicacion = result.data;
                    limpiarFormulario();
                    document.getElementById('descripcion').value = ubicacion.descripcion;
                    idUbicacionInput.value = ubicacion.id_ubicaciones_inventario;
                    modalTitle.textContent = 'Editar Ubicación';
                    btnGuardar.textContent = 'Actualizar';
                    openModal();
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error('Error al editar:', error);
                alert(`Error: ${error.message}`);
            }
        } else if (e.target.classList.contains('btn-eliminar')) {
            if (confirm('¿Estás seguro de que deseas eliminar esta ubicación?')) {
                try {
                    const response = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
                    const result = await response.json();
                    if (result.success) {
                        alert(result.message);
                        cargarUbicaciones();
                    } else {
                        throw new Error(result.message);
                    }
                } catch (error) {
                    console.error('Error al eliminar:', error);
                    alert(`Error: ${error.message}`);
                }
            }
        }
    });

    btnLimpiar.addEventListener('click', limpiarFormulario);

    // --- Carga Inicial ---
    cargarUbicaciones();
});
