<?php
require_once __DIR__ . '/../config/conexion.php';

class Plano {
    private $db;

    public function __construct() {
        $this->db = obtenerConexion();
    }

    public function obtenerPlanoCompleto() {
        $sqlUbicaciones = "SELECT id_ubicaciones_mesas, id_ubicaciones_mesas as id_ubicacion_mesa, nombre_ubicacion FROM ubicaciones_mesas WHERE estado = 'Activo' ORDER BY id_ubicaciones_mesas ASC";
        $ubicaciones = $this->db->consultar($sqlUbicaciones);

        $plano = [];

        foreach ($ubicaciones as $ubicacion) {
            $sqlMesas = "SELECT 
                            m.id_salones_mesas as id, 
                            m.identificador as number, 
                            m.descripcion, 
                            m.estado,
                            IFNULL(m.x, 0) as x, 
                            IFNULL(m.y, 0) as y,
                            IFNULL(m.row, 1) as row, 
                            IFNULL(m.col, 1) as col,
                            IFNULL(m.shape, 'rectangle') as shape,
                            IFNULL(fm.cantidad_personas, 0) as cantidad_personas
                         FROM salones_mesas m
                         LEFT JOIN facturas_maestro fm ON m.id_salones_mesas = fm.id_mesa AND fm.estado = 'credito'
                         WHERE m.id_ubicacion_mesa = ?";
            
            $mesas = $this->db->consultar($sqlMesas, [$ubicacion['id_ubicaciones_mesas']]);

            $plano[] = [
                'id' => $ubicacion['id_ubicaciones_mesas'],
                'name' => $ubicacion['nombre_ubicacion'],
                'tables' => $mesas
            ];
        }

        return $plano;
    }

    public function guardarPlano($planoData) {
        $this->db->iniciarTransaccion();
        try {
            $ubicacionesEnDB = $this->db->consultar("SELECT id_ubicaciones_mesas FROM ubicaciones_mesas WHERE estado = 'Activo'");
            $idsEnDB = array_column($ubicacionesEnDB, 'id_ubicaciones_mesas');

            $idsFrontend = array_column($planoData, 'id');

            $zonasAEliminar = array_diff($idsEnDB, $idsFrontend);
            foreach ($zonasAEliminar as $idZona) {
                $this->db->ejecutar("UPDATE ubicaciones_mesas SET estado = 'Inactivo' WHERE id_ubicaciones_mesas = ?", [$idZona]);
            }

            foreach ($planoData as $zona) {
                $idUbicacion = $zona['id'];
                $nombreZona = $zona['name'];
                $mesasFrontend = $zona['tables'];

                if (in_array($idUbicacion, $idsEnDB)) {
                    $this->db->ejecutar("UPDATE ubicaciones_mesas SET nombre_ubicacion = ? WHERE id_ubicaciones_mesas = ?", [$nombreZona, $idUbicacion]);
                } else {
                    $this->db->ejecutar("INSERT INTO ubicaciones_mesas (nombre_ubicacion, estado) VALUES (?, 'Activo')", [$nombreZona]);
                    $idUbicacion = $this->db->ultimoId();
                }

                $mesasEnDB = $this->db->consultar("SELECT id_salones_mesas FROM salones_mesas WHERE id_ubicacion_mesa = ?", [$idUbicacion]);
                $idsMesasEnDB = array_column($mesasEnDB, 'id_salones_mesas');
                $idsMesasFrontend = [];

                foreach ($mesasFrontend as $mesa) {
                    $x = $mesa['x'] ?? 0;
                    $y = $mesa['y'] ?? 0;
                    $shape = $mesa['shape'] ?? 'rectangle';

                    if (strpos($mesa['id'], 'temp-') === 0) {
                        $sqlInsertMesa = "INSERT INTO salones_mesas (identificador, descripcion, estado, id_ubicacion_mesa, x, y, shape) VALUES (?, ?, 'disponible', ?, ?, ?, ?)";
                        $this->db->ejecutar($sqlInsertMesa, [$mesa['number'], $mesa['descripcion'] ?? '', $idUbicacion, $x, $y, $shape]);
                    } else {
                        $idsMesasFrontend[] = $mesa['id'];
                        $sqlUpdateMesa = "UPDATE salones_mesas SET x = ?, y = ?, shape = ?, identificador = ?, descripcion = ? WHERE id_salones_mesas = ?";
                        $this->db->ejecutar($sqlUpdateMesa, [$x, $y, $shape, $mesa['number'], $mesa['descripcion'] ?? '', $mesa['id']]);
                    }
                }

                $idsMesasAEliminar = array_diff($idsMesasEnDB, $idsMesasFrontend);
                if (!empty($idsMesasAEliminar)) {
                    foreach ($idsMesasAEliminar as $idMesa) {
                        $this->db->ejecutar("DELETE FROM salones_mesas WHERE id_salones_mesas = ?", [$idMesa]);
                    }
                }
            }

            $this->db->confirmarTransaccion();
            return true;
        } catch (Exception $e) {
            $this->db->cancelarTransaccion();
            error_log('Error al guardar plano: ' . $e->getMessage());
            return false;
        }
    }
}
?>
