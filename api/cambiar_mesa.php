<?php
header('Content-Type: application/json');
include '../config/conexion.php';

$db = new ConexionDB();
$pdo = $db->getConexion();

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['source_id']) && isset($data['destination_id'])) {
    $source_id = $data['source_id'];
    $destination_id = $data['destination_id'];

    try {
        $pdo->beginTransaction();

        // 1. Actualizar todas las facturas abiertas para que apunten a la nueva mesa
        $stmt_update_factura = $pdo->prepare("UPDATE facturas_maestro SET id_mesa = :destination_id WHERE id_mesa = :source_id AND estado = 'credito'");
        $stmt_update_factura->execute(['destination_id' => $destination_id, 'source_id' => $source_id]);

        // 2. Marcar la mesa de origen como disponible
        $stmt_free_source = $pdo->prepare("UPDATE salones_mesas SET estado = 'disponible' WHERE id_salones_mesas = :source_id");
        $stmt_free_source->execute(['source_id' => $source_id]);

        // 3. Ocupar la mesa de destino
        $stmt_occupy_destination = $pdo->prepare("UPDATE salones_mesas SET estado = 'ocupada' WHERE id_salones_mesas = :destination_id");
        $stmt_occupy_destination->execute(['destination_id' => $destination_id]);

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
