<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../clases/Usuarios.php';

$metodo = $_SERVER['REQUEST_METHOD'];

function responderError($codigo, $mensaje) {
    http_response_code($codigo);
    echo json_encode(['success' => false, 'message' => $mensaje]);
}

switch ($metodo) {
    case 'GET':
        try {
            $usuarios = new Usuarios();
            if (isset($_GET['id'])) {
                $resultado = $usuarios->obtenerPorId($_GET['id']);
            } else {
                $resultado = $usuarios->obtenerTodos();
            }
            echo json_encode(['success' => true, 'data' => $resultado]);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    case 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);
        if (!$datos || empty($datos['usuario']) || empty($datos['nombre_completo']) || empty($datos['password']) || empty($datos['perfil'])) {
            responderError(400, 'Faltan datos obligatorios.');
            break;
        }
        try {
            $usuarios = new Usuarios();
            $usuarios->crear($datos);
            echo json_encode(['success' => true, 'message' => 'Usuario creado con éxito.']);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    case 'PUT':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        $datos = json_decode(file_get_contents('php://input'), true);
        if (!$id || !$datos || empty($datos['usuario'])) {
            responderError(400, 'ID y usuario son obligatorios.');
            break;
        }
        try {
            $usuarios = new Usuarios();
            $usuarios->actualizar($id, $datos);
            echo json_encode(['success' => true, 'message' => 'Usuario actualizado con éxito.']);
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
            $usuarios = new Usuarios();
            $usuarios->eliminar($id);
            echo json_encode(['success' => true, 'message' => 'Usuario eliminado con éxito.']);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    default:
        responderError(405, 'Método no permitido.');
        break;
}
?>
