<?php
require_once __DIR__ . '/../clases/Usuarios.php';
require_once __DIR__ . '/../config/conexion.php';

try {
    $db = obtenerConexion();
    $usuarios = new Usuarios();

    // Check if user exists
    $rows = $db->consultar("SELECT * FROM usuarios WHERE usuario = 'eaguilar'");
    $user = isset($rows[0]) ? $rows[0] : null;

    if ($user) {
        // User exists
        echo json_encode(['success' => true, 'message' => 'User exists', 'user' => $user]);
    } else {
        // Create user
        $datos = [
            'usuario' => 'eaguilar',
            'nombre_completo' => 'E. Aguilar',
            'password' => 'Peregrino21',
            'perfil' => 'administrador', // Assuming admin for testing
            'esta_activo' => 1
        ];
        // Use password_hash manually since Usuarios::crear might handle it, let's just insert directly to be sure and simple
        $hash = password_hash('Peregrino21', PASSWORD_DEFAULT);
        $sql = "INSERT INTO usuarios (usuario, nombre_completo, password_hash, perfil, esta_activo) VALUES ('eaguilar', 'E. Aguilar', '$hash', 'administrador', 1)";
        $db->ejecutar($sql);
        echo json_encode(['success' => true, 'message' => 'User created']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
