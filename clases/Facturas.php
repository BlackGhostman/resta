<?php
require_once __DIR__ . '/../config/conexion.php';

class Facturas {
    private $db;

    public function __construct() {
        $this->db = obtenerConexion();
    }

    public function agregarArticulo($id_mesa, $id_articulo, $cantidad) {
        try {
            $this->db->iniciarTransaccion();

            // 1. Obtener el id_facturas_maestro de la mesa que está en estado 'credito'
            $sql_factura_id = "SELECT id_facturas_maestro FROM facturas_maestro WHERE id_mesa = ? AND estado = 'credito'";
            $factura_maestro = $this->db->consultar($sql_factura_id, [$id_mesa]);

            if (empty($factura_maestro)) {
                throw new Exception("No se encontró una factura abierta para esta mesa.");
            }
            $id_facturas_maestro = $factura_maestro[0]['id_facturas_maestro'];

            // 2. Obtener datos del artículo (precio, costo, impuesto)
            $sql_articulo = "SELECT precio_venta, costo_promedio, impuesto_porcentaje FROM articulos WHERE id_articulos = ?";
            $articulo = $this->db->consultar($sql_articulo, [$id_articulo]);

            if (empty($articulo)) {
                throw new Exception("El artículo no existe.");
            }
            $precio_unitario = $articulo[0]['precio_venta'];
            $costo_unitario = $articulo[0]['costo_promedio'];
            $impuesto_porcentaje = $articulo[0]['impuesto_porcentaje'];

            // 3. Calcular valores para la línea de detalle
            $subtotal_linea = $cantidad * $precio_unitario;
            $monto_impuesto_linea = $subtotal_linea * ($impuesto_porcentaje / 100);
            $monto_descuento_linea = 0; // Valor predeterminado
                        $es_cortesia = 0; // Valor predeterminado para el tipo 'bit' (0 = No)

            // 4. Insertar en facturas_detalle
            $sql_detalle = "INSERT INTO facturas_detalle (id_factura_maestro, id_articulo, cantidad, precio_unitario, costo_unitario, monto_impuesto_linea, monto_descuento_linea, es_cortesia) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $this->db->ejecutar($sql_detalle, [$id_facturas_maestro, $id_articulo, $cantidad, $precio_unitario, $costo_unitario, $monto_impuesto_linea, $monto_descuento_linea, $es_cortesia]);

            // 5. Actualizar los totales en facturas_maestro
            $sql_update_maestro = "UPDATE facturas_maestro SET subtotal = subtotal + ?, monto_impuestos = monto_impuestos + ?, total_factura = total_factura + ? WHERE id_facturas_maestro = ?";
            $total_linea = $subtotal_linea + $monto_impuesto_linea;
            $this->db->ejecutar($sql_update_maestro, [$subtotal_linea, $monto_impuesto_linea, $total_linea, $id_facturas_maestro]);

            $this->db->confirmarTransaccion();

            return true;

        } catch (Exception $e) {
            $this->db->cancelarTransaccion();
            // Re-lanzar la excepción para que el controlador de la API la maneje
            throw $e;
        }
    }

    public function agregarArticulosAFactura($id_factura, $articulos) {
        if (empty($articulos)) {
            throw new Exception("La lista de artículos no puede estar vacía.");
        }

        try {
            $this->db->iniciarTransaccion();


            $total_subtotal_pedido = 0;
            $total_impuestos_pedido = 0;

            // 2. Recorrer cada artículo del pedido e insertarlo
            foreach ($articulos as $item) {
                $id_articulo = $item['id_articulos'];
                $cantidad = $item['cantidad'];

                // Obtener detalles del artículo de la BD para seguridad
                $sql_articulo = "SELECT precio_venta, costo_promedio, impuesto_porcentaje FROM articulos WHERE id_articulos = ?";
                $articulo_db = $this->db->consultar($sql_articulo, [$id_articulo]);
                if (empty($articulo_db)) {
                    throw new Exception("El artículo con ID {$id_articulo} no existe.");
                }

                $precio_unitario = $articulo_db[0]['precio_venta'];
                $costo_unitario = $articulo_db[0]['costo_promedio'];
                $impuesto_porcentaje = $articulo_db[0]['impuesto_porcentaje'];

                // Calcular valores para la línea
                $subtotal_linea = $cantidad * $precio_unitario;
                $monto_impuesto_linea = $subtotal_linea * ($impuesto_porcentaje / 100);
                $monto_descuento_linea = 0; // Valor predeterminado
                $es_cortesia = 0; // 0 = No

                // Acumular totales para la actualización final
                $total_subtotal_pedido += $subtotal_linea;
                $total_impuestos_pedido += $monto_impuesto_linea;

                // Insertar en facturas_detalle
                                $sql_detalle = "INSERT INTO facturas_detalle (id_factura_maestro, id_articulo, cantidad, precio_unitario, costo_unitario, monto_impuesto_linea, monto_descuento_linea, es_cortesia) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                $this->db->ejecutar($sql_detalle, [$id_factura, $id_articulo, $cantidad, $precio_unitario, $costo_unitario, $monto_impuesto_linea, $monto_descuento_linea, $es_cortesia]);
            }

            // 3. Actualizar los totales en facturas_maestro una sola vez
            $total_pedido = $total_subtotal_pedido + $total_impuestos_pedido;
            $sql_update_maestro = "UPDATE facturas_maestro SET subtotal = subtotal + ?, monto_impuestos = monto_impuestos + ?, total_factura = total_factura + ? WHERE id_facturas_maestro = ?";
            $this->db->ejecutar($sql_update_maestro, [$total_subtotal_pedido, $total_impuestos_pedido, $total_pedido, $id_factura]);

            $this->db->confirmarTransaccion();

            return true;
        } catch (Exception $e) {
            $this->db->cancelarTransaccion();
            throw $e;
        }
    }

    /**
     * Obtener mesas ocupadas
     */
    public function obtenerMesasOcupadas() {
        $sql = "SELECT id_salones_mesas, identificador, descripcion 
                FROM salones_mesas 
                WHERE estado = 'ocupada'
                ORDER BY identificador";
        return $this->db->consultar($sql);
    }

    /**
     * Obtener tipos de pago
     */
    public function obtenerTiposPago() {
        $sql = "SELECT id_tipos_pago, descripcion 
                FROM tipos_pago 
                ORDER BY descripcion";
        return $this->db->consultar($sql);
    }

    /**
     * Buscar artículos por nombre
     */
    public function buscarArticulos($query) {
        $sql = "SELECT id_articulos, nombre, precio_venta, existencia
                FROM articulos 
                WHERE nombre LIKE ? 
                AND existencia > 0
                ORDER BY nombre
                LIMIT 20";
        return $this->db->consultar($sql, ['%' . $query . '%']);
    }

    /**
     * Crear factura completa (nueva versión para facturar.html)
     */
    public function crearFacturaCompleta($datos, $idUsuario) {
        try {
            $this->db->iniciarTransaccion();

            // 1. Crear factura maestro
            $sqlMaestro = "INSERT INTO facturas_maestro (
                id_cliente, id_usuario, id_mesa, id_tipo_pago,
                subtotal, monto_descuento, monto_impuestos, total_factura,
                estado, cantidad_personas, nombre_cliente
            ) VALUES (
                NULL, ?, ?, ?,
                ?, ?, ?, ?,
                'pagada', ?, ?
            )";

            $this->db->ejecutar($sqlMaestro, [
                $idUsuario,
                $datos['id_mesa'],
                $datos['id_tipo_pago'],
                $datos['subtotal'],
                $datos['descuento'],
                $datos['impuestos'],
                $datos['total'],
                $datos['cantidad_personas'],
                $datos['nombre_cliente']
            ]);

            $idFactura = $this->db->obtenerUltimoId();

            // 2. Crear detalle de factura
            $sqlDetalle = "INSERT INTO facturas_detalle (
                id_factura_maestro, id_articulo, cantidad, 
                precio_unitario, costo_unitario, monto_impuesto_linea, 
                monto_descuento_linea, es_cortesia
            ) VALUES (?, ?, ?, ?, 0, 0, 0, 0)";

            foreach ($datos['articulos'] as $articulo) {
                $this->db->ejecutar($sqlDetalle, [
                    $idFactura,
                    $articulo['id'],
                    $articulo['cantidad'],
                    $articulo['precio']
                ]);

                // 3. Descontar del inventario (solo si es inventariable)
                $this->descontarInventario($articulo['id'], $articulo['cantidad']);
            }

            // 4. Actualizar estado de la mesa a disponible
            $sqlMesa = "UPDATE salones_mesas 
                        SET estado = 'disponible' 
                        WHERE id_salones_mesas = ?";
            $this->db->ejecutar($sqlMesa, [$datos['id_mesa']]);

            $this->db->confirmarTransaccion();

            return [
                'success' => true,
                'message' => 'Factura creada exitosamente',
                'id_factura' => $idFactura
            ];

        } catch (Exception $e) {
            $this->db->cancelarTransaccion();
            return [
                'success' => false,
                'message' => 'Error al crear factura: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Descontar artículo del inventario
     */
    private function descontarInventario($idArticulo, $cantidad) {
        // Verificar si el artículo es inventariable
        $sql = "SELECT es_inventariable FROM articulos WHERE id_articulos = ?";
        $articulo = $this->db->consultar($sql, [$idArticulo]);

        if (!empty($articulo) && $articulo[0]['es_inventariable']) {
            // Descontar del inventario
            $sqlUpdate = "UPDATE articulos 
                          SET existencia = existencia - ? 
                          WHERE id_articulos = ?";
            $this->db->ejecutar($sqlUpdate, [$cantidad, $idArticulo]);
        }
    }
}
?>
