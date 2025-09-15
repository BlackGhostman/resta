CREATE TABLE IF NOT EXISTS `medidas` (
  `id_medidas` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) NOT NULL,
  `abreviatura` varchar(10) NOT NULL,
  PRIMARY KEY (`id_medidas`),
  UNIQUE KEY `descripcion` (`descripcion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Puedes agregar algunas unidades de medida de ejemplo
INSERT INTO `medidas` (`descripcion`, `abreviatura`) VALUES
('Unidad', 'unid'),
('Kilogramo', 'kg'),
('Litro', 'lt'),
('Botella 750ml', 'bot750');
