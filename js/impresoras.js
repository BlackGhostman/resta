document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const form = document.getElementById('form-impresora');
    const tablaCuerpo = document.getElementById('cuerpo-tabla-impresoras');
    const filtroInput = document.getElementById('filtro-impresoras');
    const modal = document.getElementById('impresora-modal');
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const closeButton = modal.querySelector('.close-button');
    const modalTitle = document.getElementById('modal-title');
    const btnGuardar = document.getElementById('btn-guardar');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const idImpresoraInput = document.getElementById('id_impresora');

    // --- URL de API ---
    const API_URL = 'api/impresoras.php';

    // --- Almacenamiento de datos ---
    let todasLasImpresoras = [];

    // --- Lógica del Modal ---
    const openModal = () => modal.style.display = 'block';
    const closeModal = () => modal.style.display = 'none';

    btnAbrirModal.addEventListener('click', () => {
        limpiarFormulario();
        modalTitle.textContent = 'Agregar Impresora';
        btnGuardar.textContent = 'Guardar';
        openModal();
    });
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    // --- Carga de Datos ---
    const cargarImpresoras = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al obtener las impresoras');
            const result = await response.json();
            if (result.success) {
                todasLasImpresoras = result.data;
                mostrarImpresoras(todasLasImpresoras);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error al cargar impresoras:', error);
            alert('No se pudieron cargar las impresoras.');
        }
    };

    // --- Funciones de Ayuda ---
    const mostrarImpresoras = (impresoras) => {
        tablaCuerpo.innerHTML = '';
        if (!impresoras || impresoras.length === 0) {
            tablaCuerpo.innerHTML = '<tr><td colspan="5" class="p-6 text-center text-slate-500">No hay impresoras registradas.</td></tr>';
            return;
        }
        impresoras.forEach(item => {
            const fila = document.createElement('tr');
            fila.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0';

            // Estado Badge
            const statusClass = item.estado === 'activa'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';

            const statusLabel = item.estado.charAt(0).toUpperCase() + item.estado.slice(1);

            fila.innerHTML = `
                <td class="px-6 py-4 text-slate-700 dark:text-slate-300 font-bold">${item.nombre}</td>
                <td class="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">${item.ubicacion || '-'}</td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 uppercase">
                        ${item.tipo}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${statusClass}">
                        ${statusLabel}
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                        <button class="btn-editar text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded-lg transition-colors" data-id="${item.id_impresora}" title="Editar">
                            <span class="material-symbols-outlined text-[20px] pointer-events-none">edit</span>
                        </button>
                        <button class="btn-eliminar text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors" data-id="${item.id_impresora}" title="Eliminar">
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
        idImpresoraInput.value = '';
    };

    // --- Event Listeners ---
    filtroInput.addEventListener('input', () => {
        const termino = filtroInput.value.toLowerCase();
        const filtrados = todasLasImpresoras.filter(item =>
            item.nombre.toLowerCase().includes(termino) ||
            (item.ubicacion && item.ubicacion.toLowerCase().includes(termino))
        );
        mostrarImpresoras(filtrados);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());
        const id = idImpresoraInput.value;
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
                cargarImpresoras();
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
                    const item = result.data;
                    limpiarFormulario();
                    document.getElementById('nombre').value = item.nombre;
                    document.getElementById('ubicacion').value = item.ubicacion;
                    document.getElementById('tipo').value = item.tipo;
                    document.getElementById('estado').value = item.estado;
                    idImpresoraInput.value = item.id_impresora;

                    modalTitle.textContent = 'Editar Impresora';
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
            if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
                try {
                    const response = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
                    const result = await response.json();
                    if (result.success) {
                        alert(result.message);
                        cargarImpresoras();
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
    cargarImpresoras();
});
