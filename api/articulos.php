<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../clases/Articulos.php';
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
                    'proveedores' => $db->consultar("SELECT id_proveedores, nombre FROM proveedores ORDER BY nombre"),
                    'familias' => $db->consultar("SELECT id_familias, descripcion FROM familias ORDER BY descripcion"),
                    'subfamilias' => $db->consultar("SELECT id_subfamilias, descripcion, id_familia FROM subfamilias ORDER BY descripcion"),
                    'ubicaciones' => $db->consultar("SELECT id_ubicaciones_inventario, descripcion FROM ubicaciones_inventario ORDER BY descripcion"),
                    'medidas' => $db->consultar("SELECT id_medidas, descripcion FROM medidas ORDER BY descripcion")
                ];
                echo json_encode(['success' => true, 'data' => $formData]);
            } else {
                $articulos = new Articulos();
                if (isset($_GET['id'])) {
                    $resultado = $articulos->obtenerPorId($_GET['id']);
                } else {
                    $resultado = $articulos->obtenerTodos();
                }
                echo json_encode(['success' => true, 'data' => $resultado]);
            }
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    case 'POST':
        $datos = json_decode(file_get_contents('php://input'), true);
        if (!$datos || empty($datos['nombre'])) {
            responderError(400, 'El nombre del artículo es obligatorio.');
            break;
        }
        try {
            $articulos = new Articulos();
            $articulos->crear($datos);
            echo json_encode(['success' => true, 'message' => 'Artículo creado con éxito.']);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    case 'PUT':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        $datos = json_decode(file_get_contents('php://input'), true);
        if (!$id || !$datos || empty($datos['nombre'])) {
            responderError(400, 'ID y nombre del artículo son obligatorios.');
            break;
        }
        try {
            $articulos = new Articulos();
            $articulos->actualizar($id, $datos);
            echo json_encode(['success' => true, 'message' => 'Artículo actualizado con éxito.']);
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
            $articulos = new Articulos();
            $articulos->eliminar($id);
            echo json_encode(['success' => true, 'message' => 'Artículo eliminado con éxito.']);
        } catch (Exception $e) {
            responderError(500, $e->getMessage());
        }
        break;

    default:
        responderError(405, 'Método no permitido.');
        break;
}
?>
