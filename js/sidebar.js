// Global Logout Handler
window.confirmLogout = async () => {
    try {
        const response = await fetch('api/logout.php?t=' + Date.now());

        if (!response.ok) {
            throw new Error(`Logout failed with status: ${response.status} `);
        }

        const data = await response.json();

        if (data.success) {
            window.location.replace('login.html');
        } else {
            // If backend says failed (unlikely), force logout anyway on client
            window.location.replace('login.html');
        }
    } catch (error) {
        console.error('Error logging out:', error);
        // Fallback: If fetch fails (network, CORB, etc), force redirect
        // This assumes the user wants to leave, even if backend cleanup failed slightly
        window.location.replace('login.html');
    }
};

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

    sidebarNav.innerHTML = ''; // Limpiar todo

    // Fetch and render active user
    fetch('api/current_user.php')
        .then(async response => {
            const text = await response.text();
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('Invalid JSON response:', text);
                throw new Error('Invalid JSON');
            }
        })
        .then(data => {
            if (!data.success) {
                // Redirect to login if no session
                window.location.href = 'login.html';
                return;
            }

            if (data.success) {
                // Update Sidebar
                const userDiv = document.createElement('div');
                userDiv.className = 'active-user';
                userDiv.style.justifyContent = 'space-between'; // Spacing for logout icon
                userDiv.innerHTML = `
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                        <i data-lucide="user" class="text-yellow"></i>
                        <span class="text-yellow font-medium">${data.user_name}</span>
                    </div>
                    <button id="sidebar-logout" style="background:none; border:none; cursor:pointer; padding:0; display:flex; align-items:center;" title="Cerrar Sesión">
                        <i data-lucide="log-out" class="text-yellow"></i>
                    </button>
                `;
                sidebarNav.prepend(userDiv);

                // Add Sidebar Logout Listener
                const logoutBtn = document.getElementById('sidebar-logout');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.confirmLogout();
                    });
                }

                // Update Header
                const headerIcons = document.querySelector('#main-header .header-icons');
                if (headerIcons) {
                    // Find or create user name span
                    const headerUserIcon = headerIcons.querySelector('i[data-lucide="user"]') || headerIcons.querySelector('svg.lucide-user');
                    if (headerUserIcon && !document.querySelector('.header-user-name')) {
                        const userNameSpan = document.createElement('span');
                        userNameSpan.textContent = data.user_name;
                        userNameSpan.className = 'header-user-name';
                        headerUserIcon.parentNode.insertBefore(userNameSpan, headerUserIcon.nextSibling);
                    }

                    // Setup Header Dropdown (One-time setup)
                    if (!document.querySelector('.header-dropdown')) {
                        const dropdown = document.createElement('div');
                        dropdown.className = 'header-dropdown hidden';
                        dropdown.innerHTML = `
                            <div class="dropdown-item" id="header-logout-btn">
                                <i data-lucide="log-out"></i>
                                <span>Cerrar Sesión</span>
                            </div>
                        `;
                        // Append to header-icons container
                        headerIcons.style.position = 'relative';
                        headerIcons.appendChild(dropdown);

                        // Attach event listener to the new button
                        document.getElementById('header-logout-btn').addEventListener('click', window.confirmLogout);

                        // Event Delegation for clicking header icons (User or Dots)
                        headerIcons.addEventListener('click', (e) => {
                            // Check if clicked the dropdown itself
                            if (e.target.closest('.header-dropdown')) return;

                            // Toggle dropdown if clicked on icons or name
                            dropdown.classList.toggle('hidden');
                            lucide.createIcons();
                            e.stopPropagation();
                        });

                        // Close when clicking outside
                        document.addEventListener('click', (e) => {
                            if (!headerIcons.contains(e.target)) {
                                dropdown.classList.add('hidden');
                            }
                        });
                    }
                }

                lucide.createIcons();
            }
        })
        .catch(err => console.error('Error fetching user:', err));



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
