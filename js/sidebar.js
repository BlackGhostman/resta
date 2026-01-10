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
            window.location.replace('login.html');
        }
    } catch (error) {
        console.error('Error logging out:', error);
        window.location.replace('login.html');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Definición de la estructura del menú
    const menuStructure = [
        {
            title: "Facturación",
            icon: "receipt_long", // Material Symbol
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
            icon: "inventory_2",
            items: [
                { label: "Mantenimiento Artículos", url: "articulos.html" },
                { label: "Mantenimiento Familias", url: "familias.html" },
                { label: "Ajustes Entrada /Salida", url: "ajustes_inventario.html" },
                { label: "Ubicaciones Inventario", url: "gestionar_ubicaciones.html" },
                { label: "Unidades de Medida", url: "medidas.html" },
                { label: "Reportes", url: "reportes_inventario.html" }
            ]
        },
        {
            title: "Misceláneos",
            icon: "tune",
            items: [
                { label: "Editor de Mesas", url: "editor.html" }, // Updated to point to new editor
                { label: "Proveedores", url: "proveedores.html" },
                { label: "Tipos Ajuste", url: "tipos_ajuste_inventario.html" },
                { label: "Tipos de Cuenta", url: "tipos_cuenta.html" },
                { label: "Tipos de Pago", url: "tipos_pago.html" },
                { label: "Impresoras", url: "impresoras.html" }
            ]
        },
        {
            title: "Seguridad",
            icon: "admin_panel_settings",
            items: [
                { label: "Usuarios", url: "usuarios.html" },
                { label: "Roles", url: "roles.html" },
                { label: "Auditoría", url: "auditoria.html" }
            ]
        }
    ];

    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    // Clear existing content
    sidebar.innerHTML = '';

    // 1. Sidebar Header (AdminPortal) - Fixed at top
    // Created as a direct child of sidebar
    const headerDiv = document.createElement('div');
    headerDiv.className = 'px-6 pt-6 pb-4 flex-none';
    headerDiv.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="bg-primary/20 p-2 rounded-lg">
                <span class="material-symbols-outlined text-primary text-2xl">restaurant</span>
            </div>
            <div>
                <h1 class="text-white text-lg font-bold leading-none">AdminPortal</h1>
                <p class="text-slate-400 text-xs mt-1">Management Suite</p>
            </div>
        </div>
    `;
    sidebar.appendChild(headerDiv);

    // 2. Navigation Container (Scrollable)
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'flex-1 overflow-y-auto px-6 pb-4 min-h-0';
    // Hide scrollbar for cleaner look but keep functionality
    scrollContainer.style.cssText = `scrollbar-width: thin; scrollbar-color: #334155 transparent;`;

    const nav = document.createElement('nav');
    nav.className = 'space-y-1';

    // 3. Static Dashboard Link
    const dashboardLink = document.createElement('a');
    dashboardLink.href = 'dashboard.html';
    dashboardLink.className = 'flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mb-4';
    dashboardLink.innerHTML = `
        <span class="material-symbols-outlined text-[20px]">dashboard</span>
        <span class="text-sm font-medium">Dashboard</span>
    `;
    nav.appendChild(dashboardLink);

    // 4. Generate Dynamic Menu Items (Section Headers approach)
    menuStructure.forEach(group => {
        const groupContainer = document.createElement('div');
        groupContainer.className = 'mb-6';

        // Group Header
        const groupHeader = document.createElement('p');
        groupHeader.className = 'text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3 transition-colors';
        groupHeader.textContent = group.title;
        groupContainer.appendChild(groupHeader);

        // Submenu Container
        const subMenu = document.createElement('nav');
        subMenu.className = 'space-y-0.5';

        // Add items
        group.items.forEach(item => {
            const link = document.createElement('a');
            link.href = item.url;
            link.className = 'flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors group';

            // Check Active State
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const isActive = item.url === currentPage;

            if (isActive) {
                link.className = 'flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 transition-colors';
            }

            link.innerHTML = `
                <span class="material-symbols-outlined text-[20px] ${isActive ? '' : 'group-hover:text-white'} transition-colors" 
                      style="${isActive ? "font-variation-settings: 'FILL' 1" : ''}">
                      ${group.icon}
                </span>
                <span class="text-sm font-medium whitespace-nowrap">${item.label}</span>
            `;

            subMenu.appendChild(link);
        });

        groupContainer.appendChild(subMenu);
        nav.appendChild(groupContainer);
    });

    scrollContainer.appendChild(nav);
    sidebar.appendChild(scrollContainer);

    // 5. User Profile Footer (Async fetch) - Fixed
    const footerDiv = document.createElement('div');
    footerDiv.className = 'p-6 border-t border-slate-800 flex-none bg-slate-900 z-10';

    // Initial loading state
    footerDiv.innerHTML = `
        <div class="animate-pulse flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-slate-700"></div>
            <div class="h-4 bg-slate-700 rounded w-24"></div>
        </div>
    `;
    sidebar.appendChild(footerDiv);

    fetch('api/current_user.php')
        .then(async response => {
            const text = await response.text();
            try { return JSON.parse(text); } catch { return { success: false }; }
        })
        .then(data => {
            if (data.success) {
                footerDiv.innerHTML = `
                    <div class="flex flex-col gap-3">
                         <div class="flex items-center gap-3 px-1">
                            <div class="w-8 h-8 rounded-full bg-slate-700 bg-cover bg-center flex items-center justify-center text-xs font-bold text-white uppercase" 
                                 style="${data.photo_url ? `background-image: url('${data.photo_url}')` : 'background-color: #334155'}">
                                 ${!data.photo_url ? data.user_name.substring(0, 2) : ''}
                            </div>
                            <div class="flex-1 overflow-hidden">
                                <p class="text-white text-xs font-bold truncate">${data.user_name}</p>
                                <p class="text-slate-400 text-[10px] truncate">Administrator</p>
                            </div>
                        </div>
                        <button onclick="window.confirmLogout()" class="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 py-2 text-xs font-bold hover:bg-slate-700 hover:text-white transition-all">
                            <span class="material-symbols-outlined text-[14px]">logout</span>
                            Cerrar Sesión
                        </button>
                    </div>
                `;

                // Also update Header User Placeholder if exists
                const headerUser = document.querySelector('.header-user-placeholder');
                if (headerUser) {
                    headerUser.innerHTML = `
                        <span class="text-sm font-medium text-slate-700 dark:text-slate-200 hidden md:block">${data.user_name}</span>
                        <div class="size-8 rounded-full bg-slate-700 bg-center bg-cover flex items-center justify-center text-xs text-white" 
                             style="${data.photo_url ? `background-image: url('${data.photo_url}')` : ''}">${!data.photo_url ? data.user_name.substring(0, 2) : ''}</div>
                     `;
                }

            } else {
                // Not logged in
                window.location.href = 'login.html';
            }
        })
        .catch(err => {
            console.error(err);
            footerDiv.innerHTML = `
                <div class="text-red-500 text-xs">Error de conexión</div>
            `;
        });
});
