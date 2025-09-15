<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/config/conexion.php';

echo "<style>body { font-family: sans-serif; background-color: #111; color: #eee; } .success { color: #4caf50; } .error { color: #f44336; }</style>";
echo "<h1>Verificando Tablas de la Base de Datos...</h1>";

function verificarTabla($db, $nombreTabla) {
    try {
        $resultado = $db->consultar("SELECT 1 FROM {$nombreTabla} LIMIT 1");
        echo "<p><span class='success'>ÉXITO:</span> La tabla '{$nombreTabla}' existe y se puede consultar.</p>";
        return true;
    } catch (Exception $e) {
        echo "<p><span class='error'>ERROR:</span> No se pudo consultar la tabla '{$nombreTabla}'.</p>";
        echo "<p style='color: #ff9800;'>Mensaje: " . $e->getMessage() . "</p>";
        return false;
    }
}

$tablas_a_verificar = [
    'proveedores',
    'familias',
    'subfamilias',
    'ubicaciones_inventario',
    'medidas'
];

try {
    $db = obtenerConexion();
    echo "<p class='success'>Conexión a la base de datos exitosa.</p><hr>";

    foreach ($tablas_a_verificar as $tabla) {
        verificarTabla($db, $tabla);
    }

} catch (Exception $e) {
    echo "<p class='error'>ERROR FATAL: No se pudo conectar a la base de datos.</p>";
    echo "<p style='color: #ff9800;'>Mensaje: " . $e->getMessage() . "</p>";
}

?>
