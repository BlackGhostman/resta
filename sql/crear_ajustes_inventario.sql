CREATE TABLE IF NOT EXISTS `ajustes_inventario` (
  `id_ajuste_inventario` int(11) NOT NULL AUTO_INCREMENT,
  `id_articulo` int(11) NOT NULL,
  `id_tipo_ajuste` int(11) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `observaciones` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_ajuste_inventario`),
  KEY `id_articulo` (`id_articulo`),
  KEY `id_tipo_ajuste` (`id_tipo_ajuste`),
  CONSTRAINT `ajustes_inventario_ibfk_1` FOREIGN KEY (`id_articulo`) REFERENCES `articulos` (`id_articulos`),
  CONSTRAINT `ajustes_inventario_ibfk_2` FOREIGN KEY (`id_tipo_ajuste`) REFERENCES `tipos_ajuste_inventario` (`id_tipos_ajuste`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
