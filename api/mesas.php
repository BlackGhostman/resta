<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../clases/Mesas.php';

try {
    $metodo = $_SERVER['REQUEST_METHOD'];
    $mesas = new Mesas();
    
    switch ($metodo) {
        case 'GET':
            if (isset($_GET['accion'])) {
                switch ($_GET['accion']) {
                    case 'disponibles':
                        $resultado = $mesas->obtenerDisponibles();
                        break;
                        
                    case 'por_id':
                        $id = isset($_GET['id']) ? $_GET['id'] : 0;
                        $resultado = $mesas->obtenerPorId($id);
                        break;
                        
                    default:
                        $resultado = $mesas->obtenerTodas();
                        break;
                }
            } else {
                $resultado = $mesas->obtenerTodas();
            }
            
            echo json_encode([
                'success' => true,
                'data' => $resultado
            ]);
            break;
            
        case 'PUT':
            $input = json_decode(file_get_contents('php://input'), true);
            if (isset($input['id']) && isset($input['estado'])) {
                $resultado = $mesas->cambiarEstado($input['id'], $input['estado']);
                echo json_encode([
                    'success' => $resultado,
                    'message' => $resultado ? 'Estado actualizado correctamente' : 'Error al actualizar estado'
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Datos incompletos'
                ]);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            break;
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor: ' . $e->getMessage()
    ]);
}
?>
