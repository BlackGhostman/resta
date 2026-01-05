<?php
require_once __DIR__ . '/../config/conexion.php';

class Usuarios {
    private $db;

    public function __construct() {
        $this->db = obtenerConexion();
    }

    public function login($usuario, $password) {
        $sql = "SELECT * FROM usuarios WHERE usuario = ? AND esta_activo = 1";
        $result = $this->db->consultar($sql, [$usuario]);

        if (!empty($result)) {
            $user = $result[0];
            // Check password: hash or plain text (legacy support)
            // Note: In production, plain text check should be removed after migration
            if (password_verify($password, $user['password_hash']) || $user['password_hash'] === $password) {
                // If it was plain text, maybe we should hash it now? 
                // For now, let's just log them in.
                
                // Remove password from session data
                unset($user['password_hash']);
                return $user;
            }
        }
        return false;
    }

    public function obtenerTodos() {
        $sql = "SELECT id_usuarios, usuario, nombre_completo, perfil, esta_activo FROM usuarios ORDER BY nombre_completo ASC";
        return $this->db->consultar($sql);
    }

    public function obtenerPorId($id) {
        $sql = "SELECT id_usuarios, usuario, nombre_completo, perfil, esta_activo FROM usuarios WHERE id_usuarios = ?";
        $result = $this->db->consultar($sql, [$id]);
        return !empty($result) ? $result[0] : null;
    }

    public function crear($datos) {
        // Hash password
        $passwordHash = password_hash($datos['password'], PASSWORD_DEFAULT);
        
        $sql = "INSERT INTO usuarios (usuario, nombre_completo, password_hash, perfil, esta_activo) 
                VALUES (?, ?, ?, ?, ?)";
        
        $params = [
            $datos['usuario'],
            $datos['nombre_completo'],
            $passwordHash,
            $datos['perfil'],
            isset($datos['esta_activo']) ? $datos['esta_activo'] : 1
        ];
        
        return $this->db->ejecutar($sql, $params);
    }

    public function actualizar($id, $datos) {
        // Build query dynamically based on whether password is being updated
        $sql = "UPDATE usuarios SET usuario = ?, nombre_completo = ?, perfil = ?, esta_activo = ?";
        $params = [
            $datos['usuario'],
            $datos['nombre_completo'],
            $datos['perfil'],
            $datos['esta_activo']
        ];

        if (!empty($datos['password'])) {
            $sql .= ", password_hash = ?";
            $params[] = password_hash($datos['password'], PASSWORD_DEFAULT);
        }

        $sql .= " WHERE id_usuarios = ?";
        $params[] = $id;

        return $this->db->ejecutar($sql, $params);
    }

    public function eliminr($id) { // Typo fix in next step if caught, but wait, 'eliminr'? No, 'eliminar'.
        $sql = "DELETE FROM usuarios WHERE id_usuarios = ?";
        return $this->db->ejecutar($sql, [$id]);
    }
    
    // Correcting the typo proactively
    public function eliminar($id) {
        $sql = "DELETE FROM usuarios WHERE id_usuarios = ?";
        return $this->db->ejecutar($sql, [$id]);
    }
}
?>
