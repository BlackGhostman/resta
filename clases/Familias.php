<?php
require_once '../config/conexion.php';

/**
 * Clase para manejar las familias de productos
 */
class Familias {
    private $db;
    
    public function __construct() {
        $this->db = obtenerConexion();
    }
    
    /**
     * Obtener todas las familias
     */
    public function obtenerTodas() {
        try {
            $sql = "SELECT * FROM familias ORDER BY descripcion";
            return $this->db->consultar($sql);
        } catch (Exception $e) {
            throw new Exception("Error al obtener familias: " . $e->getMessage());
        }
    }
    
    /**
     * Obtener familia por ID
     */
    public function obtenerPorId($id) {
        try {
            $sql = "SELECT * FROM familias WHERE id_familias = ?";
            $resultado = $this->db->consultar($sql, [$id]);
            return !empty($resultado) ? $resultado[0] : null;
        } catch (Exception $e) {
            throw new Exception("Error al obtener familia: " . $e->getMessage());
        }
    }
    
    /**
     * Obtener familias con conteo de artículos
     */
    public function obtenerConConteoArticulos() {
        try {
            $sql = "SELECT f.*, COUNT(a.id_articulos) as total_articulos
                   FROM familias f
                   LEFT JOIN articulos a ON f.id_familias = a.id_familia
                   GROUP BY f.id_familias, f.descripcion
                   ORDER BY f.descripcion";
            return $this->db->consultar($sql);
        } catch (Exception $e) {
            throw new Exception("Error al obtener familias con conteo: " . $e->getMessage());
        }
    }
}
?>
