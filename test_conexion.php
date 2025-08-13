<?php
/**
 * Archivo de prueba para verificar la conexión a la base de datos
 */

require_once 'config/conexion.php';

echo "<h1>Prueba de Conexión - Sistema Restaurante</h1>";

try {
    // Probar conexión básica
    $db = obtenerConexion();
    echo "<p style='color: green;'>✓ Conexión a la base de datos establecida correctamente</p>";
    
    // Probar consulta simple
    $familias = $db->consultar("SELECT COUNT(*) as total FROM familias");
    echo "<p>Total de familias en la base de datos: " . $familias[0]['total'] . "</p>";
    
    // Probar consulta de artículos
    $articulos = $db->consultar("SELECT COUNT(*) as total FROM articulos");
    echo "<p>Total de artículos en la base de datos: " . $articulos[0]['total'] . "</p>";
    
    // Probar consulta de mesas
    $mesas = $db->consultar("SELECT COUNT(*) as total FROM salones_mesas");
    echo "<p>Total de mesas en la base de datos: " . $mesas[0]['total'] . "</p>";
    
    echo "<hr>";
    echo "<h2>Prueba de APIs</h2>";
    echo "<p><a href='api/articulos.php?accion=familias' target='_blank'>Probar API de Familias</a></p>";
    echo "<p><a href='api/articulos.php' target='_blank'>Probar API de Artículos</a></p>";
    echo "<p><a href='api/mesas.php' target='_blank'>Probar API de Mesas</a></p>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>✗ Error de conexión: " . $e->getMessage() . "</p>";
    echo "<h3>Pasos para solucionar:</h3>";
    echo "<ol>";
    echo "<li>Verifica que SQL Server esté ejecutándose</li>";
    echo "<li>Confirma las credenciales en config/conexion.php</li>";
    echo "<li>Asegúrate de que la base de datos 'restaurante_pos' exista</li>";
    echo "<li>Verifica que el driver PDO_SQLSRV esté instalado en PHP</li>";
    echo "</ol>";
}
?>
