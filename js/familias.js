document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-familia');
    const tablaCuerpo = document.getElementById('cuerpo-tabla-familias');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const idFamiliaInput = document.getElementById('id_familias');
    const API_URL = 'api/familias.php';

    // --- Modal Elements ---
    const modal = document.getElementById('familia-modal');
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const closeButton = document.querySelector('.close-button');
    const modalTitle = document.getElementById('modal-title');
    const btnGuardar = document.getElementById('btn-guardar');

    // --- Modal Logic ---
    const openModal = () => modal.style.display = 'block';
    const closeModal = () => modal.style.display = 'none';

    btnAbrirModal.addEventListener('click', () => {
        limpiarFormulario();
        modalTitle.textContent = 'Agregar Familia';
        btnGuardar.textContent = 'Guardar';
        openModal();
    });

    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // --- Core Functions ---
    const cargarFamilias = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al obtener las familias');
            const result = await response.json();

            if (result.success) {
                mostrarFamilias(result.data);
            } else {
                console.error('Error del API:', result.message);
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('No se pudieron cargar las familias.');
        }
    };

    const mostrarFamilias = (familias) => {
        tablaCuerpo.innerHTML = '';
        if (familias.length === 0) {
            tablaCuerpo.innerHTML = '<tr><td colspan="2">No hay familias registradas.</td></tr>';
            return;
        }

        familias.forEach(f => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${f.descripcion}</td>
                <td class="acciones text-right">
                    <div class="flex items-center justify-end gap-2">
                        <button class="btn-editar p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 hover:text-blue-600 transition-colors" title="Editar" data-id="${f.id_familias}">
                            <span class="material-symbols-outlined text-xl pointer-events-none">edit</span>
                        </button>
                        <button class="btn-eliminar p-2 rounded-lg text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors" title="Eliminar" data-id="${f.id_familias}">
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
        idFamiliaInput.value = '';
    };

    // --- Event Listeners ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());
        const id = idFamiliaInput.value;

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
                cargarFamilias();
            } else {
                throw new Error(result.message || 'Error en la operación');
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
                if (!response.ok) throw new Error('No se pudo obtener la familia.');
                const result = await response.json();

                if (result.success && result.data) {
                    const familia = result.data;
                    limpiarFormulario();
                    document.getElementById('descripcion').value = familia.descripcion;
                    idFamiliaInput.value = familia.id_familias;
                    modalTitle.textContent = 'Editar Familia';
                    btnGuardar.textContent = 'Actualizar';
                    openModal();
                } else {
                    throw new Error(result.message || 'Familia no encontrada.');
                }
            } catch (error) {
                console.error('Error al editar:', error);
                alert(`Error: ${error.message}`);
            }
        } else if (e.target.classList.contains('btn-eliminar')) {
            if (confirm('¿Estás seguro de que deseas eliminar esta familia?')) {
                try {
                    const response = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
                    const result = await response.json();

                    if (result.success) {
                        alert(result.message);
                        cargarFamilias();
                    } else {
                        throw new Error(result.message || 'Error al eliminar.');
                    }
                } catch (error) {
                    console.error('Error al eliminar:', error);
                    alert(`Error: ${error.message}`);
                }
            }
        }
    });

    btnLimpiar.addEventListener('click', limpiarFormulario);

    // Carga inicial
    cargarFamilias();
});
