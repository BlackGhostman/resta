// Estado global de la factura
let facturaActual = {
    mesa: null,
    nombreCliente: '',
    cantidadPersonas: 1,
    articulos: [],
    tipoPago: null,
    subtotal: 0,
    descuento: 0,
    impuestos: 0,
    total: 0
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarMesasOcupadas();
    cargarTiposPago();
    configurarBusquedaArticulos();
});

// Cargar mesas ocupadas
async function cargarMesasOcupadas() {
    try {
        const response = await fetch('api/facturar.php?action=get_mesas_ocupadas');
        const data = await response.json();

        const select = document.getElementById('mesa-select');
        select.innerHTML = '<option value="">Seleccione una mesa...</option>';

        if (data.success && data.mesas) {
            data.mesas.forEach(mesa => {
                const option = document.createElement('option');
                option.value = mesa.id_salones_mesas;
                option.textContent = `${mesa.identificador} - ${mesa.descripcion || 'Sin descripción'}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error cargando mesas:', error);
        mostrarError('Error al cargar las mesas ocupadas');
    }
}

// Cargar tipos de pago
async function cargarTiposPago() {
    try {
        const response = await fetch('api/facturar.php?action=get_tipos_pago');
        const data = await response.json();

        const select = document.getElementById('tipo-pago');
        select.innerHTML = '<option value="">Seleccione...</option>';

        if (data.success && data.tipos) {
            data.tipos.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.id_tipos_pago;
                option.textContent = tipo.descripcion;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error cargando tipos de pago:', error);
    }
}

// Configurar búsqueda de artículos
function configurarBusquedaArticulos() {
    const input = document.getElementById('buscar-articulo');
    const resultados = document.getElementById('resultados-busqueda');
    let timeoutId;

    input.addEventListener('input', (e) => {
        clearTimeout(timeoutId);
        const query = e.target.value.trim();

        if (query.length < 2) {
            resultados.classList.add('hidden');
            return;
        }

        timeoutId = setTimeout(() => buscarArticulos(query), 300);
    });

    // Cerrar resultados al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            resultados.classList.add('hidden');
        }
    });
}

// Buscar artículos
async function buscarArticulos(query) {
    try {
        const response = await fetch(`api/facturar.php?action=buscar_articulos&q=${encodeURIComponent(query)}`);
        const data = await response.json();

        const resultados = document.getElementById('resultados-busqueda');

        if (data.success && data.articulos && data.articulos.length > 0) {
            resultados.innerHTML = data.articulos.map(art => `
                <div class="search-result-item" onclick="agregarArticulo(${art.id_articulos}, '${art.nombre.replace(/'/g, "\\'")}', ${art.precio_venta})">
                    <div class="result-name">${art.nombre}</div>
                    <div class="result-price">₡${formatearNumero(art.precio_venta)}</div>
                </div>
            `).join('');
            resultados.classList.remove('hidden');
        } else {
            resultados.innerHTML = '<div class="search-result-item no-results">No se encontraron artículos</div>';
            resultados.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error buscando artículos:', error);
    }
}

// Agregar artículo a la factura
function agregarArticulo(id, nombre, precio) {
    // Verificar si ya existe
    const existente = facturaActual.articulos.find(a => a.id === id);

    if (existente) {
        existente.cantidad++;
    } else {
        facturaActual.articulos.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    actualizarTablaArticulos();
    calcularTotales();

    // Limpiar búsqueda
    document.getElementById('buscar-articulo').value = '';
    document.getElementById('resultados-busqueda').classList.add('hidden');
}

// Actualizar tabla de artículos
function actualizarTablaArticulos() {
    const tbody = document.getElementById('articulos-tbody');

    if (facturaActual.articulos.length === 0) {
        tbody.innerHTML = '<tr class="empty-state"><td colspan="5" class="text-center">No hay artículos agregados</td></tr>';
        return;
    }

    tbody.innerHTML = facturaActual.articulos.map((art, index) => `
        <tr>
            <td>${art.nombre}</td>
            <td>
                <input type="number" 
                       class="form-control cantidad-input" 
                       value="${art.cantidad}" 
                       min="1" 
                       onchange="actualizarCantidad(${index}, this.value)">
            </td>
            <td class="text-right">₡${formatearNumero(art.precio)}</td>
            <td class="text-right">₡${formatearNumero(art.precio * art.cantidad)}</td>
            <td class="text-center">
                <button class="btn-icon btn-danger" onclick="eliminarArticulo(${index})" title="Eliminar">
                    <i data-lucide="trash-2"></i>
                </button>
            </td>
        </tr>
    `).join('');

    // Re-renderizar iconos de Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Actualizar cantidad de un artículo
function actualizarCantidad(index, nuevaCantidad) {
    const cantidad = parseInt(nuevaCantidad);
    if (cantidad > 0) {
        facturaActual.articulos[index].cantidad = cantidad;
        calcularTotales();
        actualizarTablaArticulos();
    }
}

// Eliminar artículo
function eliminarArticulo(index) {
    if (confirm('¿Está seguro de eliminar este artículo?')) {
        facturaActual.articulos.splice(index, 1);
        actualizarTablaArticulos();
        calcularTotales();
    }
}

// Calcular totales
function calcularTotales() {
    facturaActual.subtotal = facturaActual.articulos.reduce((sum, art) => sum + (art.precio * art.cantidad), 0);
    facturaActual.descuento = 0; // Por ahora sin descuentos
    facturaActual.impuestos = 0; // Por ahora sin impuestos
    facturaActual.total = facturaActual.subtotal - facturaActual.descuento + facturaActual.impuestos;

    document.getElementById('subtotal-display').textContent = `₡${formatearNumero(facturaActual.subtotal)}`;
    document.getElementById('descuento-display').textContent = `₡${formatearNumero(facturaActual.descuento)}`;
    document.getElementById('impuestos-display').textContent = `₡${formatearNumero(facturaActual.impuestos)}`;
    document.getElementById('total-display').textContent = `₡${formatearNumero(facturaActual.total)}`;
}

// Guardar factura
async function guardarFactura() {
    // Validaciones
    const mesaId = document.getElementById('mesa-select').value;
    const nombreCliente = document.getElementById('nombre-cliente').value.trim();
    const cantidadPersonas = parseInt(document.getElementById('cantidad-personas').value);
    const tipoPagoId = document.getElementById('tipo-pago').value;

    if (!mesaId) {
        mostrarError('Debe seleccionar una mesa');
        return;
    }

    if (facturaActual.articulos.length === 0) {
        mostrarError('Debe agregar al menos un artículo');
        return;
    }

    if (!tipoPagoId) {
        mostrarError('Debe seleccionar un método de pago');
        return;
    }

    // Preparar datos
    const datosFactura = {
        id_mesa: mesaId,
        nombre_cliente: nombreCliente,
        cantidad_personas: cantidadPersonas,
        id_tipo_pago: tipoPagoId,
        articulos: facturaActual.articulos,
        subtotal: facturaActual.subtotal,
        descuento: facturaActual.descuento,
        impuestos: facturaActual.impuestos,
        total: facturaActual.total
    };

    try {
        const response = await fetch('api/facturar.php?action=crear_factura', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosFactura)
        });

        const data = await response.json();

        if (data.success) {
            alert('Factura guardada exitosamente');
            limpiarFormulario();
            cargarMesasOcupadas(); // Recargar mesas
        } else {
            mostrarError(data.message || 'Error al guardar la factura');
        }
    } catch (error) {
        console.error('Error guardando factura:', error);
        mostrarError('Error al guardar la factura');
    }
}

// Cancelar factura
function cancelarFactura() {
    if (facturaActual.articulos.length > 0) {
        if (!confirm('¿Está seguro de cancelar? Se perderán los datos ingresados.')) {
            return;
        }
    }
    limpiarFormulario();
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('mesa-select').value = '';
    document.getElementById('nombre-cliente').value = '';
    document.getElementById('cantidad-personas').value = '1';
    document.getElementById('tipo-pago').value = '';
    document.getElementById('buscar-articulo').value = '';

    facturaActual = {
        mesa: null,
        nombreCliente: '',
        cantidadPersonas: 1,
        articulos: [],
        tipoPago: null,
        subtotal: 0,
        descuento: 0,
        impuestos: 0,
        total: 0
    };

    actualizarTablaArticulos();
    calcularTotales();
}

// Utilidades
function formatearNumero(numero) {
    return new Intl.NumberFormat('es-CR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numero);
}

function mostrarError(mensaje) {
    alert(mensaje); // Por ahora usamos alert, luego se puede mejorar con un modal
}
