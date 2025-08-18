<?php
require_once __DIR__ . '/../config/conexion.php';

class Plano {
    private $db;

    public function __construct() {
        $this->db = obtenerConexion();
    }

    public function obtenerPlanoCompleto() {
        $sqlUbicaciones = "SELECT id_ubicaciones_mesas, nombre_ubicacion FROM ubicaciones_mesas WHERE estado = 'Activo'";
        $ubicaciones = $this->db->consultar($sqlUbicaciones);

        $plano = [];

        foreach ($ubicaciones as $ubicacion) {
            $sqlMesas = "SELECT 
                            id_salones_mesas as id, 
                            identificador as number, 
                            descripcion, 
                            estado,
                            ISNULL(row, 1) as row, 
                            ISNULL(col, 1) as col
                         FROM salones_mesas 
                         WHERE id_ubicacion_mesa = ?";
            
            $mesas = $this->db->consultar($sqlMesas, [$ubicacion['id_ubicaciones_mesas']]);
            $plano[$ubicacion['nombre_ubicacion']] = $mesas;
        }

        return $plano;
    }

    public function guardarPlano($planoData) {
        $this->db->iniciarTransaccion();
        try {
            // Zonas actuales en la BD
            $ubicacionesEnDB = $this->db->consultar("SELECT id_ubicaciones_mesas, nombre_ubicacion FROM ubicaciones_mesas WHERE estado = 'Activo'");
            $mapNombreIdDB = array_column($ubicacionesEnDB, 'id_ubicaciones_mesas', 'nombre_ubicacion');

            $nombresZonasFrontend = array_keys($planoData);

            // Detectar zonas eliminadas
            $zonasAEliminar = array_diff(array_keys($mapNombreIdDB), $nombresZonasFrontend);
            if (!empty($zonasAEliminar)) {
                foreach ($zonasAEliminar as $nombreZona) {
                    $idUbicacion = $mapNombreIdDB[$nombreZona];
                    $this->db->ejecutar("UPDATE ubicaciones_mesas SET estado = 'Inactivo' WHERE id_ubicaciones_mesas = ?", [$idUbicacion]);
                }
            }

            foreach ($planoData as $nombreZona => $mesasFrontend) {
                $idUbicacion = null;
                if (isset($mapNombreIdDB[$nombreZona])) {
                    $idUbicacion = $mapNombreIdDB[$nombreZona];
                } else {
                    // Crear nueva zona
                    $this->db->ejecutar("INSERT INTO ubicaciones_mesas (nombre_ubicacion, estado) VALUES (?, 'Activo')", [$nombreZona]);
                    $idUbicacion = $this->db->ultimoId();
                }

                // Mesas actuales de esta zona en la BD
                $mesasEnDB = $this->db->consultar("SELECT id_salones_mesas FROM salones_mesas WHERE id_ubicacion_mesa = ?", [$idUbicacion]);
                $idsMesasEnDB = array_column($mesasEnDB, 'id_salones_mesas');
                
                $idsMesasFrontend = [];

                foreach ($mesasFrontend as $mesa) {
                    // Si el ID es temporal, es una mesa nueva
                    if (strpos($mesa['id'], 'temp-') === 0) {
                        $sqlInsertMesa = "INSERT INTO salones_mesas (identificador, descripcion, estado, id_ubicacion_mesa, row, col) VALUES (?, ?, 'disponible', ?, ?, ?)";
                        $this->db->ejecutar($sqlInsertMesa, [$mesa['number'], $mesa['descripcion'], $idUbicacion, $mesa['row'], $mesa['col']]);
                    } else {
                        // Es una mesa existente, actualizarla
                        $idsMesasFrontend[] = $mesa['id'];
                        $sqlUpdateMesa = "UPDATE salones_mesas SET row = ?, col = ?, identificador = ?, descripcion = ? WHERE id_salones_mesas = ?";
                        $this->db->ejecutar($sqlUpdateMesa, [$mesa['row'], $mesa['col'], $mesa['number'], $mesa['descripcion'], $mesa['id']]);
                    }
                }

                // Detectar mesas eliminadas
                $idsMesasAEliminar = array_diff($idsMesasEnDB, $idsMesasFrontend);
                if (!empty($idsMesasAEliminar)) {
                    foreach ($idsMesasAEliminar as $idMesa) {
                        // Opcional: cambiar estado a 'inactivo' en lugar de borrar
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
