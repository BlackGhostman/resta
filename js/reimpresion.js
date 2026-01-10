document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('tabla-reimpresion');
    const loadingIndicator = document.getElementById('loading-indicator');
    const emptyState = document.getElementById('empty-state');

    // Filters
    const filtroId = document.getElementById('filtro-id');
    const filtroCliente = document.getElementById('filtro-cliente');
    const filtroFechaInicio = document.getElementById('filtro-fecha-inicio');
    const filtroFechaFin = document.getElementById('filtro-fecha-fin');
    const btnFiltrar = document.getElementById('btn-filtrar');

    // Load Data
    const loadFacturas = async () => {
        tableBody.innerHTML = '';
        loadingIndicator.classList.remove('hidden');
        emptyState.classList.add('hidden');

        try {
            const params = new URLSearchParams();
            if (filtroId.value) params.append('id', filtroId.value);
            if (filtroCliente.value) params.append('cliente', filtroCliente.value);
            if (filtroFechaInicio.value) params.append('fecha_inicio', filtroFechaInicio.value);
            if (filtroFechaFin.value) params.append('fecha_fin', filtroFechaFin.value);

            const response = await fetch(`api/reimpresion.php?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                renderTable(data.facturas);
            } else {
                console.error('Error loading data:', data.error);
                alert('Error al cargar historial de facturas.');
            }
        } catch (error) {
            console.error('Connection error:', error);
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    };

    const renderTable = (facturas) => {
        if (!facturas || facturas.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        facturas.forEach(factura => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors';

            // Format currency
            const formatter = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

            // Determine badge color based on status
            let statusBadge = '';
            const estado = factura.estado.toLowerCase();
            if (estado === 'pagada') {
                statusBadge = `<span class="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">Pagada</span>`;
            } else if (estado === 'credito') {
                statusBadge = `<span class="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">Crédito</span>`;
            } else if (estado === 'anulada') {
                statusBadge = `<span class="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">Anulada</span>`;
            } else {
                statusBadge = `<span class="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">${factura.estado}</span>`;
            }

            row.innerHTML = `
                <td class="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">#${factura.id_facturas_maestro}</td>
                <td class="px-6 py-4 text-slate-500 dark:text-slate-400">${new Date(factura.fecha).toLocaleDateString()} ${new Date(factura.fecha).toLocaleTimeString()}</td>
                <td class="px-6 py-4 font-bold">${factura.nombre_cliente || 'Cliente Genérico'}</td>
                <td class="px-6 py-4">${statusBadge}</td>
                <td class="px-6 py-4 text-right font-mono">${formatter.format(factura.total_factura)}</td>
                <td class="px-6 py-4 text-center">
                    <button class="btn-imprimir bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded p-2 transition-colors tooltip" title="Reimprimir Ticket" data-id="${factura.id_facturas_maestro}">
                        <span class="material-symbols-outlined text-sm">print</span>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Add event listeners to new buttons
        document.querySelectorAll('.btn-imprimir').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id; // Use currentTarget because of icon
                imprimirFactura(id);
            });
        });
    };

    const imprimirFactura = (id) => {
        // Open ticket.html in a popup window centered
        const w = 400;
        const h = 600;
        const left = (window.screen.width / 2) - (w / 2);
        const top = (window.screen.height / 2) - (h / 2);

        window.open(
            `ticket.html?id=${id}`,
            'ImprimirTicket',
            `width=${w},height=${h},top=${top},left=${left},scrollbars=yes,resizable=yes`
        );
    };

    // Event Listeners
    btnFiltrar.addEventListener('click', loadFacturas);

    // Also trigger search on Enter in filter fields
    [filtroId, filtroCliente].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loadFacturas();
        });
    });

    // Initial Load
    loadFacturas();
});
