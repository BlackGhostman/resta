<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../clases/Proveedores.php';

$proveedores = new Proveedores();
$metodo = $_SERVER['REQUEST_METHOD'];

switch ($metodo) {
    case 'GET':
        if (isset($_GET['id'])) {
            $resultado = $proveedores->obtenerPorId($_GET['id']);
        } else {
            $resultado = $proveedores->obtenerTodos();
        }
        echo json_encode(['success' => true, 'data' => $resultado]);
        break;

    case 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);
        if ($datos) {
            $resultado = $proveedores->crear($datos);
            if ($resultado) {
                echo json_encode(['success' => true, 'message' => 'Proveedor creado con éxito.']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Error al crear el proveedor.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Datos no recibidos.']);
        }
        break;

    case 'PUT':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        $datos = json_decode(file_get_contents('php://input'), true);

        if ($id && $datos) {
            $resultado = $proveedores->actualizar($id, $datos);
            if ($resultado) {
                echo json_encode(['success' => true, 'message' => 'Proveedor actualizado con éxito.']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Error al actualizar el proveedor.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID o datos no proporcionados.']);
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if ($id) {
            $resultado = $proveedores->eliminar($id);
            if ($resultado) {
                echo json_encode(['success' => true, 'message' => 'Proveedor eliminado con éxito.']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Error al eliminar el proveedor.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID no proporcionado.']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
        break;
}
?>
