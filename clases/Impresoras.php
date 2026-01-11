<?php
require_once __DIR__ . '/../config/conexion.php';

class Impresoras {
    private $db;

    public function __construct() {
        $this->db = obtenerConexion();
    }

    public function obtenerTodos() {
        $sql = "SELECT * FROM impresoras ORDER BY nombre ASC";
        return $this->db->consultar($sql);
    }

    public function obtenerPorId($id) {
        $sql = "SELECT * FROM impresoras WHERE id_impresora = ?";
        $result = $this->db->consultar($sql, [$id]);
        return !empty($result) ? $result[0] : null;
    }

    public function crear($datos) {
        $sql = "INSERT INTO impresoras (nombre, ubicacion, tipo, estado) VALUES (?, ?, ?, ?)";
        return $this->db->ejecutar($sql, [
            $datos['nombre'], 
            $datos['ubicacion'] ?? '', 
            $datos['tipo'] ?? 'general', 
            $datos['estado'] ?? 'activa'
        ]);
    }

    public function actualizar($id, $datos) {
        $sql = "UPDATE impresoras SET nombre = ?, ubicacion = ?, tipo = ?, estado = ? WHERE id_impresora = ?";
        return $this->db->ejecutar($sql, [
            $datos['nombre'], 
            $datos['ubicacion'] ?? '', 
            $datos['tipo'] ?? 'general', 
            $datos['estado'] ?? 'activa',
            $id
        ]);
    }

    public function eliminar($id) {
        $sql = "DELETE FROM impresoras WHERE id_impresora = ?";
        return $this->db->ejecutar($sql, [$id]);
    }
}
?>
