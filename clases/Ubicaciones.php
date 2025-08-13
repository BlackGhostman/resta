<?php
require_once '../config/conexion.php';

class Ubicaciones extends ConexionDB {

    public function __construct() {
        parent::__construct();
    }

    public function listar() {
        $sql = "SELECT id_ubicaciones_mesas, nombre_ubicacion, estado FROM ubicaciones_mesas WHERE estado = 'Activo' ORDER BY nombre_ubicacion ASC";
        $stmt = $this->getConexion()->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarPorId($id) {
        $sql = "SELECT id_ubicaciones_mesas, nombre_ubicacion, estado FROM ubicaciones_mesas WHERE id_ubicaciones_mesas = :id";
        $stmt = $this->getConexion()->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function crear($nombre) {
        $sql = "INSERT INTO ubicaciones_mesas (nombre_ubicacion, estado) VALUES (:nombre, 'Activo')";
        $stmt = $this->getConexion()->prepare($sql);
        $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
        if ($stmt->execute()) {
            return $this->getConexion()->lastInsertId();
        }
        return false;
    }

    public function actualizar($id, $nombre) {
        $sql = "UPDATE ubicaciones_mesas SET nombre_ubicacion = :nombre WHERE id_ubicaciones_mesas = :id";
        $stmt = $this->getConexion()->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
        return $stmt->execute();
    }

    public function eliminar($id) {
        $sql = "UPDATE ubicaciones_mesas SET estado = 'Inactivo' WHERE id_ubicaciones_mesas = :id";
        $stmt = $this->getConexion()->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>
