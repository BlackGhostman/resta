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
            row.className = 'hover:bg-slate-800 transition-colors group';

            // Format currency
            const formatter = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

            // Determine badge color based on status
            let statusBadge = '';
            if (factura.estado === 'credito') {
                statusBadge = `<div class="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider">
                                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                                Pendiente
                               </div>`;
            } else {
                statusBadge = `<div class="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                ${factura.estado}
                               </div>`;
            }

            row.innerHTML = `
                <td class="px-8 py-5 border-b border-slate-800 font-bold text-white text-sm">#${factura.id_facturas_maestro}</td>
                <td class="px-8 py-5 border-b border-slate-800 text-slate-400 text-sm">${new Date(factura.fecha).toLocaleDateString()}</td>
                <td class="px-8 py-5 border-b border-slate-800 font-medium text-slate-300">
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-3 text-xs font-bold text-slate-500">
                            ${(factura.nombre_cliente || 'CG').substring(0, 2).toUpperCase()}
                        </div>
                        ${factura.nombre_cliente || 'Cliente Genérico'}
                    </div>
                </td>
                <td class="px-8 py-5 border-b border-slate-800">${statusBadge}</td>
                <td class="px-8 py-5 border-b border-slate-800 text-right font-mono text-slate-400 text-sm">${formatter.format(factura.total_factura)}</td>
                <td class="px-8 py-5 border-b border-slate-800 text-right font-mono text-white font-bold text-sm">${formatter.format(factura.saldo_pendiente)}</td>
                <td class="px-8 py-5 border-b border-slate-800 text-right">
                    <button class="btn-pagar text-xs font-bold uppercase tracking-wider text-emerald-500 hover:text-emerald-400 transition-colors flex items-center justify-end gap-1 ml-auto group-hover:underline" data-id="${factura.id_facturas_maestro}" data-saldo="${factura.saldo_pendiente}">
                        REGISTRAR PAGO
                        <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Add event listeners to new buttons
        document.querySelectorAll('.btn-pagar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Handle click on icon or text inside button
                const target = e.target.closest('.btn-pagar');
                if (target) {
                    const id = target.dataset.id;
                    const saldo = target.dataset.saldo;
                    openPaymentModal(id, saldo);
                }
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
