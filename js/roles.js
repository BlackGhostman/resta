document.addEventListener('DOMContentLoaded', () => {
    // Variables
    const modal = document.getElementById('rol-modal');
    const form = document.getElementById('form-rol');
    const tableBody = document.getElementById('cuerpo-tabla-roles');
    const filterInput = document.getElementById('filtro-roles');
    const btnNuevo = document.getElementById('btn-nuevo-rol');
    const btnClose = document.getElementById('close-modal');
    const btnCancelar = document.getElementById('btn-cancelar');
    const modalTitle = document.getElementById('modal-title');

    let rolesList = [];

    const API_URL = 'api/roles.php';

    // Initial Load
    cargarRoles();

    // Event Listeners
    btnNuevo.addEventListener('click', () => abrirModal());
    btnClose.addEventListener('click', cerrarModal);
    btnCancelar.addEventListener('click', cerrarModal);
    window.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });

    form.addEventListener('submit', guardarRol);
    filterInput.addEventListener('keyup', filtrarRoles);

    // Functions
    async function cargarRoles() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (data.success) {
                rolesList = data.data;
                renderTabla(rolesList);
            } else {
                console.error('Error al cargar roles:', data.message);
                if (data.message.includes("no such table")) {
                    tableBody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-red-500">Error: La tabla "roles" no existe en la base de datos.</td></tr>';
                }
            }
        } catch (error) {
            console.error('Error de red:', error);
            tableBody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-red-500">Error de conexión con el servidor.</td></tr>';
        }
    }

    function renderTabla(roles) {
        tableBody.innerHTML = '';
        if (roles.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-slate-500">No hay roles registrados.</td></tr>';
            return;
        }

        roles.forEach(rol => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td class="px-6 py-4 font-bold text-slate-900 dark:text-white capitalize">${rol.nombre}</td>
                <td class="px-6 py-4 text-slate-500 dark:text-slate-400">${rol.descripcion || '-'}</td>
                <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                        <button class="btn-editar p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 hover:text-blue-600 transition-colors" title="Editar" onclick="editarRol(${rol.id_roles})">
                            <span class="material-symbols-outlined text-xl pointer-events-none">edit</span>
                        </button>
                        <button class="btn-eliminar p-2 rounded-lg text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors" title="Eliminar" onclick="eliminarRol(${rol.id_roles})">
                            <span class="material-symbols-outlined text-xl pointer-events-none">delete</span>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function filtrarRoles() {
        const termino = filterInput.value.toLowerCase();
        const filtrados = rolesList.filter(rol =>
            rol.nombre.toLowerCase().includes(termino) ||
            (rol.descripcion && rol.descripcion.toLowerCase().includes(termino))
        );
        renderTabla(filtrados);
    }

    function abrirModal(rol = null) {
        modal.style.display = 'block';
        form.reset();

        if (rol) {
            modalTitle.textContent = 'Editar Rol';
            document.getElementById('id_roles').value = rol.id_roles;
            document.getElementById('nombre').value = rol.nombre;
            document.getElementById('descripcion').value = rol.descripcion || '';
        } else {
            modalTitle.textContent = 'Nuevo Rol';
            document.getElementById('id_roles').value = '';
        }
    }

    function cerrarModal() {
        modal.style.display = 'none';
    }

    async function guardarRol(e) {
        e.preventDefault();

        const id = document.getElementById('id_roles').value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}?id=${id}` : API_URL;

        const formData = {
            nombre: document.getElementById('nombre').value,
            descripcion: document.getElementById('descripcion').value
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.success) {
                cerrarModal();
                cargarRoles();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar rol');
        }
    }

    // Expose functions to global scope for HTML onclick attributes
    window.editarRol = (id) => {
        const rol = rolesList.find(r => r.id_roles == id);
        if (rol) abrirModal(rol);
    };

    window.eliminarRol = async (id) => {
        if (!confirm('¿Está seguro de que desea eliminar este rol?')) return;

        try {
            const response = await fetch(`${API_URL}?id=${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                cargarRoles();
            } else {
                alert('Error al eliminar: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
});
