<?php
require '..\config\conexion.php';

header('Content-Type: application/json');

try {
    $db = obtenerConexion();
    $sql = "SELECT id_familias as id, descripcion as nombre FROM familias ORDER BY nombre";
    $familias = $db->consultar($sql);
    
    echo json_encode($familias);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al obtener familias: ' . $e->getMessage()]);
}
?>
