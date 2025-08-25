<?php
header('Content-Type: application/json');
require_once '../config/conexion.php';
require_once '../clases/Plano.php';

$plano = new Plano();

// Este endpoint solo maneja GET para obtener el plano de mesas
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Usaremos un nuevo método específico para esta vista
        $data = $plano->obtenerPlanoParaMesas();
        echo json_encode($data);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al obtener el plano para mesas: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}
?>
