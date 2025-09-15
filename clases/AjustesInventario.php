<?php
require_once __DIR__ . '/../config/conexion.php';

class AjustesInventario {
    private $db;

    public function __construct() {
        $this->db = obtenerConexion();
    }

    public function obtenerTodos() {
        $sql = "SELECT 
                    aj.id_ajuste_inventario,
                    a.nombre as articulo_nombre,
                    ta.nombre as tipo_ajuste_nombre,
                    aj.cantidad,
                    aj.observaciones,
                    aj.fecha,
                    CASE ta.tipo_cuenta
                        WHEN 1 THEN 'Entrada'
                        WHEN 2 THEN 'Salida'
                    END as tipo_movimiento
                FROM ajustes_inventario aj
                JOIN articulos a ON aj.id_articulo = a.id_articulos
                JOIN tipos_ajuste_inventario ta ON aj.id_tipo_ajuste = ta.id_tipos_ajuste
                ORDER BY aj.fecha DESC";
        return $this->db->consultar($sql);
    }

    public function crear($datos) {
        $this->db->getConexion()->beginTransaction();

        try {
            // 1. Obtener el tipo de cuenta (1 para Entrada, 2 para Salida)
            $sqlTipo = "SELECT tipo_cuenta FROM tipos_ajuste_inventario WHERE id_tipos_ajuste = ?";
            $tipoAjuste = $this->db->consultar($sqlTipo, [$datos['id_tipo_ajuste']]);
            if (empty($tipoAjuste)) {
                throw new Exception("El tipo de ajuste no existe.");
            }
            $tipoCuenta = $tipoAjuste[0]['tipo_cuenta'];

            // 2. Insertar el registro de ajuste
            $sqlAjuste = "INSERT INTO ajustes_inventario (id_articulo, id_tipo_ajuste, cantidad, observaciones) VALUES (?, ?, ?, ?)";
            $this->db->ejecutar($sqlAjuste, [
                $datos['id_articulo'],
                $datos['id_tipo_ajuste'],
                $datos['cantidad'],
                $datos['observaciones']
            ]);

            // 3. Actualizar el stock del artículo
            $cantidad = floatval($datos['cantidad']);
            if ($tipoCuenta == 1) { // Entrada
                $sqlStock = "UPDATE articulos SET existencia = existencia + ? WHERE id_articulos = ?";
            } elseif ($tipoCuenta == 2) { // Salida
                $sqlStock = "UPDATE articulos SET existencia = existencia - ? WHERE id_articulos = ?";
            } else {
                throw new Exception("Tipo de cuenta desconocido.");
            }
            
            $this->db->ejecutar($sqlStock, [$cantidad, $datos['id_articulo']]);

            // 4. Confirmar la transacción
            $this->db->getConexion()->commit();
            return true;

        } catch (Exception $e) {
            // Si algo falla, revertir todo
            $this->db->getConexion()->rollBack();
            throw new Exception("Error al crear el ajuste: " . $e->getMessage());
        }
    }
    
    // Nota: No se implementan 'actualizar' ni 'eliminar' para mantener la integridad del historial de inventario.
    // Los ajustes incorrectos deben ser corregidos con un nuevo ajuste de contrapartida.
}
?>
