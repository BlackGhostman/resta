<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../clases/UbicacionesInventario.php';

$ubicaciones = new UbicacionesInventario();
$metodo = $_SERVER['REQUEST_METHOD'];

function responderError($codigo, $mensaje) {
    http_response_code($codigo);
    echo json_encode(['success' => false, 'message' => $mensaje]);
}

switch ($metodo) {
    case 'GET':
        try {
            if (isset($_GET['id'])) {
                $resultado = $ubicaciones->obtenerPorId($_GET['id']);
            } else {
                $resultado = $ubicaciones->obtenerTodos();
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
            $ubicaciones->crear($datos);
            echo json_encode(['success' => true, 'message' => 'Ubicación creada con éxito.']);
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
            $ubicaciones->actualizar($id, $datos);
            echo json_encode(['success' => true, 'message' => 'Ubicación actualizada con éxito.']);
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
            $ubicaciones->eliminar($id);
            echo json_encode(['success' => true, 'message' => 'Ubicación eliminada con éxito.']);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    default:
        responderError(405, 'Método no permitido.');
        break;
}
?>
