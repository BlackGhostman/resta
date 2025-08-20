<?php
header('Content-Type: application/json');
include '../config/conexion.php';

if (isset($_GET['id_mesa'])) {
    $id_mesa = $_GET['id_mesa'];

    try {
        // Buscar todas las facturas abiertas para esa mesa
        $stmt = $pdo->prepare("SELECT * FROM facturas WHERE id_mesa = :id_mesa AND estado = 'abierta' ORDER BY id ASC");
        $stmt->execute(['id_mesa' => $id_mesa]);
        $facturas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($facturas) {
            echo json_encode(['success' => true, 'facturas' => $facturas]);
        } else {
            echo json_encode(['success' => false, 'error' => 'No se encontraron facturas abiertas para esta mesa.']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Error en la base de datos: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'No se proporcionó el ID de la mesa.']);
}
?>
