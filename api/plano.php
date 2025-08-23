<?php
header('Content-Type: application/json');
require_once '../config/conexion.php';
require_once '../clases/Plano.php';

$plano = new Plano();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $data = $plano->obtenerPlanoCompleto();
            echo json_encode($data);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al obtener el plano: ' . $e->getMessage()]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if ($data) {
            try {
                if ($plano->guardarPlano($data)) {
                    echo json_encode(['success' => true, 'message' => 'Plano guardado correctamente.']);
                } else {
                    http_response_code(500);
                    echo json_encode(['success' => false, 'message' => 'No se pudo guardar el plano.']);
                }
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Error al guardar el plano: ' . $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'No se recibieron datos.']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
        break;
}
?>
