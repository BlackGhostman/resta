document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const form = document.getElementById('form-tipo-cuenta');
    const tablaCuerpo = document.getElementById('cuerpo-tabla-tipos-cuenta');
    const filtroInput = document.getElementById('filtro-tipos-cuenta');
    const modal = document.getElementById('tipo-cuenta-modal');
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const closeButton = modal.querySelector('.close-button');
    const modalTitle = document.getElementById('modal-title');
    const btnGuardar = document.getElementById('btn-guardar');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const idTipoCuentaInput = document.getElementById('id_tipo_cuenta');

    // --- URL de API ---
    const API_URL = 'api/tipos_cuenta.php';

    // --- Almacenamiento de datos ---
    let todosLosTipos = [];

    // --- Lógica del Modal ---
    const openModal = () => modal.style.display = 'block';
    const closeModal = () => modal.style.display = 'none';

    btnAbrirModal.addEventListener('click', () => {
        limpiarFormulario();
        modalTitle.textContent = 'Agregar Tipo de Cuenta';
        btnGuardar.textContent = 'Guardar';
        openModal();
    });
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    // --- Carga de Datos ---
    const cargarTiposCuenta = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al obtener los tipos de cuenta');
            const result = await response.json();
            if (result.success) {
                todosLosTipos = result.data;
                mostrarTiposCuenta(todosLosTipos);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error al cargar tipos de cuenta:', error);
            alert('No se pudieron cargar los tipos de cuenta.');
        }
    };

    // --- Funciones de Ayuda ---
    const mostrarTiposCuenta = (tipos) => {
        tablaCuerpo.innerHTML = '';
        if (!tipos || tipos.length === 0) {
            tablaCuerpo.innerHTML = '<tr><td colspan="2">No hay tipos de cuenta registrados.</td></tr>';
            return;
        }
        tipos.forEach(t => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${t.nombre}</td>
                <td class="acciones">
                    <button class="btn-editar" data-id="${t.id_tipo_cuenta}">Editar</button>
                    <button class="btn-eliminar" data-id="${t.id_tipo_cuenta}">Eliminar</button>
                </td>
            `;
            tablaCuerpo.appendChild(fila);
        });
    };

    const limpiarFormulario = () => {
        form.reset();
        idTipoCuentaInput.value = '';
    };

    // --- Event Listeners ---
    filtroInput.addEventListener('input', () => {
        const termino = filtroInput.value.toLowerCase();
        const tiposFiltrados = todosLosTipos.filter(t => 
            t.nombre.toLowerCase().includes(termino)
        );
        mostrarTiposCuenta(tiposFiltrados);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());
        const id = idTipoCuentaInput.value;
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
                cargarTiposCuenta();
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
                    const tipoCuenta = result.data;
                    limpiarFormulario();
                    document.getElementById('nombre').value = tipoCuenta.nombre;
                    idTipoCuentaInput.value = tipoCuenta.id_tipo_cuenta;
                    modalTitle.textContent = 'Editar Tipo de Cuenta';
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
            if (confirm('¿Estás seguro de que deseas eliminar este tipo de cuenta?')) {
                try {
                    const response = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
                    const result = await response.json();
                    if (result.success) {
                        alert(result.message);
                        cargarTiposCuenta();
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
    cargarTiposCuenta();
});
