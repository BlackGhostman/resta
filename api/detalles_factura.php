<?php
header('Content-Type: application/json');
require_once '../config/conexion.php';

$db = new ConexionDB();
$pdo = $db->getConexion();

if (isset($_GET['id_factura'])) {
    $id_factura = $_GET['id_factura'];

    try {
        $stmt = $pdo->prepare(
            "SELECT fd.id_articulo, a.nombre, fd.cantidad, fd.precio_unitario as precio, a.url_imagen 
             FROM facturas_detalle fd 
             JOIN articulos a ON fd.id_articulo = a.id_articulos 
             WHERE fd.id_factura_maestro = :id_factura"
        );
        $stmt->execute(['id_factura' => $id_factura]);
        $detalles = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'detalles' => $detalles]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Error en la base de datos: ' . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No se proporcionó el ID de la factura.']);
}
?>
