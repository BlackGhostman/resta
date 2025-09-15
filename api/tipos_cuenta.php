<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../clases/TiposCuenta.php';

$tiposCuenta = new TiposCuenta();
$metodo = $_SERVER['REQUEST_METHOD'];

function responderError($codigo, $mensaje) {
    http_response_code($codigo);
    echo json_encode(['success' => false, 'message' => $mensaje]);
}

switch ($metodo) {
    case 'GET':
        try {
            if (isset($_GET['id'])) {
                $resultado = $tiposCuenta->obtenerPorId($_GET['id']);
            } else {
                $resultado = $tiposCuenta->obtenerTodos();
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
            $tiposCuenta->crear($datos);
            echo json_encode(['success' => true, 'message' => 'Tipo de cuenta creado con éxito.']);
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
            $tiposCuenta->actualizar($id, $datos);
            echo json_encode(['success' => true, 'message' => 'Tipo de cuenta actualizado con éxito.']);
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
            $tiposCuenta->eliminar($id);
            echo json_encode(['success' => true, 'message' => 'Tipo de cuenta eliminado con éxito.']);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    default:
        responderError(405, 'Método no permitido.');
        break;
}
?>
