<?php
header('Content-Type: application/json');
include '../config/conexion.php';

$db = new ConexionDB();
$pdo = $db->getConexion();

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id_mesa'])) {
    $id_mesa = $data['id_mesa'];

    try {
        $pdo->beginTransaction();

        // Crear una nueva factura para esta mesa
        $stmt = $pdo->prepare(
            "INSERT INTO facturas_maestro (id_mesa, fecha, estado, subtotal, monto_descuento, monto_impuestos, total_factura) 
             VALUES (:id_mesa, GETDATE(), 'credito', 0, 0, 0, 0)"
        );
        
        $stmt->execute(['id_mesa' => $id_mesa]);

        $new_factura_id = $pdo->lastInsertId();

        // También actualizamos la mesa a 'ocupada'
        $stmt_update_mesa = $pdo->prepare("UPDATE salones_mesas SET estado = 'ocupada' WHERE id_salones_mesas = :id_mesa");
        $stmt_update_mesa->execute(['id_mesa' => $id_mesa]);

        $pdo->commit();

        // Devolver la factura recién creada para que el frontend la use
        $stmt_factura = $pdo->prepare("SELECT * FROM facturas_maestro WHERE id_facturas_maestro = :id_factura");
        $stmt_factura->execute(['id_factura' => $new_factura_id]);
        $factura_creada = $stmt_factura->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true, 
            'message' => 'Nueva cuenta creada correctamente.',
            'factura' => $factura_creada
        ]);

    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Error al crear la cuenta: ' . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No se proporcionó el ID de la mesa.']);
}
?>
