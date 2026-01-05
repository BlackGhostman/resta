document.addEventListener('DOMContentLoaded', () => {
    // Definición de la estructura del menú
    const menuStructure = [
        {
            title: "Facturación",
            icon: "receipt", // Lucide icon name
            items: [
                { label: "Facturar", url: "facturar.html" },
                { label: "Consulta cuentas x cobrar", url: "cuentas_cobrar.html" },
                { label: "Reimpresión", url: "reimpresion.html" },
                { label: "Anulación", url: "anulacion.html" },
                { label: "Cierres Diarios", url: "cierres.html" },
                { label: "Reportes", url: "reportes_facturacion.html" }
            ]
        },
        {
            title: "Inventario",
            icon: "boxes",
            items: [
                { label: "Mantenimiento Artículos", url: "articulos.html" },
                { label: "Mantenimiento Familias /Subfamilias", url: "familias.html" }, // Combined link based on request, or split logic if needed
                { label: "Ajustes Entrada /Salida", url: "ajustes_inventario.html" },
                { label: "Mantenimiento Ubicaciones Inventario", url: "gestionar_ubicaciones.html" },
                { label: "Mantenimiento unidades de medida", url: "medidas.html" },
                { label: "Reportes", url: "reportes_inventario.html" }
            ]
        },
        {
            title: "Misceláneos",
            icon: "settings",
            items: [
                { label: "Mantenimiento /Editor mesas", url: "mesas.html" },
                { label: "Mantenimiento Proveedores", url: "proveedores.html" },
                { label: "Tipos Ajuste de Inventario", url: "tipos_ajuste_inventario.html" },
                { label: "Tipos de Cuenta", url: "tipos_cuenta.html" },
                { label: "Tipos de Pago", url: "tipos_pago.html" },
                { label: "Impresoras", url: "impresoras.html" }
            ]
        },
        {
            title: "Seguridad",
            icon: "shield",
            items: [
                { label: "Creación /Modificación Usuarios", url: "usuarios.html" },
                { label: "Asignación Roles", url: "roles.html" },
                { label: "Reportes de auditoría", url: "auditoria.html" }
            ]
        }
    ];

    const sidebarNav = document.querySelector('.sidebar-nav');

    // Mantener la sección de usuario activo si existe
    const activeUserSection = sidebarNav.querySelector('.active-user');

    // Limpiar navegación existente (excepto usuario activo si se quiere preservar, o recrearlo)
    // Para simplificar, reconstruiremos la lista de botones.
    // Guardamos el usuario activo para reinsertarlo al principio si es necesario.

    sidebarNav.innerHTML = ''; // Limpiar todo
    if (activeUserSection) {
        sidebarNav.appendChild(activeUserSection);
    }

    const navContainer = document.createElement('div');
    navContainer.className = 'nav-buttons';

    // Función para crear el HTML de cada grupo
    menuStructure.forEach(group => {
        // Contenedor del grupo
        const groupContainer = document.createElement('div');
        groupContainer.className = 'nav-group';

        // Botón/Cabecera del grupo (Trigger)
        const groupTrigger = document.createElement('button');
        groupTrigger.className = 'nav-group-trigger';
        groupTrigger.innerHTML = `
            <div class="trigger-content">
                <i data-lucide="${group.icon}"></i>
                <span>${group.title}</span>
            </div>
            <i data-lucide="chevron-down" class="chevron-icon"></i>
        `;

        // Contenedor de los items (submenú)
        const groupContent = document.createElement('div');
        groupContent.className = 'nav-group-content';

        // Items individuales
        group.items.forEach(item => {
            const link = document.createElement('a');
            link.href = item.url;
            link.className = 'nav-sub-item';
            link.innerHTML = `<span>${item.label}</span>`;

            // Marcar activo si coincide la URL
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            if (item.url === currentPage) {
                link.classList.add('active');
                groupContent.classList.add('open'); // Abrir el grupo si tiene el item activo
                groupTrigger.classList.add('active-group');
            }

            groupContent.appendChild(link);
        });

        // Evento click para colapsar/expandir
        groupTrigger.addEventListener('click', () => {
            const isOpen = groupContent.classList.contains('open');
            // Opcional: Cerrar otros grupos
            // document.querySelectorAll('.nav-group-content').forEach(c => c.classList.remove('open'));
            // document.querySelectorAll('.chevron-icon').forEach(i => i.style.transform = 'rotate(0deg)');

            if (!isOpen) {
                groupContent.classList.add('open');
                groupTrigger.querySelector('.chevron-icon').style.transform = 'rotate(180deg)';
            } else {
                groupContent.classList.remove('open');
                groupTrigger.querySelector('.chevron-icon').style.transform = 'rotate(0deg)';
            }
        });

        // Inicializar rotación si ya estaba abierto por item activo
        if (groupContent.classList.contains('open')) {
            groupTrigger.querySelector('.chevron-icon').style.transform = 'rotate(180deg)';
        }

        groupContainer.appendChild(groupTrigger);
        groupContainer.appendChild(groupContent);
        navContainer.appendChild(groupContainer);
    });

    sidebarNav.appendChild(navContainer);

    // Re-renderizar iconos de Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }
});
