<?php
require_once '../config/conexion.php';

/**
 * Clase para manejar las mesas del restaurante
 */
class Mesas {
    private $db;
    
    public function __construct() {
        $this->db = obtenerConexion();
    }
    
    /**
     * Obtener todas las mesas
     */
    public function obtenerTodas() {
        try {
            $sql = "SELECT * FROM salones_mesas ORDER BY identificador";
            return $this->db->consultar($sql);
        } catch (Exception $e) {
            throw new Exception("Error al obtener mesas: " . $e->getMessage());
        }
    }
    
    /**
     * Obtener mesa por ID
     */
    public function obtenerPorId($id) {
        try {
            $sql = "SELECT * FROM salones_mesas WHERE id_salones_mesas = ?";
            $resultado = $this->db->consultar($sql, [$id]);
            return !empty($resultado) ? $resultado[0] : null;
        } catch (Exception $e) {
            throw new Exception("Error al obtener mesa: " . $e->getMessage());
        }
    }
    
    /**
     * Cambiar estado de mesa
     */
    public function cambiarEstado($idMesa, $nuevoEstado) {
        try {
            $sql = "UPDATE salones_mesas SET estado = ? WHERE id_salones_mesas = ?";
            return $this->db->ejecutar($sql, [$nuevoEstado, $idMesa]);
        } catch (Exception $e) {
            throw new Exception("Error al cambiar estado de mesa: " . $e->getMessage());
        }
    }
    
    /**
     * Obtener mesas disponibles
     */
    public function obtenerDisponibles() {
        try {
            $sql = "SELECT * FROM salones_mesas WHERE estado = 'disponible' ORDER BY identificador";
            return $this->db->consultar($sql);
        } catch (Exception $e) {
            throw new Exception("Error al obtener mesas disponibles: " . $e->getMessage());
        }
    }
}
?>
