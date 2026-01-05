<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../clases/Usuarios.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $datos = json_decode(file_get_contents('php://input'), true);

    if (empty($datos['usuario']) || empty($datos['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Usuario y contraseña son requeridos.']);
        exit;
    }

    try {
        $usuarios = new Usuarios();
        $user = $usuarios->login($datos['usuario'], $datos['password']);

        if ($user) {
            $_SESSION['user_id'] = $user['id_usuarios'];
            $_SESSION['user_name'] = $user['nombre_completo'];
            $_SESSION['user_profile'] = $user['perfil'];

            echo json_encode(['success' => true, 'message' => 'Login exitoso', 'redirect' => 'index.html']);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Credenciales inválidas.']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>
