<?php
header('Content-Type: application/json');
require_once '../clases/Ubicaciones.php';

$ubicaciones = new Ubicaciones();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $resultado = $ubicaciones->buscarPorId($_GET['id']);
        } else {
            $resultado = $ubicaciones->listar();
        }
        echo json_encode($resultado);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['nombre'])) {
            $id_insertado = $ubicaciones->crear($data['nombre']);
            if ($id_insertado) {
                echo json_encode(['success' => true, 'id' => $id_insertado, 'nombre' => $data['nombre']]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al crear la ubicación.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Falta el nombre de la ubicación.']);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($_GET['id']) && isset($data['nombre'])) {
            if ($ubicaciones->actualizar($_GET['id'], $data['nombre'])) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al actualizar la ubicación.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Faltan datos para actualizar.']);
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            if ($ubicaciones->eliminar($_GET['id'])) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al eliminar la ubicación.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Falta el ID de la ubicación.']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
        break;
}
?>
