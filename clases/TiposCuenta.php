<?php
require_once __DIR__ . '/../config/conexion.php';

class TiposCuenta {
    private $db;

    public function __construct() {
        $this->db = obtenerConexion();
    }

    public function obtenerTodos() {
        $sql = "SELECT * FROM tipos_cuenta ORDER BY nombre ASC";
        return $this->db->consultar($sql);
    }

    public function obtenerPorId($id) {
        $sql = "SELECT * FROM tipos_cuenta WHERE id_tipo_cuenta = ?";
        $result = $this->db->consultar($sql, [$id]);
        return !empty($result) ? $result[0] : null;
    }

    public function crear($datos) {
        $sql = "INSERT INTO tipos_cuenta (nombre) VALUES (?)";
        return $this->db->ejecutar($sql, [$datos['nombre']]);
    }

    public function actualizar($id, $datos) {
        $sql = "UPDATE tipos_cuenta SET nombre = ? WHERE id_tipo_cuenta = ?";
        return $this->db->ejecutar($sql, [$datos['nombre'], $id]);
    }

    public function eliminar($id) {
        $sql = "DELETE FROM tipos_cuenta WHERE id_tipo_cuenta = ?";
        return $this->db->ejecutar($sql, [$id]);
    }
}
?>
