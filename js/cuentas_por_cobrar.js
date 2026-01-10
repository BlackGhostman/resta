document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('tabla-cxc');
    const loadingIndicator = document.getElementById('loading-indicator');
    const emptyState = document.getElementById('empty-state');

    // Filters
    const filtroCliente = document.getElementById('filtro-cliente');
    const filtroFechaInicio = document.getElementById('filtro-fecha-inicio');
    const filtroFechaFin = document.getElementById('filtro-fecha-fin');
    const btnFiltrar = document.getElementById('btn-filtrar');

    // Payment Modal
    const modal = document.getElementById('pago-modal');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const btnConfirmarPago = document.getElementById('btn-confirmar-pago');
    const modalFacturaId = document.getElementById('modal-factura-id');
    const inputMonto = document.getElementById('monto-pago');

    let currentFacturaId = null;

    // Load Data
    const loadCuentas = async () => {
        tableBody.innerHTML = '';
        loadingIndicator.classList.remove('hidden');
        emptyState.classList.add('hidden');

        try {
            const params = new URLSearchParams();
            if (filtroCliente.value) params.append('cliente', filtroCliente.value);
            if (filtroFechaInicio.value) params.append('fecha_inicio', filtroFechaInicio.value);
            if (filtroFechaFin.value) params.append('fecha_fin', filtroFechaFin.value);

            const response = await fetch(`api/cuentas_por_cobrar.php?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                renderTable(data.facturas);
            } else {
                console.error('Error loading data:', data.error);
                alert('Error al cargar cuentas por cobrar.');
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

            // Determine badge color based on status (mock logic)
            let statusBadge = '';
            if (factura.estado === 'credito') {
                statusBadge = `<span class="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">Pendiente</span>`;
            } else {
                statusBadge = `<span class="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">${factura.estado}</span>`;
            }

            row.innerHTML = `
                <td class="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">#${factura.id_facturas_maestro}</td>
                <td class="px-6 py-4 text-slate-500 dark:text-slate-400">${new Date(factura.fecha).toLocaleDateString()}</td>
                <td class="px-6 py-4 font-bold">${factura.nombre_cliente || 'Cliente Genérico'}</td>
                <td class="px-6 py-4">${statusBadge}</td>
                <td class="px-6 py-4 text-right font-mono">${formatter.format(factura.total_factura)}</td>
                <td class="px-6 py-4 text-right font-mono text-red-500 font-bold">${formatter.format(factura.saldo_pendiente)}</td>
                <td class="px-6 py-4 text-center">
                    <button class="btn-pagar text-primary hover:text-green-400 font-bold text-sm transition-colors" data-id="${factura.id_facturas_maestro}" data-saldo="${factura.saldo_pendiente}">
                        Registrar Pago
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Add event listeners to new buttons
        document.querySelectorAll('.btn-pagar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const saldo = e.target.dataset.saldo;
                openPaymentModal(id, saldo);
            });
        });
    };

    // Modal Logic
    const openPaymentModal = (id, saldo) => {
        currentFacturaId = id;
        modalFacturaId.textContent = `#${id}`;
        inputMonto.value = saldo; // Default to full payment
        modal.classList.remove('hidden');
    };

    const closePaymentModal = () => {
        modal.classList.add('hidden');
        currentFacturaId = null;
    };

    btnCerrarModal.addEventListener('click', closePaymentModal);

    btnConfirmarPago.addEventListener('click', async () => {
        if (!currentFacturaId) return;

        const monto = parseFloat(inputMonto.value);
        if (isNaN(monto) || monto <= 0) {
            alert('Ingrese un monto válido.');
            return;
        }

        // Assuming an endpoint exists or mocking it
        // In a real scenario, we would create api/registrar_pago.php
        alert(`Simulando pago de ₡${monto} para la factura #${currentFacturaId}. (Endpoint pendiente)`);
        closePaymentModal();
        // loadCuentas(); // Reload to see changes
    });

    // Event Listeners
    btnFiltrar.addEventListener('click', loadCuentas);

    // Initial Load
    loadCuentas();
});
