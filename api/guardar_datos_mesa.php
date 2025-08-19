<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../config/conexion.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id_mesa']) || !isset($data['cantidad_personas'])) {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos.']);
    exit;
}

$id_mesa = $data['id_mesa'];
$cantidad_personas = $data['cantidad_personas'];
$nombre_cliente = isset($data['nombre_cliente']) ? $data['nombre_cliente'] : '';

$db = obtenerConexion();

try {
    $db->iniciarTransaccion();

    // 1. Crear la nueva factura en facturas_maestro
    $sql_factura = "INSERT INTO facturas_maestro (fecha, id_mesa, cantidad_personas, nombre_cliente, estado, subtotal, monto_descuento, monto_impuestos, total_factura) VALUES (GETDATE(), ?, ?, ?, 'credito', 0, 0, 0, 0)";
    $db->ejecutar($sql_factura, [$id_mesa, $cantidad_personas, $nombre_cliente]);

    // 2. Actualizar el estado de la mesa en la tabla 'salones_mesas'
    $sql_mesa = "UPDATE salones_mesas SET estado = 'ocupada' WHERE id_salones_mesas = ?";
    $db->ejecutar($sql_mesa, [$id_mesa]);

    $db->confirmarTransaccion();

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    $db->cancelarTransaccion();
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error en la base de datos: ' . $e->getMessage()]);
}
