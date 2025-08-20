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
                $sql_detalle = "INSERT INTO facturas_detalle (id_factura_maestro, id_articulo, cantidad, precio_venta, costo_unitario, monto_impuesto, monto_descuento, es_cortesia) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
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
}
?>
