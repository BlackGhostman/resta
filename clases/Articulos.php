<?php
require_once '../config/conexion.php';

/**
 * Clase para manejar los artículos del restaurante
 */
class Articulos {
    private $db;
    
    public function __construct() {
        $this->db = obtenerConexion();
    }
    
    /**
     * Obtener todos los artículos por familia
     */
    public function obtenerPorFamilia($idFamilia = null) {
        try {
            if ($idFamilia) {
                $sql = "SELECT a.*, f.descripcion as familia_nombre, m.descripcion as medida_nombre 
                       FROM articulos a 
                       LEFT JOIN familias f ON a.id_familia = f.id_familias
                       LEFT JOIN medidas m ON a.id_medida = m.id_medidas
                       WHERE a.id_familia = ?";
                return $this->db->consultar($sql, [$idFamilia]);
            } else {
                $sql = "SELECT a.*, f.descripcion as familia_nombre, m.descripcion as medida_nombre 
                       FROM articulos a 
                       LEFT JOIN familias f ON a.id_familia = f.id_familias
                       LEFT JOIN medidas m ON a.id_medida = m.id_medidas
                       ORDER BY a.nombre";
                return $this->db->consultar($sql);
            }
        } catch (Exception $e) {
            throw new Exception("Error al obtener artículos: " . $e->getMessage());
        }
    }
    
    /**
     * Obtener artículo por ID
     */
    public function obtenerPorId($id) {
        try {
            $sql = "SELECT a.*, f.descripcion as familia_nombre, m.descripcion as medida_nombre 
                   FROM articulos a 
                   LEFT JOIN familias f ON a.id_familia = f.id_familias
                   LEFT JOIN medidas m ON a.id_medida = m.id_medidas
                   WHERE a.id_articulos = ?";
            $resultado = $this->db->consultar($sql, [$id]);
            return !empty($resultado) ? $resultado[0] : null;
        } catch (Exception $e) {
            throw new Exception("Error al obtener artículo: " . $e->getMessage());
        }
    }
    
    /**
     * Buscar artículos por nombre
     */
    public function buscarPorNombre($nombre) {
        try {
            $sql = "SELECT a.*, f.descripcion as familia_nombre 
                   FROM articulos a 
                   LEFT JOIN familias f ON a.id_familia = f.id_familias
                   WHERE a.nombre LIKE ? 
                   ORDER BY a.nombre";
            return $this->db->consultar($sql, ["%$nombre%"]);
        } catch (Exception $e) {
            throw new Exception("Error al buscar artículos: " . $e->getMessage());
        }
    }
    
    /**
     * Actualizar existencia de artículo
     */
    public function actualizarExistencia($idArticulo, $nuevaExistencia) {
        try {
            $sql = "UPDATE articulos SET existencia = ? WHERE id_articulos = ?";
            return $this->db->ejecutar($sql, [$nuevaExistencia, $idArticulo]);
        } catch (Exception $e) {
            throw new Exception("Error al actualizar existencia: " . $e->getMessage());
        }
    }
    
    /**
     * Verificar stock disponible
     */
    public function verificarStock($idArticulo, $cantidadRequerida) {
        try {
            $articulo = $this->obtenerPorId($idArticulo);
            if (!$articulo) {
                return false;
            }
            return $articulo['existencia'] >= $cantidadRequerida;
        } catch (Exception $e) {
            throw new Exception("Error al verificar stock: " . $e->getMessage());
        }
    }
}
?>
