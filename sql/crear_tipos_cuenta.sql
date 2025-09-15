CREATE TABLE IF NOT EXISTS `tipos_cuenta` (
  `id_tipo_cuenta` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_tipo_cuenta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertar los valores iniciales
INSERT INTO `tipos_cuenta` (`id_tipo_cuenta`, `nombre`) VALUES
(1, 'Entrada'),
(2, 'Salida');
