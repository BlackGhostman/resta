document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const form = document.getElementById('form-ajuste');
    const tablaCuerpo = document.getElementById('cuerpo-tabla-ajustes');
    const filtroInput = document.getElementById('filtro-ajustes');
    const modal = document.getElementById('ajuste-modal');
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const closeButton = modal.querySelector('.close-button');
    const btnGuardar = document.getElementById('btn-guardar');
    const btnLimpiar = document.getElementById('btn-limpiar');

    // --- URLs de API ---
    const API_URL = 'api/ajustes_inventario.php';

    // --- Almacenamiento de datos ---
    let todosLosAjustes = [];

    // --- Lógica del Modal ---
    const openModal = () => modal.style.display = 'block';
    const closeModal = () => modal.style.display = 'none';

    btnAbrirModal.addEventListener('click', () => {
        limpiarFormulario();
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
                poblarSelect('id_articulo', result.data.articulos, 'id_articulos', 'nombre');
                poblarSelect('id_tipo_ajuste', result.data.tipos_ajuste, 'id_tipos_ajuste', 'nombre');
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error al cargar datos del formulario:', error);
            alert('No se pudieron cargar los datos para los selectores.');
        }
    };

    const cargarAjustes = async () => {
        try {
            const response = await fetch(API_URL);
            const result = await response.json();
            if (result.success) {
                todosLosAjustes = result.data;
                mostrarAjustes(todosLosAjustes);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error al cargar ajustes:', error);
            alert('No se pudieron cargar los ajustes.');
        }
    };

    // --- Funciones de Ayuda ---
    const poblarSelect = (selectId, data, valueField, textField) => {
        const select = document.getElementById(selectId);
        select.innerHTML = `<option value="">Seleccione una opción</option>`;
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField];
            option.textContent = item[textField];
            select.appendChild(option);
        });
    };

    const mostrarAjustes = (ajustes) => {
        tablaCuerpo.innerHTML = '';
        if (!ajustes || ajustes.length === 0) {
            tablaCuerpo.innerHTML = '<tr><td colspan="6">No hay ajustes registrados.</td></tr>';
            return;
        }
        ajustes.forEach(a => {
            const fila = document.createElement('tr');
            const fecha = new Date(a.fecha).toLocaleString();
            fila.innerHTML = `
                <td>${fecha}</td>
                <td>${a.articulo_nombre}</td>
                <td>${a.tipo_ajuste_nombre}</td>
                <td class="${a.tipo_movimiento === 'Entrada' ? 'text-success' : 'text-danger'}">${a.tipo_movimiento}</td>
                <td>${a.cantidad}</td>
                <td>${a.observaciones || ''}</td>
            `;
            tablaCuerpo.appendChild(fila);
        });
    };

    const limpiarFormulario = () => {
        form.reset();
        document.getElementById('id_articulo').value = '';
        document.getElementById('id_tipo_ajuste').value = '';
    };

    // --- Event Listeners ---
    filtroInput.addEventListener('input', () => {
        const termino = filtroInput.value.toLowerCase();
        const ajustesFiltrados = todosLosAjustes.filter(a => 
            a.articulo_nombre.toLowerCase().includes(termino) ||
            a.tipo_ajuste_nombre.toLowerCase().includes(termino)
        );
        mostrarAjustes(ajustesFiltrados);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());
        
        if (!datos.id_articulo || !datos.id_tipo_ajuste || !datos.cantidad) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            const result = await response.json();
            if (result.success) {
                alert(result.message);
                closeModal();
                cargarAjustes();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error al guardar el ajuste:', error);
            alert(`Error: ${error.message}`);
        }
    });

    btnLimpiar.addEventListener('click', limpiarFormulario);

    // --- Carga Inicial ---
    cargarDatosDelFormulario();
    cargarAjustes();
});
