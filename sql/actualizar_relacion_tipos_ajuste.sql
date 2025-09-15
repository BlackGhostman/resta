-- Añadir la clave foránea a la tabla tipos_ajuste_inventario
ALTER TABLE `tipos_ajuste_inventario`
ADD CONSTRAINT `fk_tipo_cuenta`
FOREIGN KEY (`tipo_cuenta`)
REFERENCES `tipos_cuenta`(`id_tipo_cuenta`)
ON DELETE RESTRICT ON UPDATE CASCADE;
