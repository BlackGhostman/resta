<?php
error_reporting(0);
header('Content-Type: application/json');
include '../config/conexion.php';

$db = new ConexionDB();
$pdo = $db->getConexion();

$id_mesa = null;
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id_mesa'])) {
    $id_mesa = $data['id_mesa'];
} elseif (isset($_GET['id_mesa'])) {
    $id_mesa = $_GET['id_mesa'];
}

if ($id_mesa) {

    try {
        // Iniciar transacción
        $pdo->beginTransaction();

        // 1. Encontrar todas las facturas abiertas para esa mesa
        $stmt_facturas = $pdo->prepare("SELECT id_facturas_maestro FROM facturas_maestro WHERE id_mesa = :id_mesa AND estado = 'credito'");
        $stmt_facturas->execute(['id_mesa' => $id_mesa]);
        $facturas_abiertas = $stmt_facturas->fetchAll(PDO::FETCH_ASSOC);

        // 2. Cambiar estado de las facturas a 'anulado' en lugar de borrarlas
        $stmt_anular_facturas = $pdo->prepare("UPDATE facturas_maestro SET estado = 'anulado' WHERE id_mesa = :id_mesa AND estado = 'credito'");
        $stmt_anular_facturas->execute(['id_mesa' => $id_mesa]);

        // 4. Actualizar el estado de la mesa a 'disponible'
        $stmt_update_mesa = $pdo->prepare("UPDATE salones_mesas SET estado = 'disponible' WHERE id_salones_mesas = :id_mesa");
        $stmt_update_mesa->execute(['id_mesa' => $id_mesa]);

        // Confirmar transacción
        $pdo->commit();

        echo json_encode(['success' => true, 'message' => 'Mesa desocupada y pedido cancelado correctamente.']);

    } catch (Exception $e) {
        // Revertir transacción en caso de error
        $pdo->rollBack();
        echo json_encode(['success' => false, 'error' => 'Error al desocupar la mesa: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'No se proporcionó el ID de la mesa.']);
}
?>
