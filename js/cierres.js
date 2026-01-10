do {
    // This is valid javascript inside the carousel slide
    // However, I need to write the file content.
} while (0);

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const datePicker = document.getElementById('fecha-cierre');
    const btnActualizar = document.getElementById('btn-actualizar');
    const btnImprimir = document.getElementById('btn-imprimir-cierre');

    // Totals Elements
    const elTotalVentas = document.getElementById('total-ventas');
    const elConteoFacturas = document.getElementById('conteo-facturas');
    const elTotalImpuestos = document.getElementById('total-impuestos');
    const elTotalAnulado = document.getElementById('total-anulado');
    const elConteoAnuladas = document.getElementById('conteo-anuladas');
    const tablaDesglose = document.getElementById('tabla-desglose');

    // Set today as default
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;

    // Load Data
    const loadCierre = async () => {
        const fecha = datePicker.value;
        if (!fecha) return;

        try {
            // Add loading state opacity
            document.querySelector('main').classList.add('opacity-50', 'pointer-events-none');

            const response = await fetch(`api/cierre_diario.php?fecha=${fecha}`);
            const data = await response.json();

            if (data.success) {
                updateUI(data);
            } else {
                console.error('Error:', data.error);
                alert('Error al cargar datos del cierre.');
            }
        } catch (error) {
            console.error('Connection error:', error);
        } finally {
            document.querySelector('main').classList.remove('opacity-50', 'pointer-events-none');
        }
    };

    const updateUI = (data) => {
        const formatter = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

        // Totals
        elTotalVentas.textContent = formatter.format(data.resumen_general.total_ventas);
        elConteoFacturas.textContent = `${data.resumen_general.total_facturas} Facturas Validas`;

        elTotalImpuestos.textContent = formatter.format(data.resumen_general.total_impuestos);

        elTotalAnulado.textContent = formatter.format(data.resumen_anuladas.monto_anulado);
        elConteoAnuladas.textContent = `${data.resumen_anuladas.total_anuladas} Facturas Anuladas`;

        // Breakdown Table
        tablaDesglose.innerHTML = '';
        if (data.desglose_estados.length === 0) {
            tablaDesglose.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-slate-500">No hay movimientos.</td></tr>';
        } else {
            data.desglose_estados.forEach(item => {
                const row = document.createElement('tr');
                row.className = 'border-b border-slate-100 dark:border-slate-800 last:border-0';
                row.innerHTML = `
                    <td class="px-6 py-4 font-bold capitalize">${item.estado}</td>
                    <td class="px-6 py-4 text-center text-mono">${item.cantidad}</td>
                    <td class="px-6 py-4 text-right font-mono font-bold">${formatter.format(item.total)}</td>
                `;
                tablaDesglose.appendChild(row);
            });
        }
    };

    const imprimirCierre = () => {
        const fecha = datePicker.value;
        // Open ticket_cierre.html in popup
        const w = 400;
        const h = 600;
        const left = (window.screen.width / 2) - (w / 2);
        const top = (window.screen.height / 2) - (h / 2);

        window.open(
            `ticket_cierre.html?fecha=${fecha}`,
            'ImprimirCierreZ',
            `width=${w},height=${h},top=${top},left=${left},scrollbars=yes,resizable=yes`
        );
    };

    // Events
    btnActualizar.addEventListener('click', loadCierre);
    datePicker.addEventListener('change', loadCierre); // Auto-reload on date change
    btnImprimir.addEventListener('click', imprimirCierre);

    // Initial Load
    loadCierre();
});
