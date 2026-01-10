<?php
header('Content-Type: application/json');
require_once '../config/conexion.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id_factura'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'ID de factura no proporcionado.']);
    exit;
}

$id_factura = $data['id_factura'];
$motivo = isset($data['motivo']) ? $data['motivo'] : 'Anulación por usuario';

$db = new ConexionDB();
$pdo = $db->getConexion();

try {
    // 1. Check current status
    $stmt = $pdo->prepare("SELECT estado FROM facturas_maestro WHERE id_facturas_maestro = :id");
    $stmt->execute([':id' => $id_factura]);
    $factura = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$factura) {
        throw new Exception("Factura no encontrada.");
    }

    if ($factura['estado'] === 'anulada') {
        throw new Exception("La factura ya está anulada.");
    }

    // 2. Update status to 'anulada'
    // In a real system, we might also want to restock inventory if the invoice deducted it.
    // For now, we just update the status as requested.
    $updateStmt = $pdo->prepare("UPDATE facturas_maestro SET estado = 'anulada' WHERE id_facturas_maestro = :id");
    $updateStmt->execute([':id' => $id_factura]);

    echo json_encode(['success' => true, 'message' => 'Factura anulada correctamente.']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
