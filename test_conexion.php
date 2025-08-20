<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>Prueba de Conexión a la Base de Datos</h1>";

// Incluir el archivo de conexión
require_once 'config/conexion.php';

echo "<p>Archivo de conexión incluido. Intentando obtener la conexión...</p>";

try {
    $conexion = obtenerConexion()->getConexion();
    echo "<p style='color:green; font-weight:bold;'>¡Conexión exitosa!</p>";
    
    // Opcional: Intentar una consulta simple
    echo "<p>Intentando una consulta simple...</p>";
    $stmt = $conexion->query('SELECT 1');
    if ($stmt) {
        echo "<p style='color:green; font-weight:bold;'>¡Consulta de prueba exitosa!</p>";
    } else {
        echo "<p style='color:orange; font-weight:bold;'>La consulta de prueba falló, pero la conexión se estableció.</p>";
    }

} catch (PDOException $e) {
    echo "<p style='color:red; font-weight:bold;'>Error de PDO: " . $e->getMessage() . "</p>";
} catch (Exception $e) {
    echo "<p style='color:red; font-weight:bold;'>Error general: " . $e->getMessage() . "</p>";
}
?>
