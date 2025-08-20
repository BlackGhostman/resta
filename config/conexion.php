<?php
/**
 * Archivo de conexión a la base de datos MySQL
 * Sistema de Restaurante POS
 */

class ConexionDB {
    private $servidor = "srv1138.hstgr.io";
    private $baseDatos = "u876327316_resta";
    private $usuario = "u876327316_resta";
    private $password = "Peregrino21-";
    private $charset = "utf8mb4";
    private $conexion;

    public function __construct() {
        $this->conectar();
    }

    private function conectar() {
        try {
            $dsn = "mysql:host={$this->servidor};dbname={$this->baseDatos};charset={$this->charset}";
            
            $opciones = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            
            $this->conexion = new PDO($dsn, $this->usuario, $this->password, $opciones);
            
        } catch (PDOException $e) {
            // En un entorno de producción, no deberías mostrar errores detallados.
            // Considera registrar el error en un archivo de log.
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos.']);
            exit();
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

// Función global para obtener la instancia de la conexión
function obtenerConexion() {
    static $db_instance = null;
    if ($db_instance === null) {
        $db_instance = new ConexionDB();
    }
    return $db_instance;
}
?>
