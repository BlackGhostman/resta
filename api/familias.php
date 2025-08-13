<?php
require '..\config\conexion.php';

header('Content-Type: application/json');

try {
    $db = obtenerConexion();
    $sql = "SELECT DISTINCT f.id_familias, f.descripcion FROM familias f INNER JOIN articulos a ON f.id_familias = a.id_familia ORDER BY f.descripcion";
    $familias = $db->consultar($sql);
    
    echo json_encode($familias);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al obtener familias: ' . $e->getMessage()]);
} finally {
    if (isset($db)) {
        $db->cerrarConexion();
    }
}
?>
