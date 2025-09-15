document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-subfamilia');
    const tablaCuerpo = document.getElementById('cuerpo-tabla-subfamilias');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const idSubfamiliaInput = document.getElementById('id_subfamilias');
    const familiaSelect = document.getElementById('id_familia');
    const API_URL = 'api/subfamilias.php';
    const FAMILIAS_API_URL = 'api/familias.php'; // Usamos el API de familias existente

    // --- Modal Elements ---
    const modal = document.getElementById('subfamilia-modal');
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const closeButton = modal.querySelector('.close-button');
    const modalTitle = document.getElementById('modal-title');
    const btnGuardar = document.getElementById('btn-guardar');

    // --- Modal Logic ---
    const openModal = () => modal.style.display = 'block';
    const closeModal = () => modal.style.display = 'none';

    btnAbrirModal.addEventListener('click', () => {
        limpiarFormulario();
        modalTitle.textContent = 'Agregar Subfamilia';
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
    const cargarFamiliasDropdown = async () => {
        try {
            const response = await fetch(FAMILIAS_API_URL);
            if (!response.ok) throw new Error('Error al obtener las familias');
            const result = await response.json();
            
            if (result.success) {
                familiaSelect.innerHTML = '<option value="">Seleccione una familia</option>';
                result.data.forEach(familia => {
                    const option = document.createElement('option');
                    option.value = familia.id_familias;
                    option.textContent = familia.descripcion;
                    familiaSelect.appendChild(option);
                });
            } else {
                console.error('Error del API de familias:', result.message);
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('No se pudieron cargar las familias para el selector.');
        }
    };

    const cargarSubfamilias = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al obtener las subfamilias');
            const result = await response.json();
            
            if (result.success) {
                mostrarSubfamilias(result.data);
            } else {
                console.error('Error del API:', result.message);
                tablaCuerpo.innerHTML = `<tr><td colspan="3">Error: ${result.message}</td></tr>`;
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('No se pudieron cargar las subfamilias.');
        }
    };

    const mostrarSubfamilias = (subfamilias) => {
        tablaCuerpo.innerHTML = '';
        if (subfamilias.length === 0) {
            tablaCuerpo.innerHTML = '<tr><td colspan="3">No hay subfamilias registradas.</td></tr>';
            return;
        }

        subfamilias.forEach(sf => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${sf.descripcion}</td>
                <td>${sf.familia_descripcion}</td>
                <td class="acciones">
                    <button class="btn-editar" data-id="${sf.id_subfamilias}">Editar</button>
                    <button class="btn-eliminar" data-id="${sf.id_subfamilias}">Eliminar</button>
                </td>
            `;
            tablaCuerpo.appendChild(fila);
        });
    };

    const limpiarFormulario = () => {
        form.reset();
        idSubfamiliaInput.value = '';
    };

    // --- Event Listeners ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());
        const id = idSubfamiliaInput.value;

        if (!datos.id_familia) {
            alert('Por favor, seleccione una familia.');
            return;
        }

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
                cargarSubfamilias();
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
                if (!response.ok) throw new Error('No se pudo obtener la subfamilia.');
                const result = await response.json();

                if (result.success && result.data) {
                    const subfamilia = result.data;
                    limpiarFormulario();
                    document.getElementById('descripcion').value = subfamilia.descripcion;
                    familiaSelect.value = subfamilia.id_familia;
                    idSubfamiliaInput.value = subfamilia.id_subfamilias;
                    modalTitle.textContent = 'Editar Subfamilia';
                    btnGuardar.textContent = 'Actualizar';
                    openModal();
                } else {
                    throw new Error(result.message || 'Subfamilia no encontrada.');
                }
            } catch (error) {
                console.error('Error al editar:', error);
                alert(`Error: ${error.message}`);
            }
        } else if (e.target.classList.contains('btn-eliminar')) {
            if (confirm('¿Estás seguro de que deseas eliminar esta subfamilia?')) {
                try {
                    const response = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
                    const result = await response.json();

                    if (result.success) {
                        alert(result.message);
                        cargarSubfamilias();
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
    cargarFamiliasDropdown();
    cargarSubfamilias();
});
