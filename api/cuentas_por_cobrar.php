<?php
header('Content-Type: application/json');
require_once '../config/conexion.php';

$db = new ConexionDB();
$pdo = $db->getConexion();

// Retrieve filters
$cliente = isset($_GET['cliente']) ? $_GET['cliente'] : '';
$fecha_inicio = isset($_GET['fecha_inicio']) ? $_GET['fecha_inicio'] : '';
$fecha_fin = isset($_GET['fecha_fin']) ? $_GET['fecha_fin'] : '';

// Base query: Get unpaid invoices (assuming 'credito' or 'pendiente' are the targets)
// Users typically want to see anything that IS NOT 'pagada' and NOT 'anulada'
$sql = "SELECT id_facturas_maestro, fecha, nombre_cliente, total_factura, estado, 
               (total_factura) as saldo_pendiente -- Assuming no partial payments for now
        FROM facturas_maestro 
        WHERE estado NOT IN ('pagada', 'anulada')";

$params = [];

if (!empty($cliente)) {
    $sql .= " AND nombre_cliente LIKE :cliente";
    $params[':cliente'] = "%$cliente%";
}

if (!empty($fecha_inicio)) {
    $sql .= " AND DATE(fecha) >= :fecha_inicio";
    $params[':fecha_inicio'] = $fecha_inicio;
}

if (!empty($fecha_fin)) {
    $sql .= " AND DATE(fecha) <= :fecha_fin";
    $params[':fecha_fin'] = $fecha_fin;
}

$sql .= " ORDER BY fecha DESC";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $facturas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'facturas' => $facturas]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
