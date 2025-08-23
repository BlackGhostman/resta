<?php
require_once __DIR__ . '/../config/conexion.php';

class Plano extends ConexionDB {

    public function __construct() {
        parent::__construct();
    }

    public function obtenerPlanoCompleto() {
        $zonas_sql = "SELECT id_ubicaciones_mesas as id, nombre_ubicacion as nombre FROM ubicaciones_mesas ORDER BY id_ubicaciones_mesas ASC";
        $zonas = $this->consultar($zonas_sql);

        $plano = [];

        foreach ($zonas as $zona) {
            $zona_id = $zona['id'];

            $mesas_sql = "SELECT id_salones_mesas as id, identificador as number, shape, x, y, 50 as ancho, 50 as alto FROM salones_mesas WHERE id_ubicacion_mesa = ?";
            $mesas = $this->consultar($mesas_sql, [$zona_id]);

            $paredes_sql = "SELECT id, x1, y1, x2, y2 FROM paredes WHERE zona_id = ?";
            $paredes_db = $this->consultar($paredes_sql, [$zona_id]);
            $paredes = array_map(function($p) {
                return [
                    'id' => 'wall-' . $p['id'],
                    'startRow' => ($p['y1'] / 40) + 1,
                    'startCol' => ($p['x1'] / 40) + 1,
                    'endRow' => ($p['y2'] / 40) + 1,
                    'endCol' => ($p['x2'] / 40) + 1,
                ];
            }, $paredes_db);

            $decoraciones_sql = "SELECT id, tipo as type, x, y, ancho, alto FROM decoraciones WHERE zona_id = ?";
            $decoraciones_db = $this->consultar($decoraciones_sql, [$zona_id]);
            $decoraciones = array_map(function($d) {
                $d['id'] = 'decor-' . $d['id'];
                return $d;
            }, $decoraciones_db);

            $plano[] = [
                'id' => $zona['id'],
                'name' => $zona['nombre'],
                'tables' => $mesas,
                'walls' => $paredes,
                'decorations' => $decoraciones
            ];
        }

        return $plano;
    }

    public function guardarPlano($planoData) {
        $this->iniciarTransaccion();
        try {
            foreach ($planoData as $zona) {
                if (empty($zona['id']) || empty($zona['tables'])) {
                    continue;
                }
                $zona_id = $zona['id'];

                // Guardar decoraciones
                if (isset($zona['decorations'])) {
                    // Primero, eliminar las decoraciones existentes para esta zona
                    $this->ejecutar("DELETE FROM decoraciones WHERE zona_id = ?", [$zona_id]);

                    foreach ($zona['decorations'] as $deco) {
                        // El frontend no envía ancho/alto, así que los calculamos aquí si es necesario.
                        // Por ahora, los dejaremos en 0, ya que el frontend los calcula al renderizar.
                        $ancho = $deco['ancho'] ?? 40;
                        $alto = $deco['alto'] ?? 40;

                        $this->ejecutar(
                            "INSERT INTO decoraciones (zona_id, tipo, x, y, ancho, alto) VALUES (?, ?, ?, ?, ?, ?)",
                            [$zona_id, $deco['type'], $deco['x'], $deco['y'], $ancho, $alto]
                        );
                    }
                }

                // Guardar paredes
                if (isset($zona['walls'])) {
                    // Primero, eliminar las paredes existentes para esta zona
                    $this->ejecutar("DELETE FROM paredes WHERE zona_id = ?", [$zona_id]);

                    foreach ($zona['walls'] as $pared) {
                        // Convertir de coordenadas de grid a pixeles
                        $x1 = ($pared['startCol'] - 1) * 40;
                        $y1 = ($pared['startRow'] - 1) * 40;
                        $x2 = ($pared['endCol'] - 1) * 40;
                        $y2 = ($pared['endRow'] - 1) * 40;

                        $this->ejecutar(
                            "INSERT INTO paredes (zona_id, x1, y1, x2, y2) VALUES (?, ?, ?, ?, ?)",
                            [$zona_id, $x1, $y1, $x2, $y2]
                        );
                    }
                }

                foreach ($zona['tables'] as $mesa) {
                    if (strpos($mesa['id'], 'temp-') !== false) {
                        $this->ejecutar(
                            "INSERT INTO salones_mesas (identificador, shape, x, y, id_ubicacion_mesa) VALUES (?, ?, ?, ?, ?)",
                            [$mesa['number'], $mesa['shape'], $mesa['x'], $mesa['y'], $zona_id]
                        );
                    } else {
                        $this->ejecutar(
                            "UPDATE salones_mesas SET x = ?, y = ?, identificador = ?, shape = ? WHERE id_salones_mesas = ?",
                            [$mesa['x'], $mesa['y'], $mesa['number'], $mesa['shape'], $mesa['id']]
                        );
                    }
                }
            }
            $this->confirmarTransaccion();
            return true;
        } catch (Exception $e) {
            $this->cancelarTransaccion();
            error_log('Error al guardar plano: ' . $e->getMessage());
            return false;
        }
    }
}
?>
