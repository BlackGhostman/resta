<?php
require '..\config\conexion.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permitir peticiones de cualquier origen

$id_familia = isset($_GET['familia_id']) ? (int)$_GET['familia_id'] : 0;

if ($id_familia <= 0) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'El familia_id es requerido y debe ser un número válido.']);
    exit;
}

try {
    $db = obtenerConexion();
    $sql = "SELECT id_articulos, nombre, precio_venta as precio, url_imagen FROM articulos WHERE id_familia = ? ORDER BY nombre";
    $parametros = [$id_familia];
    
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
