<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../clases/TiposAjusteInventario.php';
require_once __DIR__ . '/../config/conexion.php'; // Para consultas directas

$tiposAjuste = new TiposAjusteInventario();
$metodo = $_SERVER['REQUEST_METHOD'];

function responderError($codigo, $mensaje) {
    http_response_code($codigo);
    echo json_encode(['success' => false, 'message' => $mensaje]);
}

switch ($metodo) {
    case 'GET':
        try {
            if (isset($_GET['action']) && $_GET['action'] == 'getFormData') {
                $db = obtenerConexion();
                $formData = [
                    'tipos_cuenta' => $db->consultar("SELECT id_tipo_cuenta, nombre FROM tipos_cuenta ORDER BY nombre")
                ];
                echo json_encode(['success' => true, 'data' => $formData]);
            } else {
                if (isset($_GET['id'])) {
                    $resultado = $tiposAjuste->obtenerPorId($_GET['id']);
                } else {
                    $resultado = $tiposAjuste->obtenerTodos();
                }
                echo json_encode(['success' => true, 'data' => $resultado]);
            }
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    case 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);
        if (!$datos || empty($datos['nombre']) || !isset($datos['tipo_cuenta'])) {
            responderError(400, 'El nombre y el tipo de cuenta son obligatorios.');
            break;
        }
        try {
            $tiposAjuste->crear($datos);
            echo json_encode(['success' => true, 'message' => 'Tipo de ajuste creado con éxito.']);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    case 'PUT':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        $datos = json_decode(file_get_contents('php://input'), true);
        if (!$id || !$datos || empty($datos['nombre']) || !isset($datos['tipo_cuenta'])) {
            responderError(400, 'ID, nombre y tipo de cuenta son obligatorios.');
            break;
        }
        try {
            $tiposAjuste->actualizar($id, $datos);
            echo json_encode(['success' => true, 'message' => 'Tipo de ajuste actualizado con éxito.']);
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
            $tiposAjuste->eliminar($id);
            echo json_encode(['success' => true, 'message' => 'Tipo de ajuste eliminado con éxito.']);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    default:
        responderError(405, 'Método no permitido.');
        break;
}
?>
