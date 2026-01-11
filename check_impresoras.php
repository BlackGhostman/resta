<?php
require_once 'config/conexion.php';

try {
    $db = new ConexionDB();
    $pdo = $db->getConexion();

    // Check if table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'impresoras'");
    if ($stmt->rowCount() > 0) {
        echo "Table 'impresoras' exists.\n";
        // Show columns
        $stmt = $pdo->query("DESCRIBE impresoras");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($columns as $col) {
            echo $col['Field'] . " - " . $col['Type'] . "\n";
        }
    } else {
        echo "Table 'impresoras' does NOT exist.\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
