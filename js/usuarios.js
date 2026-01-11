document.addEventListener('DOMContentLoaded', () => {
    // lucide.createIcons(); // Removed: Using Material Symbols

    // Variables
    const modal = document.getElementById('usuario-modal');
    const form = document.getElementById('form-usuario');
    const tableBody = document.getElementById('cuerpo-tabla-usuarios');
    const filterInput = document.getElementById('filtro-usuarios');
    const btnNuevo = document.getElementById('btn-nuevo-usuario');
    const btnClose = document.getElementById('close-modal');
    const btnCancelar = document.getElementById('btn-cancelar');
    const modalTitle = document.getElementById('modal-title');
    const passwordHelp = document.getElementById('password-help');

    let usuariosList = [];

    // Initial Load
    cargarUsuarios();

    // Event Listeners
    btnNuevo.addEventListener('click', () => abrirModal());
    btnClose.addEventListener('click', cerrarModal);
    btnCancelar.addEventListener('click', cerrarModal);
    window.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });

    form.addEventListener('submit', guardarUsuario);
    filterInput.addEventListener('keyup', filtrarUsuarios);

    // Functions
    async function cargarUsuarios() {
        try {
            const response = await fetch('api/usuarios.php');
            const data = await response.json();

            if (data.success) {
                usuariosList = data.data;
                renderTabla(usuariosList);
            } else {
                console.error('Error al cargar usuarios:', data.message);
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    }

    function renderTabla(usuarios) {
        tableBody.innerHTML = '';
        usuarios.forEach(user => {
            const row = document.createElement('tr');

            const estadoClass = user.esta_activo == 1 ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
            const estadoText = user.esta_activo == 1 ? 'Activo' : 'Inactivo';

            row.innerHTML = `
                <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">${user.usuario}</td>
                <td class="px-6 py-4 text-slate-500 dark:text-slate-400">${user.nombre_completo}</td>
                <td class="px-6 py-4 text-slate-500 dark:text-slate-400 capitalize">${user.perfil}</td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoClass}">
                        ${estadoText}
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                        <button class="btn-editar p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 hover:text-blue-600 transition-colors" title="Editar" onclick="editarUsuario(${user.id_usuarios})">
                            <span class="material-symbols-outlined text-xl pointer-events-none">edit</span>
                        </button>
                        <button class="btn-eliminar p-2 rounded-lg text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors" title="Eliminar" onclick="eliminarUsuario(${user.id_usuarios})">
                            <span class="material-symbols-outlined text-xl pointer-events-none">delete</span>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function filtrarUsuarios() {
        const termino = filterInput.value.toLowerCase();
        const filtrados = usuariosList.filter(user =>
            user.usuario.toLowerCase().includes(termino) ||
            user.nombre_completo.toLowerCase().includes(termino) ||
            user.perfil.toLowerCase().includes(termino)
        );
        renderTabla(filtrados);
    }

    function abrirModal(usuario = null) {
        modal.style.display = 'block';
        form.reset();

        if (usuario) {
            modalTitle.textContent = 'Editar Usuario';
            document.getElementById('id_usuarios').value = usuario.id_usuarios;
            document.getElementById('usuario').value = usuario.usuario;
            document.getElementById('nombre_completo').value = usuario.nombre_completo;
            document.getElementById('perfil').value = usuario.perfil;
            document.getElementById('esta_activo').checked = usuario.esta_activo == 1;

            document.getElementById('password').required = false;
            passwordHelp.textContent = 'Dejar en blanco para mantener la actual.';
        } else {
            modalTitle.textContent = 'Nuevo Usuario';
            document.getElementById('id_usuarios').value = '';
            document.getElementById('esta_activo').checked = true;

            document.getElementById('password').required = true;
            passwordHelp.textContent = 'Requerido para nuevos usuarios.';
        }
    }

    function cerrarModal() {
        modal.style.display = 'none';
    }

    async function guardarUsuario(e) {
        e.preventDefault();

        const id = document.getElementById('id_usuarios').value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `api/usuarios.php?id=${id}` : 'api/usuarios.php';

        const formData = {
            usuario: document.getElementById('usuario').value,
            nombre_completo: document.getElementById('nombre_completo').value,
            perfil: document.getElementById('perfil').value,
            password: document.getElementById('password').value,
            esta_activo: document.getElementById('esta_activo').checked ? 1 : 0
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.success) {
                // alert(data.message); // Optional: toaster 
                cerrarModal();
                cargarUsuarios();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar usuario');
        }
    }

    // Expose functions to global scope for HTML onclick attributes
    window.editarUsuario = (id) => {
        const usuario = usuariosList.find(u => u.id_usuarios == id);
        if (usuario) abrirModal(usuario);
    };

    window.eliminarUsuario = async (id) => {
        if (!confirm('¿Está seguro de que desea eliminar este usuario?')) return;

        try {
            const response = await fetch(`api/usuarios.php?id=${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                cargarUsuarios();
            } else {
                alert('Error al eliminar: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
});
