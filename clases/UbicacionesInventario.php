<?php
require_once __DIR__ . '/../config/conexion.php';

class UbicacionesInventario {
    private $db;

    public function __construct() {
        $this->db = obtenerConexion();
    }

    public function obtenerTodos() {
        $sql = "SELECT * FROM ubicaciones_inventario ORDER BY descripcion ASC";
        return $this->db->consultar($sql);
    }

    public function obtenerPorId($id) {
        $sql = "SELECT * FROM ubicaciones_inventario WHERE id_ubicaciones_inventario = ?";
        $result = $this->db->consultar($sql, [$id]);
        return !empty($result) ? $result[0] : null;
    }

    public function crear($datos) {
        $sql = "INSERT INTO ubicaciones_inventario (descripcion) VALUES (?)";
        return $this->db->ejecutar($sql, [$datos['descripcion']]);
    }

    public function actualizar($id, $datos) {
        $sql = "UPDATE ubicaciones_inventario SET descripcion = ? WHERE id_ubicaciones_inventario = ?";
        return $this->db->ejecutar($sql, [$datos['descripcion'], $id]);
    }

    public function eliminar($id) {
        $sql = "DELETE FROM ubicaciones_inventario WHERE id_ubicaciones_inventario = ?";
        return $this->db->ejecutar($sql, [$id]);
    }
}
?>
