document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-proveedor');
    const tablaCuerpo = document.getElementById('cuerpo-tabla-proveedores');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const idProveedorInput = document.getElementById('id_proveedor');
    const API_URL = 'api/proveedores.php';

    // --- Modal Elements ---
    const modal = document.getElementById('proveedor-modal');
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const closeButton = document.querySelector('.close-button');
    const modalTitle = document.getElementById('modal-title');
    const btnGuardar = document.getElementById('btn-guardar');

    // --- Modal Logic ---
    const openModal = () => modal.style.display = 'block';
    const closeModal = () => modal.style.display = 'none';

    btnAbrirModal.addEventListener('click', () => {
        limpiarFormulario();
        modalTitle.textContent = 'Agregar Proveedor';
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
    const cargarProveedores = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al obtener los proveedores');
            const result = await response.json();
            
            if (result.success) {
                mostrarProveedores(result.data);
            } else {
                console.error('Error del API:', result.message);
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('No se pudieron cargar los proveedores.');
        }
    };

    const mostrarProveedores = (proveedores) => {
        tablaCuerpo.innerHTML = '';
        if (proveedores.length === 0) {
            tablaCuerpo.innerHTML = '<tr><td colspan="5">No hay proveedores registrados.</td></tr>';
            return;
        }

        proveedores.forEach(p => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${p.nombre}</td>
                <td>${p.contacto || ''}</td>
                <td>${p.telefono || ''}</td>
                <td>${p.email || ''}</td>
                <td class="acciones">
                    <button class="btn-editar" data-id="${p.id_proveedores}">Editar</button>
                    <button class="btn-eliminar" data-id="${p.id_proveedores}">Eliminar</button>
                </td>
            `;
            tablaCuerpo.appendChild(fila);
        });
    };

    const limpiarFormulario = () => {
        form.reset();
        idProveedorInput.value = '';
    };

    // --- Event Listeners ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());
        const id = idProveedorInput.value;

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
                cargarProveedores();
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
                if (!response.ok) throw new Error('No se pudo obtener el proveedor.');
                const result = await response.json();

                if (result.success && result.data) {
                    const proveedor = result.data;
                    limpiarFormulario(); // Limpia por si acaso
                    Object.keys(proveedor).forEach(key => {
                        const input = form.querySelector(`#${key}`);
                        if (input) {
                            if (input.type === 'date' && proveedor[key]) {
                                input.value = proveedor[key].split(' ')[0];
                            } else {
                                input.value = proveedor[key];
                            }
                        }
                    });
                    idProveedorInput.value = proveedor.id_proveedores;
                    modalTitle.textContent = 'Editar Proveedor';
                    btnGuardar.textContent = 'Actualizar';
                    openModal();
                } else {
                    throw new Error(result.message || 'Proveedor no encontrado.');
                }
            } catch (error) {
                console.error('Error al editar:', error);
                alert(`Error: ${error.message}`);
            }
        } else if (e.target.classList.contains('btn-eliminar')) {
            if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
                try {
                    const response = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
                    const result = await response.json();

                    if (result.success) {
                        alert(result.message);
                        cargarProveedores();
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
    cargarProveedores();
});
