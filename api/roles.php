<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../clases/Roles.php';

$metodo = $_SERVER['REQUEST_METHOD'];

function responderError($codigo, $mensaje) {
    http_response_code($codigo);
    echo json_encode(['success' => false, 'message' => $mensaje]);
}

switch ($metodo) {
    case 'GET':
        try {
            $roles = new Roles();
            if (isset($_GET['id'])) {
                $resultado = $roles->obtenerPorId($_GET['id']);
            } else {
                $resultado = $roles->obtenerTodos();
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
            $roles = new Roles();
            $roles->crear($datos);
            echo json_encode(['success' => true, 'message' => 'Rol creado con éxito.']);
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
            $roles = new Roles();
            $roles->actualizar($id, $datos);
            echo json_encode(['success' => true, 'message' => 'Rol actualizado con éxito.']);
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
            $roles = new Roles();
            $roles->eliminar($id);
            echo json_encode(['success' => true, 'message' => 'Rol eliminado con éxito.']);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    default:
        responderError(405, 'Método no permitido.');
        break;
}
?>
