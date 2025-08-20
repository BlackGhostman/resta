<?php
header('Content-Type: application/json');
include '../config/conexion.php';
include '../clases/Mesas.php';

$mesas = new Mesas();
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id_mesa'])) {
    $id_mesa = $data['id_mesa'];

    try {
        $pdo->beginTransaction();

        // 1. Obtener detalles de la mesa para asociar el cliente
        $mesa_details = $mesas->getMesaById($id_mesa);
        if (!$mesa_details) {
            throw new Exception("La mesa no existe.");
        }
        
        $id_cliente = $mesa_details['id_cliente'];

        // 2. Crear una nueva factura para esta mesa
        $stmt = $pdo->prepare(
            "INSERT INTO facturas (id_mesa, id_cliente, fecha, estado, total) 
             VALUES (:id_mesa, :id_cliente, NOW(), 'abierta', 0)"
        );
        
        $stmt->execute([
            'id_mesa' => $id_mesa,
            'id_cliente' => $id_cliente
        ]);

        $new_factura_id = $pdo->lastInsertId();

        $pdo->commit();

        echo json_encode([
            'success' => true, 
            'message' => 'Nueva cuenta creada correctamente.',
            'id_factura' => $new_factura_id
        ]);

    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'error' => 'Error al crear la cuenta: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'No se proporcionó el ID de la mesa.']);
}
?>
