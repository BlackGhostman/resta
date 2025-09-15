document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const form = document.getElementById('form-articulo');
    const tablaCuerpo = document.getElementById('cuerpo-tabla-articulos');
    const filtroInput = document.getElementById('filtro-articulos');
    const modal = document.getElementById('articulo-modal');
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const closeButton = modal.querySelector('.close-button');
    const modalTitle = document.getElementById('modal-title');
    const btnGuardar = document.getElementById('btn-guardar');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const idArticuloInput = document.getElementById('id_articulos');

    // --- URLs de API ---
    const API_URL = 'api/articulos.php';

    // --- Almacenamiento de datos ---
    let todosLosArticulos = [];
    let datosDelFormulario = {};

    // --- Lógica del Modal ---
    const openModal = () => modal.style.display = 'block';
    const closeModal = () => modal.style.display = 'none';

    btnAbrirModal.addEventListener('click', () => {
        limpiarFormulario();
        modalTitle.textContent = 'Agregar Artículo';
        btnGuardar.textContent = 'Guardar';
        openModal();
    });
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    // --- Lógica de Pestañas (Tabs) ---
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active'));
            tab.classList.add('active');
            const target = document.querySelector('#' + tab.dataset.tab);
            tabContents.forEach(content => content.classList.remove('active'));
            target.classList.add('active');
        });
    });

    // --- Carga de Datos ---
    const cargarDatosDelFormulario = async () => {
        try {
            const response = await fetch(`${API_URL}?action=getFormData`);
            const result = await response.json();
            if (result.success) {
                datosDelFormulario = result.data;
                poblarSelect('id_proveedor', datosDelFormulario.proveedores, 'id_proveedores', 'nombre');
                poblarSelect('id_familia', datosDelFormulario.familias, 'id_familias', 'descripcion');
                poblarSelect('id_ubicacion_inventario', datosDelFormulario.ubicaciones, 'id_ubicacion_inventario', 'descripcion');
                poblarSelect('id_medida', datosDelFormulario.medidas, 'id_medidas', 'descripcion');
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error al cargar datos del formulario:', error);
            alert('No se pudieron cargar los datos para los selectores.');
        }
    };

    const cargarArticulos = async () => {
        try {
            const response = await fetch(API_URL);
            const result = await response.json();
            if (result.success) {
                todosLosArticulos = result.data;
                mostrarArticulos(todosLosArticulos);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error al cargar artículos:', error);
            alert('No se pudieron cargar los artículos.');
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

    document.getElementById('id_familia').addEventListener('change', (e) => {
        const familiaId = e.target.value;
        const subfamiliasFiltradas = (datosDelFormulario.subfamilias || []).filter(sf => sf.id_familia == familiaId);
        poblarSelect('id_subfamilia', subfamiliasFiltradas, 'id_subfamilias', 'descripcion');
    });

    const mostrarArticulos = (articulos) => {
        tablaCuerpo.innerHTML = '';
        if (!articulos || articulos.length === 0) {
            tablaCuerpo.innerHTML = '<tr><td colspan="6">No hay artículos registrados.</td></tr>';
            return;
        }
        articulos.forEach(a => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${a.nombre}</td>
                <td>${a.familia || ''}</td>
                <td>${a.subfamilia || ''}</td>
                <td>${a.precio_venta || ''}</td>
                <td>${a.existencia || ''}</td>
                <td class="acciones">
                    <button class="btn-editar" data-id="${a.id_articulos}">Editar</button>
                    <button class="btn-eliminar" data-id="${a.id_articulos}">Eliminar</button>
                </td>
            `;
            tablaCuerpo.appendChild(fila);
        });
    };

    const limpiarFormulario = () => {
        form.reset();
        idArticuloInput.value = '';
        document.getElementById('id_subfamilia').innerHTML = '<option value="">Seleccione una familia primero</option>';
        tabs[0].click(); // Volver a la primera pestaña
    };

    // --- Event Listeners ---
    filtroInput.addEventListener('input', () => {
        const termino = filtroInput.value.toLowerCase();
        const articulosFiltrados = todosLosArticulos.filter(a => 
            a.nombre.toLowerCase().includes(termino) ||
            (a.familia && a.familia.toLowerCase().includes(termino)) ||
            (a.subfamilia && a.subfamilia.toLowerCase().includes(termino))
        );
        mostrarArticulos(articulosFiltrados);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());
        const id = idArticuloInput.value;
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
                cargarArticulos();
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
                    const articulo = result.data;
                    limpiarFormulario();
                    // Poblar todos los campos del formulario
                    Object.keys(articulo).forEach(key => {
                        const input = form.querySelector(`#${key}`);
                        if (input) {
                            if (input.type === 'checkbox') {
                                input.checked = !!parseInt(articulo[key]);
                            } else {
                                input.value = articulo[key];
                            }
                        }
                    });

                    // Poblar subfamilias para la familia correcta
                    if (articulo.id_familia) {
                        document.getElementById('id_familia').dispatchEvent(new Event('change'));
                        // Esperar un momento para que el DOM se actualice
                        setTimeout(() => {
                            document.getElementById('id_subfamilia').value = articulo.id_subfamilia;
                        }, 100);
                    }

                    modalTitle.textContent = 'Editar Artículo';
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
            if (confirm('¿Estás seguro de que deseas eliminar este artículo?')) {
                try {
                    const response = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
                    const result = await response.json();
                    if (result.success) {
                        alert(result.message);
                        cargarArticulos();
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
    cargarArticulos();
});
