<?php
header('Content-Type: application/json');
include '../config/conexion.php';

if (isset($_GET['id_factura'])) {
    $id_factura = $_GET['id_factura'];

    try {
        $stmt = $pdo->prepare(
            "SELECT fd.id_articulo, a.nombre, fd.cantidad, fd.precio, a.url_imagen as imagen_url 
             FROM facturas_detalle fd 
             JOIN articulos a ON fd.id_articulo = a.id_articulos 
             WHERE fd.id_factura = :id_factura"
        );
        $stmt->execute(['id_factura' => $id_factura]);
        $detalles = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'detalles' => $detalles]);

    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Error en la base de datos: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'No se proporcionó el ID de la factura.']);
}
?>
