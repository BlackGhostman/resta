<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../clases/AjustesInventario.php';
require_once __DIR__ . '/../config/conexion.php'; // Para consultas directas

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
                    'articulos' => $db->consultar("SELECT id_articulos, nombre FROM articulos WHERE es_inventariable = 1 ORDER BY nombre"),
                    'tipos_ajuste' => $db->consultar("SELECT id_tipos_ajuste, nombre FROM tipos_ajuste_inventario ORDER BY nombre")
                ];
                echo json_encode(['success' => true, 'data' => $formData]);
            } else {
                $ajustes = new AjustesInventario();
                $resultado = $ajustes->obtenerTodos();
                echo json_encode(['success' => true, 'data' => $resultado]);
            }
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    case 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);
        if (!$datos || empty($datos['id_articulo']) || empty($datos['id_tipo_ajuste']) || !isset($datos['cantidad'])) {
            responderError(400, 'Artículo, tipo de ajuste y cantidad son obligatorios.');
            break;
        }
        try {
            $ajustes = new AjustesInventario();
            $ajustes->crear($datos);
            echo json_encode(['success' => true, 'message' => 'Ajuste de inventario creado con éxito.']);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    default:
        responderError(405, 'Método no permitido. Solo se permiten GET y POST.');
        break;
}
?>
