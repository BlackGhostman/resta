<?php
require_once __DIR__ . '/../config/conexion.php';

class TiposPago {
    private $db;

    public function __construct() {
        $this->db = obtenerConexion();
    }

    public function obtenerTodos() {
        $sql = "SELECT * FROM tipos_pago ORDER BY descripcion ASC";
        return $this->db->consultar($sql);
    }

    public function obtenerPorId($id) {
        $sql = "SELECT * FROM tipos_pago WHERE id_tipos_pago = ?";
        $result = $this->db->consultar($sql, [$id]);
        return !empty($result) ? $result[0] : null;
    }

    public function crear($datos) {
        $sql = "INSERT INTO tipos_pago (descripcion) VALUES (?)";
        return $this->db->ejecutar($sql, [$datos['descripcion']]);
    }

    public function actualizar($id, $datos) {
        $sql = "UPDATE tipos_pago SET descripcion = ? WHERE id_tipos_pago = ?";
        return $this->db->ejecutar($sql, [$datos['descripcion'], $id]);
    }

    public function eliminar($id) {
        $sql = "DELETE FROM tipos_pago WHERE id_tipos_pago = ?";
        return $this->db->ejecutar($sql, [$id]);
    }
}
?>
