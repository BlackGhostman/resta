document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-proveedor');
    const tablaCuerpo = document.getElementById('cuerpo-tabla-proveedores');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const idProveedorInput = document.getElementById('id_proveedor');

    const API_URL = 'api/proveedores.php';

    // Cargar todos los proveedores al iniciar
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

    // Mostrar proveedores en la tabla
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

    // Limpiar el formulario
    const limpiarFormulario = () => {
        form.reset();
        idProveedorInput.value = '';
        document.getElementById('btn-guardar').textContent = 'Guardar';
    };

    // Manejar envío del formulario (Crear/Actualizar)
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
                limpiarFormulario();
                cargarProveedores();
            } else {
                throw new Error(result.message || 'Error en la operación');
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            alert(`Error: ${error.message}`);
        }
    });

    // Manejar clics en la tabla (Editar/Eliminar)
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
                    Object.keys(proveedor).forEach(key => {
                        const input = form.querySelector(`#${key}`);
                        if (input) {
                            // Formatear la fecha para el input type="date"
                            if (input.type === 'date' && proveedor[key]) {
                                input.value = proveedor[key].split(' ')[0];
                            } else {
                                input.value = proveedor[key];
                            }
                        }
                    });
                    idProveedorInput.value = proveedor.id_proveedores;
                    document.getElementById('btn-guardar').textContent = 'Actualizar';
                    window.scrollTo(0, 0);
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

    // Botón Limpiar
    btnLimpiar.addEventListener('click', limpiarFormulario);

    // Carga inicial
    cargarProveedores();
});
