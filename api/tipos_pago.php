<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../clases/TiposPago.php';

$tiposPago = new TiposPago();
$metodo = $_SERVER['REQUEST_METHOD'];

function responderError($codigo, $mensaje) {
    http_response_code($codigo);
    echo json_encode(['success' => false, 'message' => $mensaje]);
}

switch ($metodo) {
    case 'GET':
        try {
            if (isset($_GET['id'])) {
                $resultado = $tiposPago->obtenerPorId($_GET['id']);
            } else {
                $resultado = $tiposPago->obtenerTodos();
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
            $tiposPago->crear($datos);
            echo json_encode(['success' => true, 'message' => 'Tipo de pago creado con éxito.']);
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
            $tiposPago->actualizar($id, $datos);
            echo json_encode(['success' => true, 'message' => 'Tipo de pago actualizado con éxito.']);
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
            $tiposPago->eliminar($id);
            echo json_encode(['success' => true, 'message' => 'Tipo de pago eliminado con éxito.']);
        } catch (Exception $e) {
            responderError(500, 'Error al eliminar (posiblemente esté en uso).');
        }
        break;

    default:
        responderError(405, 'Método no permitido.');
        break;
}
?>
