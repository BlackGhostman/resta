<?php
require_once __DIR__ . '/../config/conexion.php';

class Roles {
    private $db;

    public function __construct() {
        $this->db = obtenerConexion();
    }

    public function obtenerTodos() {
        $sql = "SELECT id_roles, nombre, descripcion FROM roles ORDER BY nombre ASC";
        return $this->db->consultar($sql);
    }

    public function obtenerPorId($id) {
        $sql = "SELECT id_roles, nombre, descripcion FROM roles WHERE id_roles = ?";
        $result = $this->db->consultar($sql, [$id]);
        return !empty($result) ? $result[0] : null;
    }

    public function crear($datos) {
        $sql = "INSERT INTO roles (nombre, descripcion) VALUES (?, ?)";
        $params = [$datos['nombre'], $datos['descripcion']];
        return $this->db->ejecutar($sql, $params);
    }

    public function actualizar($id, $datos) {
        $sql = "UPDATE roles SET nombre = ?, descripcion = ? WHERE id_roles = ?";
        $params = [$datos['nombre'], $datos['descripcion'], $id];
        return $this->db->ejecutar($sql, $params);
    }

    public function eliminar($id) {
        $sql = "DELETE FROM roles WHERE id_roles = ?";
        return $this->db->ejecutar($sql, [$id]);
    }
}
?>
