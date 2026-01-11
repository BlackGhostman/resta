<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../clases/Impresoras.php';

$impresoras = new Impresoras();
$metodo = $_SERVER['REQUEST_METHOD'];

function responderError($codigo, $mensaje) {
    http_response_code($codigo);
    echo json_encode(['success' => false, 'message' => $mensaje]);
}

switch ($metodo) {
    case 'GET':
        try {
            if (isset($_GET['id'])) {
                $resultado = $impresoras->obtenerPorId($_GET['id']);
            } else {
                $resultado = $impresoras->obtenerTodos();
            }
            echo json_encode(['success' => true, 'data' => $resultado]);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    case 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);
        if (!$datos || empty($datos['nombre'])) {
            responderError(400, 'El nombre es obligatorio.');
            break;
        }
        try {
            $impresoras->crear($datos);
            echo json_encode(['success' => true, 'message' => 'Impresora creada con éxito.']);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    case 'PUT':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        $datos = json_decode(file_get_contents('php://input'), true);
        if (!$id || !$datos || empty($datos['nombre'])) {
            responderError(400, 'ID y nombre son obligatorios.');
            break;
        }
        try {
            $impresoras->actualizar($id, $datos);
            echo json_encode(['success' => true, 'message' => 'Impresora actualizada con éxito.']);
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
            $impresoras->eliminar($id);
            echo json_encode(['success' => true, 'message' => 'Impresora eliminada con éxito.']);
        } catch (Exception $e) {
            responderError(500, 'Error al eliminar (posiblemente esté en uso).');
        }
        break;

    default:
        responderError(405, 'Método no permitido.');
        break;
}
?>
