<?php
require_once __DIR__ . '/../config/conexion.php';

class TiposAjusteInventario {
    private $db;

    public function __construct() {
        $this->db = obtenerConexion();
    }

    public function obtenerTodos() {
        $sql = "SELECT 
                    t.id_tipos_ajuste, 
                    t.nombre, 
                    t.tipo_cuenta,
                    tc.nombre as tipo_cuenta_nombre
                FROM tipos_ajuste_inventario t
                JOIN tipos_cuenta tc ON t.tipo_cuenta = tc.id_tipo_cuenta
                ORDER BY t.nombre ASC";
        return $this->db->consultar($sql);
    }

    public function obtenerPorId($id) {
        $sql = "SELECT * FROM tipos_ajuste_inventario WHERE id_tipos_ajuste = ?";
        $result = $this->db->consultar($sql, [$id]);
        return !empty($result) ? $result[0] : null;
    }

    public function crear($datos) {
        $sql = "INSERT INTO tipos_ajuste_inventario (nombre, tipo_cuenta) VALUES (?, ?)";
        return $this->db->ejecutar($sql, [$datos['nombre'], $datos['tipo_cuenta']]);
    }

    public function actualizar($id, $datos) {
        $sql = "UPDATE tipos_ajuste_inventario SET nombre = ?, tipo_cuenta = ? WHERE id_tipos_ajuste = ?";
        return $this->db->ejecutar($sql, [$datos['nombre'], $datos['tipo_cuenta'], $id]);
    }

    public function eliminar($id) {
        $sql = "DELETE FROM tipos_ajuste_inventario WHERE id_tipos_ajuste = ?";
        return $this->db->ejecutar($sql, [$id]);
    }
}
?>
