<?php
/**
 * Archivo de conexión a la base de datos SQL Server
 * Sistema de Restaurante POS
 */

class ConexionDB {
    private $servidor = "LPD-EAGUILAR\MSSQLSERVER2016"; // Cambia por tu servidor SQL Server
    private $baseDatos = "resta";
    private $usuario = "sa"; // Cambia por tu usuario
    private $password = "Peregrino21"; // Cambia por tu contraseña
    private $conexion;
    
    public function __construct() {
        $this->conectar();
    }
    
    private function conectar() {
        try {
            // Configuración de conexión para SQL Server
            $dsn = "sqlsrv:Server={$this->servidor};Database={$this->baseDatos}";
            
            $opciones = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::SQLSRV_ATTR_ENCODING => PDO::SQLSRV_ENCODING_UTF8
            ];
            
            $this->conexion = new PDO($dsn, $this->usuario, $this->password, $opciones);
            
        } catch (PDOException $e) {
            die("Error de conexión: " . $e->getMessage());
        }
    }
    
    public function getConexion() {
        return $this->conexion;
    }
    
    public function cerrarConexion() {
        $this->conexion = null;
    }
    
    // Método para ejecutar consultas SELECT
    public function consultar($sql, $parametros = []) {
        try {
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute($parametros);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new Exception("Error en consulta: " . $e->getMessage());
        }
    }
    
    // Método para ejecutar INSERT, UPDATE, DELETE
    public function ejecutar($sql, $parametros = []) {
        try {
            $stmt = $this->conexion->prepare($sql);
            return $stmt->execute($parametros);
        } catch (PDOException $e) {
            throw new Exception("Error en ejecución: " . $e->getMessage());
        }
    }
    
    // Método para obtener el último ID insertado
    public function ultimoId() {
        return $this->conexion->lastInsertId();
    }
    
    // Método para iniciar transacción
    public function iniciarTransaccion() {
        return $this->conexion->beginTransaction();
    }
    
    // Método para confirmar transacción
    public function confirmarTransaccion() {
        return $this->conexion->commit();
    }
    
    // Método para cancelar transacción
    public function cancelarTransaccion() {
        return $this->conexion->rollBack();
    }
}

// Función global para obtener conexión
function obtenerConexion() {
    static $conexion = null;
    if ($conexion === null) {
        $conexion = new ConexionDB();
    }
    return $conexion;
}
?>
