<?php
require_once __DIR__ . '/../config/conexion.php';

class Articulos {
    private $db;

    public function __construct() {
        $this->db = obtenerConexion();
    }

    public function obtenerTodos() {
        $sql = "SELECT 
                    a.id_articulos, a.nombre, a.precio_venta, a.existencia,
                    f.descripcion as familia, 
                    sf.descripcion as subfamilia
                FROM articulos a
                LEFT JOIN familias f ON a.id_familia = f.id_familias
                LEFT JOIN subfamilias sf ON a.id_subfamilia = sf.id_subfamilias
                ORDER BY a.nombre ASC";
        return $this->db->consultar($sql);
    }

    public function obtenerPorId($id) {
        $sql = "SELECT * FROM articulos WHERE id_articulos = ?";
        $result = $this->db->consultar($sql, [$id]);
        return !empty($result) ? $result[0] : null;
    }

    private function prepararDatos($datos) {
        // Asegurarse de que los campos numéricos vacíos sean nulos
        $camposNumericos = ['costo_promedio', 'precio_venta', 'impuesto_porcentaje', 'existencia', 'stock_minimo', 'id_proveedor', 'id_familia', 'id_subfamilia', 'id_ubicacion_inventario', 'id_medida'];
        foreach ($camposNumericos as $campo) {
            if (isset($datos[$campo]) && $datos[$campo] === '') {
                $datos[$campo] = null;
            }
        }

        // Manejar checkbox
        $datos['es_inventariable'] = isset($datos['es_inventariable']) ? 1 : 0;
        
        return $datos;
    }

    public function crear($datos) {
        $datos = $this->prepararDatos($datos);

        $sql = "INSERT INTO articulos (nombre, id_proveedor, id_familia, id_subfamilia, id_ubicacion_inventario, id_medida, costo_promedio, precio_venta, impuesto_porcentaje, existencia, stock_minimo, es_inventariable) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $params = [
            $datos['nombre'],
            $datos['id_proveedor'],
            $datos['id_familia'],
            $datos['id_subfamilia'],
            $datos['id_ubicacion_inventario'],
            $datos['id_medida'],
            $datos['costo_promedio'],
            $datos['precio_venta'],
            $datos['impuesto_porcentaje'],
            $datos['existencia'],
            $datos['stock_minimo'],
            $datos['es_inventariable']
        ];
        
        return $this->db->ejecutar($sql, $params);
    }

    public function actualizar($id, $datos) {
        $datos = $this->prepararDatos($datos);

        $sql = "UPDATE articulos SET 
                    nombre = ?, id_proveedor = ?, id_familia = ?, id_subfamilia = ?, id_ubicacion_inventario = ?, id_medida = ?, 
                    costo_promedio = ?, precio_venta = ?, impuesto_porcentaje = ?, existencia = ?, stock_minimo = ?, es_inventariable = ?
                WHERE id_articulos = ?";

        $params = [
            $datos['nombre'],
            $datos['id_proveedor'],
            $datos['id_familia'],
            $datos['id_subfamilia'],
            $datos['id_ubicacion_inventario'],
            $datos['id_medida'],
            $datos['costo_promedio'],
            $datos['precio_venta'],
            $datos['impuesto_porcentaje'],
            $datos['existencia'],
            $datos['stock_minimo'],
            $datos['es_inventariable'],
            $id
        ];

        return $this->db->ejecutar($sql, $params);
    }

    public function eliminar($id) {
        $sql = "DELETE FROM articulos WHERE id_articulos = ?";
        return $this->db->ejecutar($sql, [$id]);
    }
}
?>
