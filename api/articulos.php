<?php
require '..\config\conexion.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permitir peticiones de cualquier origen

$id_familia = isset($_GET['id_familia']) ? (int)$_GET['id_familia'] : 0;

if ($id_familia <= 0) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'El id_familia es requerido y debe ser un número válido.']);
    exit;
}

try {
    $db = obtenerConexion();
    // Se asume que la tabla de artículos tiene las columnas: id_articulo, descripcion, id_familia
    $sql = "SELECT id_articulos, nombre FROM articulos WHERE id_familia = :id_familia ORDER BY nombre";
    $parametros = [':id_familia' => $id_familia];
    
    $articulos = $db->consultar($sql, $parametros);
    
    echo json_encode($articulos);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al obtener artículos: ' . $e->getMessage()]);
} finally {
    if (isset($db)) {
        $db->cerrarConexion();
    }
}
?>
