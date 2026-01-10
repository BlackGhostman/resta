document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const form = document.getElementById('form-tipo-pago');
    const tablaCuerpo = document.getElementById('cuerpo-tabla-tipos-pago');
    const filtroInput = document.getElementById('filtro-tipos-pago');
    const modal = document.getElementById('tipo-pago-modal');
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const closeButton = modal.querySelector('.close-button');
    const modalTitle = document.getElementById('modal-title');
    const btnGuardar = document.getElementById('btn-guardar');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const idTipoPagoInput = document.getElementById('id_tipos_pago');

    // --- URL de API ---
    const API_URL = 'api/tipos_pago.php';

    // --- Almacenamiento de datos ---
    let todosLosTipos = [];

    // --- Lógica del Modal ---
    const openModal = () => modal.style.display = 'block';
    const closeModal = () => modal.style.display = 'none';

    btnAbrirModal.addEventListener('click', () => {
        limpiarFormulario();
        modalTitle.textContent = 'Agregar Tipo de Pago';
        btnGuardar.textContent = 'Guardar';
        openModal();
    });
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    // --- Carga de Datos ---
    const cargarTiposPago = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al obtener los tipos de pago');
            const result = await response.json();
            if (result.success) {
                todosLosTipos = result.data;
                mostrarTiposPago(todosLosTipos);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error al cargar tipos de pago:', error);
            alert('No se pudieron cargar los tipos de pago.');
        }
    };

    // --- Funciones de Ayuda ---
    const mostrarTiposPago = (tipos) => {
        tablaCuerpo.innerHTML = '';
        if (!tipos || tipos.length === 0) {
            tablaCuerpo.innerHTML = '<tr><td colspan="2" class="p-6 text-center text-slate-500">No hay tipos de pago registrados.</td></tr>';
            return;
        }
        tipos.forEach(t => {
            const fila = document.createElement('tr');
            fila.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0';
            fila.innerHTML = `
                <td class="px-6 py-4 text-slate-700 dark:text-slate-300 font-bold">${t.descripcion}</td>
                <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                        <button class="btn-editar text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded-lg transition-colors" data-id="${t.id_tipos_pago}" title="Editar">
                            <span class="material-symbols-outlined text-[20px] pointer-events-none">edit</span>
                        </button>
                        <button class="btn-eliminar text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors" data-id="${t.id_tipos_pago}" title="Eliminar">
                            <span class="material-symbols-outlined text-[20px] pointer-events-none">delete</span>
                        </button>
                    </div>
                </td>
            `;
            tablaCuerpo.appendChild(fila);
        });
    };

    const limpiarFormulario = () => {
        form.reset();
        idTipoPagoInput.value = '';
    };

    // --- Event Listeners ---
    filtroInput.addEventListener('input', () => {
        const termino = filtroInput.value.toLowerCase();
        const tiposFiltrados = todosLosTipos.filter(t =>
            t.descripcion.toLowerCase().includes(termino)
        );
        mostrarTiposPago(tiposFiltrados);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());
        const id = idTipoPagoInput.value;
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
                cargarTiposPago();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            alert(`Error: ${error.message}`);
        }
    });

    tablaCuerpo.addEventListener('click', async (e) => {
        // Handle clicks on buttons or their children
        let target = e.target;
        if (target.tagName === 'SPAN') target = target.parentElement; // click on icon

        const id = target.dataset.id;
        if (!id) return;

        if (target.classList.contains('btn-editar')) {
            try {
                const response = await fetch(`${API_URL}?id=${id}`);
                const result = await response.json();
                if (result.success && result.data) {
                    const tipoPago = result.data;
                    limpiarFormulario();
                    document.getElementById('descripcion').value = tipoPago.descripcion;
                    idTipoPagoInput.value = tipoPago.id_tipos_pago;
                    modalTitle.textContent = 'Editar Tipo de Pago';
                    btnGuardar.textContent = 'Actualizar';
                    openModal();
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error('Error al editar:', error);
                alert(`Error: ${error.message}`);
            }
        } else if (target.classList.contains('btn-eliminar')) {
            if (confirm('¿Estás seguro de que deseas eliminar este tipo de pago?')) {
                try {
                    const response = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
                    const result = await response.json();
                    if (result.success) {
                        alert(result.message);
                        cargarTiposPago();
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
    cargarTiposPago();
});
