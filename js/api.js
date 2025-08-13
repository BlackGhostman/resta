/**
 * Archivo para manejar las llamadas a las APIs PHP
 * Sistema de Restaurante POS
 */

class RestauranteAPI {
    constructor() {
        this.baseURL = window.location.origin + window.location.pathname.replace('index.html', '');
    }

    /**
     * Realizar petición HTTP
     */
    async request(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Error en la petición');
            }
            
            return data;
        } catch (error) {
            console.error('Error en API:', error);
            throw error;
        }
    }

    /**
     * Obtener todas las familias
     */
    async obtenerFamilias() {
        return await this.request(`${this.baseURL}api/articulos.php?accion=familias`);
    }

    /**
     * Obtener artículos por familia
     */
    async obtenerArticulosPorFamilia(idFamilia = null) {
        const url = idFamilia 
            ? `${this.baseURL}api/articulos.php?accion=por_familia&id_familia=${idFamilia}`
            : `${this.baseURL}api/articulos.php?accion=por_familia`;
        return await this.request(url);
    }

    /**
     * Buscar artículos por nombre
     */
    async buscarArticulos(nombre) {
        return await this.request(`${this.baseURL}api/articulos.php?accion=buscar&nombre=${encodeURIComponent(nombre)}`);
    }

    /**
     * Obtener todas las mesas
     */
    async obtenerMesas() {
        return await this.request(`${this.baseURL}api/mesas.php`);
    }

    /**
     * Obtener mesas disponibles
     */
    async obtenerMesasDisponibles() {
        return await this.request(`${this.baseURL}api/mesas.php?accion=disponibles`);
    }

    /**
     * Cambiar estado de mesa
     */
    async cambiarEstadoMesa(idMesa, nuevoEstado) {
        return await this.request(`${this.baseURL}api/mesas.php`, {
            method: 'PUT',
            body: JSON.stringify({
                id: idMesa,
                estado: nuevoEstado
            })
        });
    }
}

// Instancia global de la API
const api = new RestauranteAPI();
