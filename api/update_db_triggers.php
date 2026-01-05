<?php
require_once __DIR__ . '/../config/conexion.php';

try {
    $db = obtenerConexion();
    
    // Drop existing triggers
    $db->ejecutar("DROP TRIGGER IF EXISTS trg_usuarios_check_perfil_before_insert");
    $db->ejecutar("DROP TRIGGER IF EXISTS trg_usuarios_check_perfil_before_update");
    
    // Create new INSERT trigger
    $sqlInsert = "CREATE TRIGGER `trg_usuarios_check_perfil_before_insert` BEFORE INSERT ON `usuarios` FOR EACH ROW BEGIN
        IF NEW.perfil NOT IN ('administrador', 'cajero', 'mesero', 'cocina') THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El valor para \"perfil\" no es válido. Solo se permite \"administrador\", \"cajero\", \"mesero\" o \"cocina\".';
        END IF;
    END";
    $db->ejecutar($sqlInsert);

    // Create new UPDATE trigger
    $sqlUpdate = "CREATE TRIGGER `trg_usuarios_check_perfil_before_update` BEFORE UPDATE ON `usuarios` FOR EACH ROW BEGIN
        IF NEW.perfil NOT IN ('administrador', 'cajero', 'mesero', 'cocina') THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El valor para \"perfil\" no es válido. Solo se permite \"administrador\", \"cajero\", \"mesero\" o \"cocina\".';
        END IF;
    END";
    $db->ejecutar($sqlUpdate);

    echo json_encode(['success' => true, 'message' => 'Triggers actualizados correctamente con rol Cocina.']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
