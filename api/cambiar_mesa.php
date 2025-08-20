<?php
header('Content-Type: application/json');
include '../config/conexion.php';
include '../clases/Facturas.php';
include '../clases/Mesas.php';

$facturas = new Facturas();
$mesas = new Mesas();
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['source_id']) && isset($data['destination_id'])) {
    $source_id = $data['source_id'];
    $destination_id = $data['destination_id'];

    try {
        $pdo->beginTransaction();

        // 1. Obtener datos de la mesa de origen antes de cambiarla
        $source_table_details = $mesas->getMesaById($source_id);
        if (!$source_table_details) {
            throw new Exception("La mesa de origen no existe.");
        }

        // 2. Encontrar la factura abierta para la mesa de origen
        $factura_abierta = $facturas->obtenerFacturaAbiertaPorMesa($source_id);
        if (!$factura_abierta) {
            throw new Exception("No se encontró una factura abierta para la mesa de origen.");
        }
        $id_factura = $factura_abierta['id_facturas'];

        // 3. Actualizar la factura para que apunte a la nueva mesa
        $stmt_update_factura = $pdo->prepare("UPDATE facturas SET id_mesa = :destination_id WHERE id_facturas = :id_factura");
        $stmt_update_factura->execute(['destination_id' => $destination_id, 'id_factura' => $id_factura]);

        // 4. Marcar la mesa de origen como disponible
        $stmt_free_source = $pdo->prepare("UPDATE mesas SET estado = 'disponible', id_cliente = NULL, cantidad_personas = 0 WHERE id = :source_id");
        $stmt_free_source->execute(['source_id' => $source_id]);

        // 5. Ocupar la mesa de destino con los datos de la de origen
        $stmt_occupy_destination = $pdo->prepare("UPDATE mesas SET estado = 'ocupada', id_cliente = :id_cliente, cantidad_personas = :cantidad_personas WHERE id = :destination_id");
        $stmt_occupy_destination->execute([
            'id_cliente' => $source_table_details['id_cliente'],
            'cantidad_personas' => $source_table_details['cantidad_personas'],
            'destination_id' => $destination_id
        ]);

        $pdo->commit();

        echo json_encode(['success' => true, 'message' => 'Mesa cambiada correctamente.']);

    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'error' => 'Error al cambiar la mesa: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Datos insuficientes para realizar el cambio.']);
}
?>
