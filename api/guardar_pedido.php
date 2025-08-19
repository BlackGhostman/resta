<?php
header('Content-Type: application/json');
require_once '../config/conexion.php';
require_once '../clases/Facturas.php';

$db = new ConexionDB();
$factura = new Facturas($db);

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id_mesa']) || !isset($data['articulos']) || empty($data['articulos'])) {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos. Se requiere id_mesa y una lista de artículos.']);
    http_response_code(400);
    exit;
}

try {
    $id_mesa = $data['id_mesa'];
    $articulos = $data['articulos'];

    $resultado = $factura->guardarPedidoCompleto($id_mesa, $articulos);

    if ($resultado) {
        echo json_encode(['success' => true, 'message' => 'Pedido guardado correctamente.']);
    } else {
        throw new Exception('No se pudo guardar el pedido.');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
