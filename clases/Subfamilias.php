<?php
require_once __DIR__ . '/../config/conexion.php';

class Subfamilias {
    private $db;

    public function __construct() {
        $this->db = obtenerConexion();
    }

    // Obtener todas las subfamilias con el nombre de la familia
    public function obtenerTodos() {
        $sql = "SELECT sf.id_subfamilias, sf.descripcion, sf.id_familia, f.descripcion as familia_descripcion 
                FROM subfamilias sf
                JOIN familias f ON sf.id_familia = f.id_familias
                ORDER BY sf.descripcion ASC";
        return $this->db->consultar($sql);
    }

    // Obtener una subfamilia por su ID
    public function obtenerPorId($id) {
        $sql = "SELECT * FROM subfamilias WHERE id_subfamilias = ?";
        $params = [$id];
        $result = $this->db->consultar($sql, $params);
        return !empty($result) ? $result[0] : null;
    }

    // Crear una nueva subfamilia
    public function crear($datos) {
        $sql = "INSERT INTO subfamilias (descripcion, id_familia) VALUES (?, ?)";
        $params = [
            $datos['descripcion'],
            $datos['id_familia']
        ];
        return $this->db->ejecutar($sql, $params);
    }

    // Actualizar una subfamilia
    public function actualizar($id, $datos) {
        $sql = "UPDATE subfamilias SET descripcion = ?, id_familia = ? WHERE id_subfamilias = ?";
        $params = [
            $datos['descripcion'],
            $datos['id_familia'],
            $id
        ];
        return $this->db->ejecutar($sql, $params);
    }

    // Eliminar una subfamilia
    public function eliminar($id) {
        $sql = "DELETE FROM subfamilias WHERE id_subfamilias = ?";
        $params = [$id];
        return $this->db->ejecutar($sql, $params);
    }
}
?>
