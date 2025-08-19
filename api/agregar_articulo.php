<?php
header('Content-Type: application/json');

require_once '../clases/Facturas.php';

$facturas = new Facturas();

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id_mesa']) || !isset($data['id_articulo']) || !isset($data['cantidad'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
    exit;
}

try {
    $resultado = $facturas->agregarArticulo($data['id_mesa'], $data['id_articulo'], $data['cantidad']);
    echo json_encode(['success' => $resultado]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error al agregar artículo: ' . $e->getMessage()]);
}
?>
