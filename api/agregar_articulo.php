<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../config/conexion.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id_mesa']) || !isset($data['id_articulo']) || !isset($data['cantidad'])) {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos.']);
    exit;
}

$id_mesa = $data['id_mesa'];
$id_articulo = $data['id_articulo'];
$cantidad = $data['cantidad'];

$db = obtenerConexion();

try {
    $db->iniciarTransaccion();

    // 1. Obtener el id_factura de la mesa que está en estado 'credito'
    $sql_factura_id = "SELECT id_factura FROM facturas_maestro WHERE id_mesa = ? AND estado = 'credito'";
    $factura_maestro = $db->consultar($sql_factura_id, [$id_mesa]);

    if (empty($factura_maestro)) {
        throw new Exception("No se encontró una factura abierta para esta mesa.");
    }
    $id_factura = $factura_maestro[0]['id_factura'];

    // 2. Obtener el precio del artículo
    $sql_articulo = "SELECT precio FROM articulos WHERE id_articulo = ?";
    $articulo = $db->consultar($sql_articulo, [$id_articulo]);

    if (empty($articulo)) {
        throw new Exception("El artículo no existe.");
    }
    $precio_unitario = $articulo[0]['precio'];

    // 3. Insertar en facturas_detalle
    $sql_detalle = "INSERT INTO facturas_detalle (id_factura, id_articulo, cantidad, precio_unitario) VALUES (?, ?, ?, ?)";
    $db->ejecutar($sql_detalle, [$id_factura, $id_articulo, $cantidad, $precio_unitario]);

    // 4. Actualizar los totales en facturas_maestro
    $monto_agregado = $cantidad * $precio_unitario;
    $sql_update_maestro = "UPDATE facturas_maestro SET subtotal = subtotal + ?, total_factura = total_factura + ? WHERE id_factura = ?";
    $db->ejecutar($sql_update_maestro, [$monto_agregado, $monto_agregado, $id_factura]);

    $db->confirmarTransaccion();

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    $db->cancelarTransaccion();
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error en la base de datos: ' . $e->getMessage()]);
}
?>
