<?php
require_once __DIR__ . '/../config/conexion.php';

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

    /**
     * Crear una nueva familia
     */
    public function crear($datos) {
        try {
            $sql = "INSERT INTO familias (descripcion) VALUES (?)";
            $params = [$datos['descripcion']];
            return $this->db->ejecutar($sql, $params);
        } catch (Exception $e) {
            // Capturar violación de restricción UNIQUE
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                throw new Exception("La descripción de la familia ya existe.");
            }
            throw new Exception("Error al crear la familia: " . $e->getMessage());
        }
    }

    /**
     * Actualizar una familia
     */
    public function actualizar($id, $datos) {
        try {
            $sql = "UPDATE familias SET descripcion = ? WHERE id_familias = ?";
            $params = [$datos['descripcion'], $id];
            return $this->db->ejecutar($sql, $params);
        } catch (Exception $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                throw new Exception("La descripción de la familia ya existe.");
            }
            throw new Exception("Error al actualizar la familia: " . $e->getMessage());
        }
    }

    /**
     * Eliminar una familia
     */
    public function eliminar($id) {
        try {
            $sql = "DELETE FROM familias WHERE id_familias = ?";
            return $this->db->ejecutar($sql, [$id]);
        } catch (Exception $e) {
            // Capturar violación de restricción de clave foránea
            if (strpos($e->getMessage(), 'foreign key constraint fails') !== false) {
                throw new Exception("No se puede eliminar la familia porque tiene artículos asociados.");
            }
            throw new Exception("Error al eliminar la familia: " . $e->getMessage());
        }
    }
}
?>
