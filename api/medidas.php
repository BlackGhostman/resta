<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../clases/Medidas.php';

$medidas = new Medidas();
$metodo = $_SERVER['REQUEST_METHOD'];

function responderError($codigo, $mensaje) {
    http_response_code($codigo);
    echo json_encode(['success' => false, 'message' => $mensaje]);
}

switch ($metodo) {
    case 'GET':
        try {
            if (isset($_GET['id'])) {
                $resultado = $medidas->obtenerPorId($_GET['id']);
            } else {
                $resultado = $medidas->obtenerTodos();
            }
            echo json_encode(['success' => true, 'data' => $resultado]);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    case 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);
        if (!$datos || empty($datos['descripcion'])) {
            responderError(400, 'La descripción es obligatoria.');
            break;
        }
        try {
            $medidas->crear($datos);
            echo json_encode(['success' => true, 'message' => 'Medida creada con éxito.']);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    case 'PUT':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        $datos = json_decode(file_get_contents('php://input'), true);
        if (!$id || !$datos || empty($datos['descripcion'])) {
            responderError(400, 'ID y descripción son obligatorios.');
            break;
        }
        try {
            $medidas->actualizar($id, $datos);
            echo json_encode(['success' => true, 'message' => 'Medida actualizada con éxito.']);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if (!$id) {
            responderError(400, 'ID no proporcionado.');
            break;
        }
        try {
            $medidas->eliminar($id);
            echo json_encode(['success' => true, 'message' => 'Medida eliminada con éxito.']);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    default:
        responderError(405, 'Método no permitido.');
        break;
}
?>
