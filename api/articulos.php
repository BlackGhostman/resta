<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../clases/Articulos.php';
require_once '../clases/Familias.php';

try {
    $metodo = $_SERVER['REQUEST_METHOD'];
    $articulos = new Articulos();
    $familias = new Familias();
    
    switch ($metodo) {
        case 'GET':
            if (isset($_GET['accion'])) {
                switch ($_GET['accion']) {
                    case 'por_familia':
                        $idFamilia = isset($_GET['id_familia']) ? $_GET['id_familia'] : null;
                        $resultado = $articulos->obtenerPorFamilia($idFamilia);
                        break;
                        
                    case 'buscar':
                        $nombre = isset($_GET['nombre']) ? $_GET['nombre'] : '';
                        $resultado = $articulos->buscarPorNombre($nombre);
                        break;
                        
                    case 'por_id':
                        $id = isset($_GET['id']) ? $_GET['id'] : 0;
                        $resultado = $articulos->obtenerPorId($id);
                        break;
                        
                    case 'familias':
                        $resultado = $familias->obtenerTodas();
                        break;
                        
                    default:
                        $resultado = $articulos->obtenerPorFamilia();
                        break;
                }
            } else {
                $resultado = $articulos->obtenerPorFamilia();
            }
            
            echo json_encode([
                'success' => true,
                'data' => $resultado
            ]);
            break;
            
        case 'POST':
            // Aquí puedes agregar lógica para crear nuevos artículos
            echo json_encode([
                'success' => false,
                'message' => 'Método POST no implementado aún'
            ]);
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
