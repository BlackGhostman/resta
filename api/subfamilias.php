<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../clases/Subfamilias.php';
require_once __DIR__ . '/../clases/Familias.php'; // Necesario para obtener la lista de familias

$metodo = $_SERVER['REQUEST_METHOD'];

// Manejo de excepciones centralizado
function responderError($codigo, $mensaje) {
    http_response_code($codigo);
    echo json_encode(['success' => false, 'message' => $mensaje]);
}

switch ($metodo) {
    case 'GET':
        try {
            // Endpoint especial para obtener solo las familias para el dropdown
            if (isset($_GET['action']) && $_GET['action'] == 'getFamilias') {
                $familias = new Familias();
                $resultado = $familias->obtenerTodas();
                echo json_encode(['success' => true, 'data' => $resultado]);
                break;
            }

            $subfamilias = new Subfamilias();
            if (isset($_GET['id'])) {
                $resultado = $subfamilias->obtenerPorId($_GET['id']);
            } else {
                $resultado = $subfamilias->obtenerTodos();
            }
            echo json_encode(['success' => true, 'data' => $resultado]);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    case 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);
        if (!$datos || empty($datos['descripcion']) || empty($datos['id_familia'])) {
            responderError(400, 'Datos incompletos o incorrectos.');
            break;
        }
        try {
            $subfamilias = new Subfamilias();
            $subfamilias->crear($datos);
            echo json_encode(['success' => true, 'message' => 'Subfamilia creada con éxito.']);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    case 'PUT':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        $datos = json_decode(file_get_contents('php://input'), true);

        if (!$id || !$datos || empty($datos['descripcion']) || empty($datos['id_familia'])) {
            responderError(400, 'ID o datos incompletos.');
            break;
        }
        try {
            $subfamilias = new Subfamilias();
            $subfamilias->actualizar($id, $datos);
            echo json_encode(['success' => true, 'message' => 'Subfamilia actualizada con éxito.']);
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
            $subfamilias = new Subfamilias();
            $subfamilias->eliminar($id);
            echo json_encode(['success' => true, 'message' => 'Subfamilia eliminada con éxito.']);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    default:
        responderError(405, 'Método no permitido.');
        break;
}
?>
