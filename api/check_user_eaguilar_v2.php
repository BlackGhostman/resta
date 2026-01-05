<?php
require_once __DIR__ . '/../clases/Usuarios.php';
require_once __DIR__ . '/../config/conexion.php';

try {
    $db = obtenerConexion();
    
    // Check if user exists
    $rows = $db->consultar("SELECT * FROM usuarios WHERE usuario = 'eaguilar'");
    $user = isset($rows[0]) ? $rows[0] : null;

    if ($user) {
        echo json_encode(['success' => true, 'message' => 'User exists', 'user' => $user]);
    } else {
        // Create user
        $hash = password_hash('Peregrino21', PASSWORD_DEFAULT);
        $sql = "INSERT INTO usuarios (usuario, nombre_completo, password_hash, perfil, esta_activo) VALUES ('eaguilar', 'E. Aguilar', '$hash', 'administrador', 1)";
        $db->ejecutar($sql);
        echo json_encode(['success' => true, 'message' => 'User created']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
