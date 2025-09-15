<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../clases/Familias.php';

$familias = new Familias();
$metodo = $_SERVER['REQUEST_METHOD'];

// Manejo de excepciones centralizado
function responderError($codigo, $mensaje) {
    http_response_code($codigo);
    echo json_encode(['success' => false, 'message' => $mensaje]);
}

switch ($metodo) {
    case 'GET':
        try {
            if (isset($_GET['id'])) {
                $resultado = $familias->obtenerPorId($_GET['id']);
            } else {
                $resultado = $familias->obtenerTodas();
            }
            echo json_encode(['success' => true, 'data' => $resultado]);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    case 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);
        if (!$datos || empty($datos['descripcion'])) {
            responderError(400, 'Datos incompletos o incorrectos.');
            break;
        }
        try {
            $resultado = $familias->crear($datos);
            echo json_encode(['success' => true, 'message' => 'Familia creada con éxito.']);
        } catch (Exception $e) {
            responderError(409, $e->getMessage()); // 409 Conflict para entradas duplicadas
        }
        break;

    case 'PUT':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        $datos = json_decode(file_get_contents('php://input'), true);

        if (!$id || !$datos || empty($datos['descripcion'])) {
            responderError(400, 'ID o datos incompletos.');
            break;
        }
        try {
            $resultado = $familias->actualizar($id, $datos);
            echo json_encode(['success' => true, 'message' => 'Familia actualizada con éxito.']);
        } catch (Exception $e) {
            responderError(409, $e->getMessage()); // 409 Conflict para entradas duplicadas
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if (!$id) {
            responderError(400, 'ID no proporcionado.');
            break;
        }
        try {
            $familias->eliminar($id);
            echo json_encode(['success' => true, 'message' => 'Familia eliminada con éxito.']);
        } catch (Exception $e) {
            responderError(409, $e->getMessage()); // 409 Conflict por dependencias
        }
        break;

    default:
        responderError(405, 'Método no permitido.');
        break;
}
?>
