document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const form = document.getElementById('form-tipo-ajuste');
    const tablaCuerpo = document.getElementById('cuerpo-tabla-tipos-ajuste');
    const filtroInput = document.getElementById('filtro-tipos-ajuste');
    const modal = document.getElementById('tipo-ajuste-modal');
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const closeButton = modal.querySelector('.close-button');
    const modalTitle = document.getElementById('modal-title');
    const btnGuardar = document.getElementById('btn-guardar');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const idTipoAjusteInput = document.getElementById('id_tipos_ajuste');

    // --- URL de API ---
    const API_URL = 'api/tipos_ajuste_inventario.php';

    // --- Almacenamiento de datos ---
    let todosLosTipos = [];

    // --- Lógica del Modal ---
    const openModal = () => modal.style.display = 'block';
    const closeModal = () => modal.style.display = 'none';

    btnAbrirModal.addEventListener('click', () => {
        limpiarFormulario();
        modalTitle.textContent = 'Agregar Tipo de Ajuste';
        btnGuardar.textContent = 'Guardar';
        openModal();
    });
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    // --- Carga de Datos ---
    const cargarDatosDelFormulario = async () => {
        try {
            const response = await fetch(`${API_URL}?action=getFormData`);
            const result = await response.json();
            if (result.success) {
                poblarSelect('tipo_cuenta', result.data.tipos_cuenta, 'id_tipo_cuenta', 'nombre');
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error al cargar datos del formulario:', error);
            alert('No se pudieron cargar los datos para el selector.');
        }
    };

    const cargarTiposAjuste = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al obtener los tipos de ajuste');
            const result = await response.json();
            if (result.success) {
                todosLosTipos = result.data;
                mostrarTiposAjuste(todosLosTipos);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error al cargar tipos de ajuste:', error);
            alert('No se pudieron cargar los tipos de ajuste.');
        }
    };

    // --- Funciones de Ayuda ---
    const poblarSelect = (selectId, data, valueField, textField) => {
        const select = document.getElementById(selectId);
        // Guardar la primera opción
        const primeraOpcion = select.options[0];
        select.innerHTML = '';
        select.appendChild(primeraOpcion);

        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField];
            option.textContent = item[textField];
            select.appendChild(option);
        });
    };

    const mostrarTiposAjuste = (tipos) => {
        tablaCuerpo.innerHTML = '';
        if (!tipos || tipos.length === 0) {
            tablaCuerpo.innerHTML = '<tr><td colspan="3">No hay tipos de ajuste registrados.</td></tr>';
            return;
        }
        tipos.forEach(t => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${t.nombre}</td>
                <td>${t.tipo_cuenta_nombre}</td>
                <td class="acciones">
                    <button class="btn-editar" data-id="${t.id_tipos_ajuste}">Editar</button>
                    <button class="btn-eliminar" data-id="${t.id_tipos_ajuste}">Eliminar</button>
                </td>
            `;
            tablaCuerpo.appendChild(fila);
        });
    };

    const limpiarFormulario = () => {
        form.reset();
        idTipoAjusteInput.value = '';
        document.getElementById('tipo_cuenta').value = '';
    };

    // --- Event Listeners ---
    filtroInput.addEventListener('input', () => {
        const termino = filtroInput.value.toLowerCase();
        const tiposFiltrados = todosLosTipos.filter(t => 
            t.nombre.toLowerCase().includes(termino) ||
            t.tipo_cuenta_nombre.toLowerCase().includes(termino)
        );
        mostrarTiposAjuste(tiposFiltrados);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());
        const id = idTipoAjusteInput.value;
        
        if (!datos.tipo_cuenta) {
            alert('Por favor, seleccione un tipo de cuenta.');
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
                cargarTiposAjuste();
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
                    const tipoAjuste = result.data;
                    limpiarFormulario();
                    document.getElementById('nombre').value = tipoAjuste.nombre;
                    document.getElementById('tipo_cuenta').value = tipoAjuste.tipo_cuenta;
                    idTipoAjusteInput.value = tipoAjuste.id_tipos_ajuste;
                    modalTitle.textContent = 'Editar Tipo de Ajuste';
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
            if (confirm('¿Estás seguro de que deseas eliminar este tipo de ajuste?')) {
                try {
                    const response = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
                    const result = await response.json();
                    if (result.success) {
                        alert(result.message);
                        cargarTiposAjuste();
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
    cargarDatosDelFormulario();
    cargarTiposAjuste();
});
