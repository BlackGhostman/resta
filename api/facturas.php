<?php
header('Content-Type: application/json');
include '../config/conexion.php';

$db = new ConexionDB();
$pdo = $db->getConexion();

if (isset($_GET['id_mesa'])) {
    $id_mesa = $_GET['id_mesa'];

    try {
        // Buscar todas las facturas en estado 'credito' para esa mesa
        $stmt = $pdo->prepare("SELECT * FROM facturas_maestro WHERE id_mesa = :id_mesa AND estado = 'credito' ORDER BY id_facturas_maestro ASC");
        $stmt->execute(['id_mesa' => $id_mesa]);
        $facturas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Si no hay facturas, se devuelve un array vacío para que el frontend cree una nueva.
        echo json_encode(['success' => true, 'facturas' => $facturas]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Error en la base de datos: ' . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No se proporcionó el ID de la mesa.']);
}
?>
