document.addEventListener("DOMContentLoaded", async () => {
    // --- INICIALIZACIÓN DE LA APLICACIÓN ---
    await inicializarAplicacion();

    // --- LÓGICA PARA CAMBIAR DE VISTA (MENÚ LATERAL) ---
    const navButtons = document.querySelectorAll(".nav-button");
    const views = document.querySelectorAll(".view");

    navButtons.forEach(button => {
        button.addEventListener("click", async () => {
            // Obtener el ID de la vista desde el atributo data-view
            const viewId = button.dataset.view + "-view";
            
            // Ocultar todas las vistas
            views.forEach(view => view.classList.remove("active"));
            
            // Desactivar todos los botones
            navButtons.forEach(btn => btn.classList.remove("active"));

            // Mostrar la vista seleccionada y activar el botón
            document.getElementById(viewId).classList.add("active");
            button.classList.add("active");

            // Cargar datos específicos de la vista
            await cargarDatosVista(button.dataset.view);
        });
    });

    // --- LÓGICA PARA LOS FILTROS DE BÚSQUEDA ---
    const filterInputs = document.querySelectorAll(".filter-input");

    filterInputs.forEach(input => {
        input.addEventListener("input", (e) => {
            const filterValue = e.target.value.toLowerCase();
            const listId = e.target.dataset.target;
            const items = document.querySelectorAll(`#${listId} > .list-item`);

            items.forEach(item => {
                const itemText = item.textContent.toLowerCase();
                if (itemText.includes(filterValue)) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });

    // --- LÓGICA PARA LA VISTA DE CLIENTES ---
    const clientForm = document.getElementById("add-client-form");
    const clientInput = document.getElementById("new-client-input");
    const clientList = document.getElementById("clients-list");

    if (clientForm) {
        clientForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Evitar que la página se recargue
            const newClientName = clientInput.value.trim();

            if (newClientName) {
                // Crear un nuevo elemento para el cliente
                const newClientElement = document.createElement("div");
                newClientElement.className = "list-item";
                newClientElement.textContent = newClientName;
                
                // Añadirlo a la lista
                clientList.appendChild(newClientElement);
                
                // Limpiar el campo de texto
                clientInput.value = "";
            }
        });
    }

    // --- LÓGICA PARA LA VISTA DE MESAS ---
    const tableButtons = document.querySelectorAll(".table-button");

    tableButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Alternar la clase 'occupied'
            button.classList.toggle("occupied");
        });
    });
    
    // Inicia los íconos de Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// --- FUNCIONES PARA CONECTAR CON LA BASE DE DATOS ---

/**
 * Inicializar la aplicación cargando datos desde la base de datos
 */
async function inicializarAplicacion() {
    try {
        console.log('Inicializando aplicación...');
        
        // Cargar datos iniciales
        await cargarDatosVista('drinks'); // Cargar bebidas por defecto
        await cargarMesas();
        
        console.log('Aplicación inicializada correctamente');
    } catch (error) {
        console.error('Error al inicializar aplicación:', error);
        mostrarError('Error al conectar con la base de datos. Verifica la conexión.');
    }
}

/**
 * Cargar datos específicos según la vista seleccionada
 */
async function cargarDatosVista(vista) {
    try {
        switch (vista) {
            case 'drinks':
                await cargarArticulosPorFamilia('Bebidas');
                break;
            case 'bocas':
                await cargarArticulosPorFamilia('Bocas');
                break;
            case 'fuertes':
                await cargarArticulosPorFamilia('Fuertes');
                break;
            case 'snacks':
                await cargarArticulosPorFamilia('Snacks');
                break;
            case 'tables':
                await cargarMesas();
                break;
        }
    } catch (error) {
        console.error(`Error al cargar datos de ${vista}:`, error);
        mostrarError(`Error al cargar ${vista}`);
    }
}

/**
 * Cargar artículos por familia desde la base de datos
 */
async function cargarArticulosPorFamilia(nombreFamilia) {
    try {
        // Primero obtener las familias para encontrar el ID
        const familias = await api.obtenerFamilias();
        const familia = familias.data.find(f => f.descripcion.toLowerCase() === nombreFamilia.toLowerCase());
        
        let articulos;
        if (familia) {
            articulos = await api.obtenerArticulosPorFamilia(familia.id_familias);
        } else {
            // Si no encuentra la familia específica, cargar todos los artículos
            articulos = await api.obtenerArticulosPorFamilia();
        }
        
        // Actualizar la vista correspondiente
        const vistaId = nombreFamilia.toLowerCase() + '-list';
        actualizarListaArticulos(vistaId, articulos.data);
        
    } catch (error) {
        console.error('Error al cargar artículos:', error);
        mostrarError('Error al cargar productos');
    }
}

/**
 * Actualizar la lista de artículos en el DOM
 */
function actualizarListaArticulos(contenedorId, articulos) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    
    articulos.forEach(articulo => {
        const elemento = document.createElement('div');
        elemento.className = 'list-item';
        elemento.innerHTML = `
            <div class="item-info">
                <span class="item-name">${articulo.nombre}</span>
                <span class="item-price">₡${parseFloat(articulo.precio_venta).toLocaleString()}</span>
            </div>
            <div class="item-details">
                <small>Stock: ${articulo.existencia} ${articulo.medida_nombre || ''}</small>
            </div>
        `;
        
        // Agregar evento click para agregar al pedido
        elemento.addEventListener('click', () => {
            agregarAlPedido(articulo);
        });
        
        contenedor.appendChild(elemento);
    });
}

/**
 * Cargar mesas desde la base de datos
 */
async function cargarMesas() {
    try {
        const mesas = await api.obtenerMesas();
        actualizarListaMesas(mesas.data);
    } catch (error) {
        console.error('Error al cargar mesas:', error);
        mostrarError('Error al cargar mesas');
    }
}

/**
 * Actualizar la lista de mesas en el DOM
 */
function actualizarListaMesas(mesas) {
    const contenedor = document.getElementById('tables-list');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    
    mesas.forEach(mesa => {
        const elemento = document.createElement('button');
        elemento.className = `table-button ${mesa.estado === 'ocupada' ? 'occupied' : ''}`;
        elemento.dataset.tableId = mesa.id_salones_mesas;
        elemento.textContent = mesa.identificador;
        
        // Agregar evento click para cambiar estado
        elemento.addEventListener('click', async () => {
            await cambiarEstadoMesa(mesa.id_salones_mesas, mesa.estado);
        });
        
        contenedor.appendChild(elemento);
    });
}

/**
 * Cambiar estado de una mesa
 */
async function cambiarEstadoMesa(idMesa, estadoActual) {
    try {
        const nuevoEstado = estadoActual === 'disponible' ? 'ocupada' : 'disponible';
        await api.cambiarEstadoMesa(idMesa, nuevoEstado);
        
        // Recargar las mesas para reflejar el cambio
        await cargarMesas();
        
    } catch (error) {
        console.error('Error al cambiar estado de mesa:', error);
        mostrarError('Error al actualizar mesa');
    }
}

/**
 * Agregar artículo al pedido (función placeholder)
 */
function agregarAlPedido(articulo) {
    console.log('Agregando al pedido:', articulo);
    // Aquí puedes implementar la lógica para agregar al carrito/pedido
    mostrarMensaje(`${articulo.nombre} agregado al pedido`);
}

/**
 * Mostrar mensaje de error
 */
function mostrarError(mensaje) {
    console.error(mensaje);
    // Aquí puedes implementar una notificación visual
    alert('Error: ' + mensaje);
}

/**
 * Mostrar mensaje informativo
 */
function mostrarMensaje(mensaje) {
    console.log(mensaje);
    // Aquí puedes implementar una notificación visual
}