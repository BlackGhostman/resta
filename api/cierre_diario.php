<?php
header('Content-Type: application/json');
require_once '../config/conexion.php';

$db = new ConexionDB();
$pdo = $db->getConexion();

// Determine date (default to today)
$fecha = isset($_GET['fecha']) ? $_GET['fecha'] : date('Y-m-d');

try {
    // 1. Total Sales (Valid Invoices)
    $sqlTotal = "SELECT 
                    COUNT(*) as total_facturas,
                    COALESCE(SUM(total_factura), 0) as total_ventas,
                    COALESCE(SUM(monto_impuestos), 0) as total_impuestos,
                    COALESCE(SUM(subtotal), 0) as total_subtotal
                 FROM facturas_maestro 
                 WHERE DATE(fecha) = :fecha AND estado NOT IN ('anulada')";
    
    $stmtTotal = $pdo->prepare($sqlTotal);
    $stmtTotal->execute([':fecha' => $fecha]);
    $resTotal = $stmtTotal->fetch(PDO::FETCH_ASSOC);

    // 2. Voided Invoices
    $sqlAnuladas = "SELECT 
                        COUNT(*) as total_anuladas,
                        COALESCE(SUM(total_factura), 0) as monto_anulado
                    FROM facturas_maestro 
                    WHERE DATE(fecha) = :fecha AND estado = 'anulada'";

    $stmtAnuladas = $pdo->prepare($sqlAnuladas);
    $stmtAnuladas->execute([':fecha' => $fecha]);
    $resAnuladas = $stmtAnuladas->fetch(PDO::FETCH_ASSOC);

    // 3. Payment Methods Breakdown (Mocking for now as we don't have a payments table yet, assuming 'Credito' vs 'Contado' based on status if needed, 
    // or just grouping by state for now since we observed 'credito' and 'pagada')
    $sqlMetodos = "SELECT estado, COUNT(*) as cantidad, COALESCE(SUM(total_factura), 0) as total 
                   FROM facturas_maestro 
                   WHERE DATE(fecha) = :fecha AND estado NOT IN ('anulada')
                   GROUP BY estado";
                   
    $stmtMetodos = $pdo->prepare($sqlMetodos);
    $stmtMetodos->execute([':fecha' => $fecha]);
    $resMetodos = $stmtMetodos->fetchAll(PDO::FETCH_ASSOC);

    $response = [
        'success' => true,
        'fecha' => $fecha,
        'resumen_general' => $resTotal,
        'resumen_anuladas' => $resAnuladas,
        'desglose_estados' => $resMetodos
    ];

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
