<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../clases/Facturas.php';

// Verificar sesión
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

$action = $_GET['action'] ?? '';

try {
    $facturas = new Facturas();

    switch ($action) {
        case 'get_mesas_ocupadas':
            $mesas = $facturas->obtenerMesasOcupadas();
            echo json_encode(['success' => true, 'mesas' => $mesas]);
            break;

        case 'get_tipos_pago':
            $tipos = $facturas->obtenerTiposPago();
            echo json_encode(['success' => true, 'tipos' => $tipos]);
            break;

        case 'buscar_articulos':
            $query = $_GET['q'] ?? '';
            if (strlen($query) < 2) {
                echo json_encode(['success' => false, 'message' => 'Query muy corto']);
                exit;
            }
            $articulos = $facturas->buscarArticulos($query);
            echo json_encode(['success' => true, 'articulos' => $articulos]);
            break;

        case 'crear_factura':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Método no permitido']);
                exit;
            }

            $datos = json_decode(file_get_contents('php://input'), true);
            
            if (!$datos) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
                exit;
            }

            $resultado = $facturas->crearFacturaCompleta($datos, $_SESSION['user_id']);
            
            if ($resultado['success']) {
                echo json_encode($resultado);
            } else {
                http_response_code(400);
                echo json_encode($resultado);
            }
            break;

        default:
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Acción no válida']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
}
?>
