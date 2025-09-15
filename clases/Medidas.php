<?php
require_once __DIR__ . '/../config/conexion.php';

class Medidas {
    private $db;

    public function __construct() {
        $this->db = obtenerConexion();
    }

    public function obtenerTodos() {
        $sql = "SELECT * FROM medidas ORDER BY descripcion ASC";
        return $this->db->consultar($sql);
    }

    public function obtenerPorId($id) {
        $sql = "SELECT * FROM medidas WHERE id_medidas = ?";
        $result = $this->db->consultar($sql, [$id]);
        return !empty($result) ? $result[0] : null;
    }

    public function crear($datos) {
        $sql = "INSERT INTO medidas (descripcion, abreviatura) VALUES (?, ?)";
        return $this->db->ejecutar($sql, [$datos['descripcion'], $datos['abreviatura']]);
    }

    public function actualizar($id, $datos) {
        $sql = "UPDATE medidas SET descripcion = ?, abreviatura = ? WHERE id_medidas = ?";
        return $this->db->ejecutar($sql, [$datos['descripcion'], $datos['abreviatura'], $id]);
    }

    public function eliminar($id) {
        $sql = "DELETE FROM medidas WHERE id_medidas = ?";
        return $this->db->ejecutar($sql, [$id]);
    }
}
?>
