CREATE TABLE IF NOT EXISTS `ubicaciones_inventario` (
  `id_ubicacion_inventario` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) NOT NULL,
  PRIMARY KEY (`id_ubicacion_inventario`),
  UNIQUE KEY `descripcion` (`descripcion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Puedes agregar algunas ubicaciones de ejemplo si quieres
INSERT INTO `ubicaciones_inventario` (`descripcion`) VALUES
('Bodega Principal'),
('Barra'),
('Refrigerador Cocina');
