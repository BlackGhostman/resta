document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const form = document.getElementById('form-medida');
    const tablaCuerpo = document.getElementById('cuerpo-tabla-medidas');
    const filtroInput = document.getElementById('filtro-medidas');
    const modal = document.getElementById('medida-modal');
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const closeButton = modal.querySelector('.close-button');
    const modalTitle = document.getElementById('modal-title');
    const btnGuardar = document.getElementById('btn-guardar');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const idMedidaInput = document.getElementById('id_medidas');

    // --- URL de API ---
    const API_URL = 'api/medidas.php';

    // --- Almacenamiento de datos ---
    let todasLasMedidas = [];

    // --- Lógica del Modal ---
    const openModal = () => modal.style.display = 'block';
    const closeModal = () => modal.style.display = 'none';

    btnAbrirModal.addEventListener('click', () => {
        limpiarFormulario();
        modalTitle.textContent = 'Agregar Medida';
        btnGuardar.textContent = 'Guardar';
        openModal();
    });
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    // --- Carga de Datos ---
    const cargarMedidas = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al obtener las medidas');
            const result = await response.json();
            if (result.success) {
                todasLasMedidas = result.data;
                mostrarMedidas(todasLasMedidas);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error al cargar medidas:', error);
            alert('No se pudieron cargar las medidas.');
        }
    };

    // --- Funciones de Ayuda ---
    const mostrarMedidas = (medidas) => {
        tablaCuerpo.innerHTML = '';
        if (!medidas || medidas.length === 0) {
            tablaCuerpo.innerHTML = '<tr><td colspan="3">No hay medidas registradas.</td></tr>';
            return;
        }
        medidas.forEach(m => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${m.descripcion}</td>
                <td>${m.abreviatura}</td>
                <td class="acciones">
                    <button class="btn-editar" data-id="${m.id_medidas}">Editar</button>
                    <button class="btn-eliminar" data-id="${m.id_medidas}">Eliminar</button>
                </td>
            `;
            tablaCuerpo.appendChild(fila);
        });
    };

    const limpiarFormulario = () => {
        form.reset();
        idMedidaInput.value = '';
    };

    // --- Event Listeners ---
    filtroInput.addEventListener('input', () => {
        const termino = filtroInput.value.toLowerCase();
        const medidasFiltradas = todasLasMedidas.filter(m => 
            m.descripcion.toLowerCase().includes(termino) ||
            m.abreviatura.toLowerCase().includes(termino)
        );
        mostrarMedidas(medidasFiltradas);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());
        const id = idMedidaInput.value;
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
                cargarMedidas();
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
                    const medida = result.data;
                    limpiarFormulario();
                    document.getElementById('descripcion').value = medida.descripcion;
                    document.getElementById('abreviatura').value = medida.abreviatura;
                    idMedidaInput.value = medida.id_medidas;
                    modalTitle.textContent = 'Editar Medida';
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
            if (confirm('¿Estás seguro de que deseas eliminar esta medida?')) {
                try {
                    const response = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
                    const result = await response.json();
                    if (result.success) {
                        alert(result.message);
                        cargarMedidas();
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
    cargarMedidas();
});
