<?php
require_once __DIR__ . '/../config/conexion.php';

class Proveedores {
    private $db;

    public function __construct() {
        $this->db = obtenerConexion();
    }

    // Obtener todos los proveedores
    public function obtenerTodos() {
        $sql = "SELECT * FROM proveedores ORDER BY nombre ASC";
        return $this->db->consultar($sql);
    }

    // Obtener un proveedor por su ID
    public function obtenerPorId($id) {
        $sql = "SELECT * FROM proveedores WHERE id_proveedores = ?";
        $params = [$id];
        $result = $this->db->consultar($sql, $params);
        return !empty($result) ? $result[0] : null;
    }

    // Crear un nuevo proveedor
    public function crear($datos) {
        $sql = "INSERT INTO proveedores (nombre, contacto, cedula_juridica, direccion, email, telefono, fecha_inicio_relacion) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $params = [
            $datos['nombre'],
            $datos['contacto'],
            $datos['cedula_juridica'],
            $datos['direccion'],
            $datos['email'],
            $datos['telefono'],
            $datos['fecha_inicio_relacion']
        ];
        return $this->db->ejecutar($sql, $params);
    }

    // Actualizar un proveedor
    public function actualizar($id, $datos) {
        $sql = "UPDATE proveedores SET nombre = ?, contacto = ?, cedula_juridica = ?, direccion = ?, email = ?, telefono = ?, fecha_inicio_relacion = ? WHERE id_proveedores = ?";
        $params = [
            $datos['nombre'],
            $datos['contacto'],
            $datos['cedula_juridica'],
            $datos['direccion'],
            $datos['email'],
            $datos['telefono'],
            $datos['fecha_inicio_relacion'],
            $id
        ];
        return $this->db->ejecutar($sql, $params);
    }

    // Eliminar un proveedor
    public function eliminar($id) {
        $sql = "DELETE FROM proveedores WHERE id_proveedores = ?";
        $params = [$id];
        return $this->db->ejecutar($sql, $params);
    }
}
?>
