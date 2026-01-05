-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 05-01-2026 a las 15:01:36
-- Versión del servidor: 11.8.3-MariaDB-log
-- Versión de PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `u876327316_resta`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ajustes_inventario`
--

CREATE TABLE `ajustes_inventario` (
  `id_ajuste_inventario` int(11) NOT NULL,
  `id_articulo` int(11) NOT NULL,
  `id_tipo_ajuste` int(11) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `observaciones` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `ajustes_inventario`
--

INSERT INTO `ajustes_inventario` (`id_ajuste_inventario`, `id_articulo`, `id_tipo_ajuste`, `cantidad`, `observaciones`, `fecha`) VALUES
(1, 1072, 1, 25.00, 'lo que sea', '2025-09-15 20:23:24'),
(2, 1069, 5, 2.00, 'las ocupa otro local', '2025-09-15 20:39:34'),
(3, 852, 1, 50.00, 'INGRESO FACTURA ', '2025-09-19 00:27:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `articulos`
--

CREATE TABLE `articulos` (
  `id_articulos` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `es_inventariable` tinyint(1) NOT NULL DEFAULT 1,
  `es_compuesto` tinyint(1) NOT NULL DEFAULT 0,
  `id_familia` int(11) DEFAULT NULL,
  `id_subfamilia` int(11) DEFAULT NULL,
  `id_proveedor` int(11) DEFAULT NULL,
  `id_medida` int(11) DEFAULT NULL,
  `id_ubicacion_inventario` int(11) DEFAULT NULL,
  `existencia` decimal(12,4) NOT NULL DEFAULT 0.0000,
  `stock_minimo` decimal(12,4) NOT NULL DEFAULT 0.0000,
  `costo_promedio` decimal(12,4) NOT NULL DEFAULT 0.0000,
  `precio_venta` decimal(12,2) NOT NULL,
  `impuesto_porcentaje` decimal(5,2) NOT NULL DEFAULT 0.00,
  `fecha_ultima_compra` datetime DEFAULT NULL,
  `url_imagen` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `articulos`
--

INSERT INTO `articulos` (`id_articulos`, `nombre`, `es_inventariable`, `es_compuesto`, `id_familia`, `id_subfamilia`, `id_proveedor`, `id_medida`, `id_ubicacion_inventario`, `existencia`, `stock_minimo`, `costo_promedio`, `precio_venta`, `impuesto_porcentaje`, `fecha_ultima_compra`, `url_imagen`) VALUES
(852, 'IMPERIAL 350ml', 1, 0, 2, 12, 1, 5, 1, 73.0000, 2.0000, 750.0000, 1400.00, 0.00, '2022-03-15 00:00:00', NULL),
(853, 'IMP LIGTH 350ml', 1, 0, 2, 12, 1, 5, 1, 41.0000, 2.0000, 833.3300, 1400.00, 0.00, '2022-03-15 00:00:00', NULL),
(855, 'PILSEN 350ml', 1, 0, 2, 13, 1, 5, 1, 94.0000, 2.0000, 833.3300, 1400.00, 0.00, '2022-03-15 00:00:00', NULL),
(856, 'CORONA', 1, 0, 2, 23, 1, 5, 1, 8.0000, 5.0000, 0.0000, 2000.00, 0.00, '2022-03-15 00:00:00', NULL),
(857, 'HEINEKEN', 1, 0, 2, 23, 1, 5, 1, 9.0000, 1.0000, 0.0000, 2000.00, 0.00, '2022-03-15 00:00:00', NULL),
(861, 'SMIRNOFF GREEN', 1, 0, 2, 57, 1, 5, 1, 14.0000, 2.0000, 0.0000, 2000.00, 0.00, '2022-03-15 00:00:00', NULL),
(862, 'SMIRNOFF ROJO', 1, 0, 2, 57, 1, 5, 1, 6.0000, 2.0000, 0.0000, 2000.00, 0.00, '2022-03-15 00:00:00', NULL),
(863, 'SMIRNOFF GUARANA', 1, 0, 2, 57, 1, 5, 1, 1.0000, 2.0000, 0.0000, 2000.00, 0.00, '2022-03-15 00:00:00', NULL),
(868, 'CUBA LIBRE LATA', 1, 0, 2, 23, 1, 5, 1, 11.0000, 2.0000, 0.0000, 2000.00, 0.00, '2022-03-15 00:00:00', NULL),
(872, 'IMP ULTRA 350ML', 1, 0, 2, 12, 2, 3, 1, 45.0000, 2.0000, 833.3300, 1400.00, 0.00, '2022-05-24 00:00:00', NULL),
(874, 'IMP SILVER 350ML', 1, 0, 2, 12, 2, 3, 1, 112.0000, 2.0000, 833.3300, 1400.00, 0.00, '2022-05-24 00:00:00', NULL),
(877, 'ROCK LIMÓN 350ML', 1, 0, 2, 23, 2, 5, 1, 21.0000, 2.0000, 0.0000, 1400.00, 0.00, '2022-05-24 00:00:00', NULL),
(878, 'BAVARIA GOLD', 1, 0, 2, 26, 2, 5, 1, 24.0000, 1.0000, 0.0000, 2000.00, 0.00, '2022-05-24 00:00:00', 'https://walmartcr.vtexassets.com/arquivos/ids/921562/11262_01.jpg?v=638826759337670000'),
(879, 'BAVARIA LIGTH', 1, 0, 2, 26, 2, 3, 1, 21.0000, 3.0000, 0.0000, 2000.00, 0.00, '2022-05-24 00:00:00', NULL),
(881, 'Coors Ligth', 1, 0, 2, 23, 2, 3, 1, 13.0000, 2.0000, 0.0000, 1500.00, 0.00, '2022-05-24 00:00:00', NULL),
(882, 'SOL 350ML', 1, 0, 2, 23, 2, 3, 1, 1.0000, 5.0000, 0.0000, 1500.00, 0.00, '2022-05-24 00:00:00', NULL),
(883, 'STELLA', 1, 0, 2, 23, 2, 3, 1, 12.0000, 5.0000, 0.0000, 2000.00, 0.00, '2022-05-24 00:00:00', NULL),
(884, 'MODELO', 1, 0, 2, 23, 2, 3, 1, 6.0000, 2.0000, 0.0000, 2000.00, 0.00, '2022-05-24 00:00:00', NULL),
(887, 'SMIRNOFF NEGRA', 1, 0, 2, 57, 2, 5, 1, 12.0000, 2.0000, 0.0000, 2000.00, 0.00, '2022-05-24 00:00:00', NULL),
(889, 'QUINADA 350 ML', 1, 0, 7, 25, 2, 2, 1, 3.0000, 2.0000, 0.0000, 1300.00, 0.00, '2022-05-24 00:00:00', NULL),
(891, 'CACIQUE 1/2', 1, 0, 3, 29, 2, 3, 1, 22.0000, 0.0000, 0.0000, 4500.00, 0.00, '2022-05-24 00:00:00', NULL),
(892, 'CACIQUE LITRO', 1, 0, 3, 29, 2, 3, 1, 10.0000, 0.0000, 0.0000, 11000.00, 0.00, '2022-05-24 00:00:00', NULL),
(898, 'COCA COLA 350ml', 1, 0, 7, 24, 1, 3, 1, 7.0000, 2.0000, 416.6600, 1300.00, 0.00, '2022-05-24 00:00:00', NULL),
(900, 'GINGER ALE 355ml', 1, 0, 7, 24, 2, 3, 1, 11.0000, 2.0000, 416.6600, 1300.00, 0.00, '2022-05-24 00:00:00', NULL),
(901, 'Fresca 350ml', 1, 0, 7, 24, 2, 3, 1, 53.0000, 0.0000, 0.0000, 1300.00, 0.00, '2022-05-24 00:00:00', NULL),
(904, 'TRO MELOCOTON', 1, 0, 7, 24, 2, 3, 1, 18.0000, 2.0000, 416.0000, 1300.00, 0.00, '2022-05-24 00:00:00', NULL),
(905, 'TRO ARANDANO', 1, 0, 7, 24, 2, 3, 1, 12.0000, 2.0000, 416.0000, 1300.00, 0.00, '2022-05-24 00:00:00', NULL),
(917, 'FANTA KOLITA 350ml', 1, 0, 7, 24, 2, 5, 1, 29.0000, 2.0000, 416.6600, 1300.00, 0.00, '2022-05-24 00:00:00', NULL),
(918, 'FANTA NARANJA 350ml', 1, 0, 7, 24, 2, 5, 1, 23.0000, 2.0000, 416.6600, 1300.00, 0.00, '2022-05-24 00:00:00', NULL),
(925, 'COCA ZERO 350ML', 1, 0, 7, 24, 2, 3, 1, 13.0000, 1.0000, 0.0000, 1300.00, 0.00, '2022-05-24 00:00:00', NULL),
(930, 'CACIQUE TP', 0, 0, 3, 29, 2, 3, 1, 24.0000, 0.0000, 200.0000, 1000.00, 0.00, '2022-05-24 00:00:00', NULL),
(949, 'OLD PAR TP', 0, 0, 3, 39, 2, 3, 1, 100.0000, 0.0000, 0.0000, 2000.00, 0.00, '2022-05-24 00:00:00', NULL),
(955, 'JHONY ROJO TP', 0, 0, 3, 41, 2, 3, 1, 50.0000, 0.0000, 0.0000, 1500.00, 0.00, '2022-05-24 00:00:00', NULL),
(967, 'B&W 1/4', 0, 0, 3, 37, 2, 4, 1, 100.0000, 0.0000, 0.0000, 5000.00, 0.00, '2022-05-24 00:00:00', NULL),
(969, 'B&W TG', 0, 0, 3, 37, 2, 4, 1, 100.0000, 0.0000, 0.0000, 2000.00, 0.00, '2022-05-24 00:00:00', NULL),
(970, 'CHICHARRON CON LIMON', 1, 0, 12, 48, 1, 4, 1, 4.0000, 0.0000, 0.0000, 1300.00, 0.00, '2022-05-25 00:00:00', NULL),
(985, 'CHICHARRON AUTE', 1, 0, 12, 48, 1, 4, 1, 9.0000, 0.0000, 0.0000, 1300.00, 0.00, '2022-05-25 00:00:00', NULL),
(986, 'YUCA SALADITA', 1, 0, 12, 55, 1, 4, 1, 19.0000, 0.0000, 0.0000, 800.00, 0.00, '2022-05-25 00:00:00', NULL),
(987, 'YUCA CREMA CEBOLLA', 0, 0, 12, 55, 1, 4, 1, 12.0000, 0.0000, 0.0000, 800.00, 0.00, '2022-05-25 00:00:00', NULL),
(1004, 'SEMILLAS MIXTAS', 1, 0, 12, 50, 1, 4, 1, 36.0000, 0.0000, 0.0000, 400.00, 0.00, '2022-05-25 00:00:00', NULL),
(1008, 'PASAS CHOCOLATE', 1, 0, 12, 50, 1, 4, 1, 3.0000, 0.0000, 0.0000, 1300.00, 0.00, '2022-05-25 00:00:00', NULL),
(1015, 'WANCHIZ', 1, 0, 12, 54, 1, 4, 1, 68.0000, 0.0000, 0.0000, 600.00, 0.00, '2022-05-25 00:00:00', NULL),
(1050, 'Adan Eva/Frutos Rojos', 0, 0, 2, 23, 2, 3, 1, 38.0000, 2.0000, 0.0000, 2000.00, 0.00, '2022-05-27 00:00:00', NULL),
(1051, 'Vaso Michelado', 0, 0, 13, 58, 1, 3, 1, 1000.0000, 0.0000, 0.0000, 300.00, 0.00, '2022-05-27 00:00:00', NULL),
(1064, 'OLD P L', 0, 0, 3, 39, 1, 3, 1, 6.0000, 0.0000, 0.0000, 42000.00, 0.00, '2022-05-29 00:00:00', NULL),
(1069, 'AGUARD ROJO BOTELLA', 1, 0, 3, 59, 2, 3, 1, -1.0000, 0.0000, 0.0000, 20000.00, 0.00, '2022-06-01 00:00:00', NULL),
(1070, 'AGUARD AZUL TP', 0, 0, 3, 59, 2, 3, 1, 50.0000, 0.0000, 0.0000, 1500.00, 0.00, '2022-06-01 00:00:00', NULL),
(1072, 'AGUARD AZUL BOTELLA', 1, 0, 3, 59, 2, 3, 1, 27.0000, 0.0000, 0.0000, 20000.00, 0.00, '2022-06-01 00:00:00', NULL),
(1074, 'CIGARROS PALL MALL', 1, 0, 13, 58, 1, 5, 1, 245.0000, 0.0000, 0.0000, 2800.00, 0.00, '2022-06-02 00:00:00', NULL),
(1075, 'CIGSUEL', 1, 0, 13, 58, 1, 5, 1, 729.0000, 0.0000, 0.0000, 200.00, 0.00, '2022-06-02 00:00:00', NULL),
(1079, 'FIREBALL TG', 0, 0, 3, 60, 1, 1, 1, 50.0000, 0.0000, 0.0000, 2000.00, 0.00, '2022-06-09 00:00:00', NULL),
(1081, 'DN JULIO TG', 0, 0, 3, 63, 1, 1, 1, 60.0000, 0.0000, 0.0000, 4500.00, 0.00, '2022-06-09 00:00:00', NULL),
(1086, 'Flor de Caña7  Litro', 1, 0, 3, 64, 1, 3, 1, 8.0000, 0.0000, 0.0000, 15000.00, 0.00, '2022-06-15 00:00:00', NULL),
(1088, 'Flor de Caña7 1/4', 1, 0, 3, 64, 1, 3, 1, 198.0000, 0.0000, 0.0000, 4000.00, 0.00, '2022-06-15 00:00:00', NULL),
(1089, 'Flor de Caña7 TG', 0, 0, 3, 64, 1, 3, 1, 15.0000, 0.0000, 0.0000, 1800.00, 0.00, '2022-06-15 00:00:00', NULL),
(1090, 'Flor de Caña7 TP', 0, 0, 3, 64, 1, 3, 1, 10.0000, 0.0000, 0.0000, 1400.00, 0.00, '2022-06-15 00:00:00', NULL),
(1091, 'FIREBALL TP', 0, 0, 3, 60, 1, 1, 1, 100.0000, 0.0000, 0.0000, 1400.00, 0.00, '2022-06-15 00:00:00', NULL),
(1092, 'FIREBALL LITRO', 1, 0, 3, 60, 1, 1, 1, 0.0000, 0.0000, 0.0000, 0.00, 0.00, '2022-06-15 00:00:00', NULL),
(1094, 'B&W LITRO', 0, 0, 3, 37, 1, 4, 1, 42.0000, 0.0000, 0.0000, 20000.00, 0.00, '2022-06-15 00:00:00', NULL),
(1096, 'Buchanans 12 Media', 1, 0, 3, 65, 1, 3, 1, 40.0000, 0.0000, 0.0000, 20000.00, 0.00, '2022-06-15 00:00:00', NULL),
(1097, 'Buchanans 12 1/4', 1, 0, 3, 65, 1, 3, 1, 82.0000, 0.0000, 0.0000, 11000.00, 0.00, '2022-06-15 00:00:00', NULL),
(1098, 'Buchanans 12 TG', 0, 0, 3, 65, 1, 3, 1, 0.0000, 0.0000, 0.0000, 4000.00, 0.00, '2022-06-15 00:00:00', NULL),
(1099, 'Buchanans 12 TP', 0, 0, 3, 65, 1, 3, 1, 50.0000, 0.0000, 0.0000, 2000.00, 0.00, '2022-06-15 00:00:00', NULL),
(1100, 'Tequila 1800 Botella R', 1, 0, 3, 66, 1, 3, 1, 0.0000, 0.0000, 0.0000, 0.00, 0.00, '2022-06-15 00:00:00', NULL),
(1102, 'Tequila 1800 TRAGO GRANDE', 0, 0, 3, 66, 1, 3, 1, 0.0000, 0.0000, 0.0000, 2000.00, 0.00, '2022-06-15 00:00:00', NULL),
(1107, 'Buchanans 18 Botella', 0, 0, 3, 65, 1, 3, 1, 1.0000, 0.0000, 0.0000, 86000.00, 0.00, '2022-06-27 00:00:00', NULL),
(1108, 'Buchanans 18 Media', 0, 0, 3, 65, 1, 3, 1, 0.0000, 0.0000, 0.0000, 0.00, 0.00, '2022-06-27 00:00:00', NULL),
(1109, 'Buchanans 18 TG', 0, 0, 3, 65, 1, 3, 1, 0.0000, 0.0000, 0.0000, 0.00, 0.00, '2022-06-27 00:00:00', NULL),
(1110, 'Buchanans 18 TP', 0, 0, 3, 65, 1, 3, 1, 20.0000, 0.0000, 0.0000, 5000.00, 0.00, '2022-06-27 00:00:00', NULL),
(1112, 'SODA 350ML', 0, 0, 7, 25, 2, 3, 1, 59.0000, 2.0000, 0.0000, 1300.00, 0.00, '2022-06-27 00:00:00', NULL),
(1113, 'Jugo de Naranja 250ML', 1, 0, 3, 25, 1, 1, 1, 0.0000, 0.0000, 0.0000, 1100.00, 0.00, '2022-06-27 00:00:00', NULL),
(1115, 'Capitán Morgan Litro', 1, 0, 3, 68, 1, 1, 1, 0.0000, 0.0000, 0.0000, 2.00, 0.00, '2022-06-27 00:00:00', NULL),
(1116, 'Capitán Morgan Media', 1, 0, 3, 68, 1, 1, 1, 0.0000, 0.0000, 0.0000, 0.00, 0.00, '2022-06-27 00:00:00', NULL),
(1117, 'Capitán Morgan 1/4', 1, 0, 3, 68, 1, 1, 1, 999.0000, 0.0000, 0.0000, 7000.00, 0.00, '2022-06-27 00:00:00', NULL),
(1118, 'Dewards Litro', 1, 0, 3, 69, 1, 3, 1, 2.0000, 0.0000, 0.0000, 15000.00, 0.00, '2022-06-27 00:00:00', NULL),
(1119, 'Dewards TP', 0, 0, 3, 69, 1, 3, 1, 25.0000, 0.0000, 0.0000, 1400.00, 0.00, '2022-06-27 00:00:00', NULL),
(1120, 'Dewards TG', 0, 0, 3, 69, 1, 3, 1, 15.0000, 0.0000, 0.0000, 1700.00, 0.00, '2022-06-27 00:00:00', NULL),
(1121, 'BOTELLA AGUA 500 ML', 1, 0, 13, 58, 1, 3, 1, 0.0000, 0.0000, 0.0000, 1250.00, 0.00, '2022-07-05 00:00:00', NULL),
(1122, 'BACARDI 1/2', 1, 0, 3, 46, 1, 3, 1, 0.0000, 0.0000, 0.0000, 0.00, 0.00, '2022-07-05 00:00:00', NULL),
(1123, 'BACARDI LITRO', 0, 0, 3, 46, 1, 3, 1, 5.0000, 0.0000, 0.0000, 18000.00, 0.00, '2022-07-05 00:00:00', NULL),
(1124, 'TEQUILA OSC TG', 0, 0, 3, 34, 1, 3, 1, 50.0000, 0.0000, 0.0000, 1200.00, 0.00, '2022-07-05 00:00:00', NULL),
(1125, 'TEQUILA OSC TP', 0, 0, 3, 34, 1, 3, 1, 50.0000, 0.0000, 0.0000, 1200.00, 0.00, '2022-07-05 00:00:00', NULL),
(1128, 'Frangelico TG', 0, 0, 3, 67, 1, 3, 1, 100.0000, 0.0000, 0.0000, 2000.00, 0.00, '2022-07-05 00:00:00', NULL),
(1129, 'Frangelico TP', 0, 0, 3, 67, 1, 3, 1, 50.0000, 0.0000, 0.0000, 1500.00, 0.00, '2022-07-05 00:00:00', NULL),
(1130, 'Frangelico Litro', 1, 0, 3, 67, 1, 3, 1, 0.0000, 0.0000, 0.0000, 0.00, 0.00, '2022-07-05 00:00:00', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cajas_sesiones`
--

CREATE TABLE `cajas_sesiones` (
  `id_cajas_sesiones` int(11) NOT NULL,
  `fecha_apertura` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_cierre` datetime DEFAULT NULL,
  `id_usuario_apertura` int(11) NOT NULL,
  `id_usuario_cierre` int(11) DEFAULT NULL,
  `monto_apertura` decimal(12,2) NOT NULL,
  `monto_final_efectivo` decimal(12,2) DEFAULT NULL,
  `monto_final_tarjetas` decimal(12,2) DEFAULT NULL,
  `monto_final_otros` decimal(12,2) DEFAULT NULL,
  `total_ventas` decimal(15,2) DEFAULT NULL,
  `diferencia` decimal(12,2) DEFAULT NULL,
  `estado` varchar(10) NOT NULL DEFAULT 'abierta'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cajas_sesiones`
--

INSERT INTO `cajas_sesiones` (`id_cajas_sesiones`, `fecha_apertura`, `fecha_cierre`, `id_usuario_apertura`, `id_usuario_cierre`, `monto_apertura`, `monto_final_efectivo`, `monto_final_tarjetas`, `monto_final_otros`, `total_ventas`, `diferencia`, `estado`) VALUES
(1, '2025-08-13 00:00:00', NULL, 1, NULL, 14000.00, NULL, NULL, NULL, NULL, NULL, 'abierta');

--
-- Disparadores `cajas_sesiones`
--
DELIMITER $$
CREATE TRIGGER `trg_cajas_sesiones_check_estado_before_insert` BEFORE INSERT ON `cajas_sesiones` FOR EACH ROW BEGIN
    IF NEW.estado NOT IN ('abierta', 'cerrada') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El valor para el campo "estado" no es válido. Solo se permite "abierta" o "cerrada".';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_cajas_sesiones_check_estado_before_update` BEFORE UPDATE ON `cajas_sesiones` FOR EACH ROW BEGIN
    IF NEW.estado NOT IN ('abierta', 'cerrada') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El valor para el campo "estado" no es válido. Solo se permite "abierta" o "cerrada".';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_clientes` int(11) NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `cedula` varchar(20) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `decoraciones`
--

CREATE TABLE `decoraciones` (
  `id` int(11) NOT NULL,
  `zona_id` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  `ancho` int(11) NOT NULL,
  `alto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `decoraciones`
--

INSERT INTO `decoraciones` (`id`, `zona_id`, `tipo`, `x`, `y`, `ancho`, `alto`) VALUES
(51, 1, 'bar_bottom', 520, 560, 40, 40),
(52, 1, 'garden', 480, 160, 40, 40),
(53, 1, 'plant', 40, 680, 40, 40),
(54, 1, 'fountain', 760, 480, 40, 40),
(55, 1, 'plant', 1080, 680, 40, 40),
(56, 1, 'garden', 840, 600, 40, 40);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturas_detalle`
--

CREATE TABLE `facturas_detalle` (
  `id_facturas_detalle` bigint(20) NOT NULL,
  `id_factura_maestro` bigint(20) NOT NULL,
  `id_articulo` int(11) NOT NULL,
  `descripcion_articulo` varchar(150) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(12,2) NOT NULL,
  `costo_unitario` decimal(12,4) NOT NULL,
  `monto_impuesto_linea` decimal(12,2) NOT NULL,
  `monto_descuento_linea` decimal(12,2) NOT NULL DEFAULT 0.00,
  `es_cortesia` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `facturas_detalle`
--

INSERT INTO `facturas_detalle` (`id_facturas_detalle`, `id_factura_maestro`, `id_articulo`, `descripcion_articulo`, `cantidad`, `precio_unitario`, `costo_unitario`, `monto_impuesto_linea`, `monto_descuento_linea`, `es_cortesia`) VALUES
(1, 1, 878, NULL, 2, 2000.00, 0.0000, 0.00, 0.00, 0),
(2, 1, 881, NULL, 2, 1500.00, 0.0000, 0.00, 0.00, 0),
(3, 2, 878, NULL, 1, 2000.00, 0.0000, 0.00, 0.00, 0),
(4, 2, 879, NULL, 1, 2000.00, 0.0000, 0.00, 0.00, 0),
(5, 2, 878, NULL, 1, 2000.00, 0.0000, 0.00, 0.00, 0),
(6, 3, 1004, NULL, 1, 400.00, 0.0000, 0.00, 0.00, 0),
(7, 3, 1008, NULL, 1, 1300.00, 0.0000, 0.00, 0.00, 0),
(8, 3, 1050, NULL, 2, 2000.00, 0.0000, 0.00, 0.00, 0),
(9, 3, 878, NULL, 2, 2000.00, 0.0000, 0.00, 0.00, 0),
(10, 4, 878, NULL, 1, 2000.00, 0.0000, 0.00, 0.00, 0),
(11, 4, 878, NULL, 1, 2000.00, 0.0000, 0.00, 0.00, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturas_maestro`
--

CREATE TABLE `facturas_maestro` (
  `id_facturas_maestro` bigint(20) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `id_cliente` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_mesa` int(11) DEFAULT NULL,
  `id_tipo_pago` int(11) DEFAULT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `monto_descuento` decimal(15,2) NOT NULL DEFAULT 0.00,
  `monto_impuestos` decimal(15,2) NOT NULL,
  `total_factura` decimal(15,2) NOT NULL,
  `estado` varchar(20) NOT NULL,
  `cantidad_personas` int(11) DEFAULT NULL,
  `nombre_cliente` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `facturas_maestro`
--

INSERT INTO `facturas_maestro` (`id_facturas_maestro`, `fecha`, `id_cliente`, `id_usuario`, `id_mesa`, `id_tipo_pago`, `subtotal`, `monto_descuento`, `monto_impuestos`, `total_factura`, `estado`, `cantidad_personas`, `nombre_cliente`) VALUES
(1, '2025-08-20 17:26:43', NULL, NULL, 28, NULL, 7000.00, 0.00, 0.00, 7000.00, 'credito', 4, 'Juan'),
(2, '2025-08-21 01:10:52', NULL, NULL, 25, NULL, 6000.00, 0.00, 0.00, 6000.00, 'credito', 1, 'Ger'),
(3, '2025-08-21 14:28:34', NULL, NULL, 26, NULL, 9700.00, 0.00, 0.00, 9700.00, 'credito', 3, 'Eduardo'),
(4, '2025-08-25 21:38:02', NULL, NULL, 27, NULL, 4000.00, 0.00, 0.00, 4000.00, 'credito', 1, 'P3'),
(5, '2025-09-17 21:59:47', NULL, NULL, 30, NULL, 0.00, 0.00, 0.00, 0.00, 'credito', 1, ''),
(6, '2025-09-17 22:00:13', NULL, NULL, 31, NULL, 0.00, 0.00, 0.00, 0.00, 'credito', 1, 'Fsd'),
(7, '2025-12-18 20:25:40', NULL, NULL, 39, NULL, 0.00, 0.00, 0.00, 0.00, 'credito', 1, '');

--
-- Disparadores `facturas_maestro`
--
DELIMITER $$
CREATE TRIGGER `trg_facturas_maestro_check_estado_before_insert` BEFORE INSERT ON `facturas_maestro` FOR EACH ROW BEGIN
    IF NEW.estado NOT IN ('pendiente', 'pagada', 'anulada', 'credito') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El valor para el campo "estado" no es válido. Solo se permite "pendiente", "pagada", "anulada" o "credito".';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_facturas_maestro_check_estado_before_update` BEFORE UPDATE ON `facturas_maestro` FOR EACH ROW BEGIN
    IF NEW.estado NOT IN ('pendiente', 'pagada', 'anulada', 'credito') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El valor para el campo "estado" no es válido. Solo se permite "pendiente", "pagada", "anulada" o "credito".';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `familias`
--

CREATE TABLE `familias` (
  `id_familias` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `familias`
--

INSERT INTO `familias` (`id_familias`, `descripcion`) VALUES
(2, 'CERVEZAS'),
(4, 'COMIDAS'),
(3, 'LICORES'),
(13, 'OTROS'),
(7, 'REFRESCOS'),
(12, 'SNACKS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medidas`
--

CREATE TABLE `medidas` (
  `id_medidas` int(11) NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `abreviatura` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medidas`
--

INSERT INTO `medidas` (`id_medidas`, `descripcion`, `abreviatura`) VALUES
(1, 'Litros', 'L'),
(2, 'Kilogramos', 'kg'),
(3, 'Mililitros', 'ml'),
(4, 'Gramos', 'g'),
(5, 'Unidades', 'und');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_inventario`
--

CREATE TABLE `movimientos_inventario` (
  `id_movimientos_inventario` bigint(20) NOT NULL,
  `id_articulo` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `tipo_movimiento` varchar(20) NOT NULL,
  `cantidad` decimal(12,4) NOT NULL,
  `id_factura_maestro` bigint(20) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `notas` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `movimientos_inventario`
--
DELIMITER $$
CREATE TRIGGER `trg_movimientos_inventario_check_tipo_before_insert` BEFORE INSERT ON `movimientos_inventario` FOR EACH ROW BEGIN
    IF NEW.tipo_movimiento NOT IN ('compra', 'venta', 'ajuste_entrada', 'ajuste_salida', 'traslado') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El valor para "tipo_movimiento" no es válido.';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_movimientos_inventario_check_tipo_before_update` BEFORE UPDATE ON `movimientos_inventario` FOR EACH ROW BEGIN
    IF NEW.tipo_movimiento NOT IN ('compra', 'venta', 'ajuste_entrada', 'ajuste_salida', 'traslado') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El valor para "tipo_movimiento" no es válido.';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `parametros_sistema`
--

CREATE TABLE `parametros_sistema` (
  `id_parametros` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `valor` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `parametros_sistema`
--

INSERT INTO `parametros_sistema` (`id_parametros`, `descripcion`, `valor`) VALUES
(1, 'Consecutivo Para Ajustes de Articulos', '332'),
(2, 'Consecutivo para Facturación', '19369'),
(3, 'Consecutivo para Comandas', '1900'),
(4, 'Consecutivo para Factura Contado', '1781'),
(5, 'Encabezado2 ', 'Telf. 8824-3336'),
(6, 'descuento', '15'),
(7, 'Imprime Comandas', '1'),
(8, 'Tipo Impresora', ''),
(9, 'cédula', 'Roy Mayorga Gutierrez'),
(10, 'régimen', '1-0773-0437'),
(11, 'otro', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paredes`
--

CREATE TABLE `paredes` (
  `id` int(11) NOT NULL,
  `zona_id` int(11) NOT NULL,
  `x1` int(11) NOT NULL,
  `y1` int(11) NOT NULL,
  `x2` int(11) NOT NULL,
  `y2` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `paredes`
--

INSERT INTO `paredes` (`id`, `zona_id`, `x1`, `y1`, `x2`, `y2`) VALUES
(36, 1, 200, 0, 200, 520),
(37, 1, 400, 0, 400, 520),
(38, 1, 1040, 0, 1040, 520),
(39, 1, 800, 120, 960, 120);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedores` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `contacto` varchar(100) DEFAULT NULL,
  `cedula_juridica` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `id_provincia` tinyint(4) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_inicio_relacion` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id_proveedores`, `nombre`, `contacto`, `cedula_juridica`, `direccion`, `id_provincia`, `email`, `telefono`, `fecha_inicio_relacion`) VALUES
(1, 'Proveedor Principal', '', '', '', NULL, '', '', '2011-06-28'),
(2, 'CERVECERIA DE COSTA RICA S.A', 'NO TIENE', '1', 'NO TIENE', NULL, 'NO TIENE', '88799900', '2011-10-03'),
(4, 'Licores Checho', 'Sergio', '0', '0', NULL, '0', '0', '2023-02-02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `provincias`
--

CREATE TABLE `provincias` (
  `id_provincias` tinyint(4) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `provincias`
--

INSERT INTO `provincias` (`id_provincias`, `nombre`) VALUES
(1, 'San José'),
(2, 'Heredia');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recetas`
--

CREATE TABLE `recetas` (
  `id_articulo_padre` int(11) NOT NULL,
  `id_articulo_ingrediente` int(11) NOT NULL,
  `cantidad` decimal(10,4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salones_mesas`
--

CREATE TABLE `salones_mesas` (
  `id_salones_mesas` int(11) NOT NULL,
  `identificador` varchar(20) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'disponible',
  `id_ubicacion_mesa` int(11) DEFAULT NULL,
  `row` int(11) DEFAULT NULL,
  `col` int(11) DEFAULT NULL,
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  `shape` varchar(50) DEFAULT 'rectangle'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `salones_mesas`
--

INSERT INTO `salones_mesas` (`id_salones_mesas`, `identificador`, `descripcion`, `estado`, `id_ubicacion_mesa`, `row`, `col`, `x`, `y`, `shape`) VALUES
(25, 'P1', 'Mesa M1', 'ocupada', 1, 2, 2, 0, 0, 'rectangle'),
(26, 'P2', 'Mesa M2', 'ocupada', 1, 3, 2, 0, 120, 'rectangle'),
(27, 'P3', 'Mesa M4', 'ocupada', 1, 2, 4, 0, 200, 'rectangle'),
(28, 'P5', 'Mesa M5', 'ocupada', 1, 3, 4, 240, 560, 'rectangle'),
(30, 'P6', 'Mesa M6', 'ocupada', 1, 5, 2, 240, 480, 'rectangle'),
(31, 'P4', 'Mesa M7', 'ocupada', 1, 5, 4, 0, 280, 'rectangle'),
(32, 'B1', 'Mesa B1', 'disponible', 2, 1, 1, 440, 40, 'rectangle'),
(33, 'B2', 'Mesa B2', 'disponible', 2, 2, 1, 440, 560, 'rectangle'),
(34, 'B3', 'Mesa B3', 'disponible', 2, 3, 1, 440, 240, 'rectangle'),
(35, 'B4', 'Mesa B4', 'disponible', 2, 4, 1, 120, 280, 'rectangle'),
(36, 'B5', 'Mesa B5', 'disponible', 2, 5, 1, 160, 80, 'rectangle'),
(37, 'P7', 'Mesa M8', 'disponible', 1, 6, 2, 240, 400, 'rectangle'),
(38, 'fsd', 'Mesa fsd', 'disponible', 3, 1, 10, 0, 0, 'rectangle'),
(39, 'M24', 'Mesa M9', 'ocupada', 1, NULL, NULL, 1160, 480, 'square'),
(40, 'M23', NULL, 'disponible', 1, NULL, NULL, 280, 40, 'square'),
(41, 'M22', NULL, 'disponible', 1, NULL, NULL, 280, 120, 'square'),
(42, 'M21', NULL, 'disponible', 1, NULL, NULL, 1160, 0, 'square'),
(43, 'P8', NULL, 'disponible', 1, NULL, NULL, 240, 320, 'rectangle'),
(44, 'P9', NULL, 'disponible', 1, NULL, NULL, 240, 240, 'rectangle'),
(45, 'P10', NULL, 'disponible', 1, NULL, NULL, 0, 400, 'rectangle'),
(46, 'M25', NULL, 'disponible', 1, NULL, NULL, 1160, 360, 'square'),
(47, 'M26', NULL, 'disponible', 1, NULL, NULL, 1160, 240, 'square'),
(48, 'M27', NULL, 'disponible', 1, NULL, NULL, 1160, 120, 'square'),
(49, 'M28', NULL, 'disponible', 1, NULL, NULL, 840, 240, 'square'),
(50, 'M29', NULL, 'disponible', 1, NULL, NULL, 760, 240, 'square'),
(51, 'M30', NULL, 'disponible', 1, NULL, NULL, 680, 240, 'square'),
(52, 'M33', NULL, 'disponible', 1, NULL, NULL, 680, 160, 'square'),
(53, 'M31', NULL, 'disponible', 1, NULL, NULL, 760, 160, 'square'),
(54, 'M32', NULL, 'disponible', 1, NULL, NULL, 840, 160, 'square');

--
-- Disparadores `salones_mesas`
--
DELIMITER $$
CREATE TRIGGER `trg_salones_mesas_check_estado_before_insert` BEFORE INSERT ON `salones_mesas` FOR EACH ROW BEGIN
    IF NEW.estado NOT IN ('disponible', 'ocupada', 'reservada') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El valor para "estado" no es válido. Solo se permite "disponible", "ocupada" o "reservada".';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_salones_mesas_check_estado_before_update` BEFORE UPDATE ON `salones_mesas` FOR EACH ROW BEGIN
    IF NEW.estado NOT IN ('disponible', 'ocupada', 'reservada') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El valor para "estado" no es válido. Solo se permite "disponible", "ocupada" o "reservada".';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subfamilias`
--

CREATE TABLE `subfamilias` (
  `id_subfamilias` int(11) NOT NULL,
  `id_familia` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `subfamilias`
--

INSERT INTO `subfamilias` (`id_subfamilias`, `id_familia`, `descripcion`) VALUES
(2, 4, 'Principales'),
(7, 4, 'Mariscos'),
(8, 4, 'Otros'),
(9, 4, 'Extras'),
(12, 2, 'Imperial'),
(13, 2, 'Pilsen'),
(22, 3, 'Smirnoff'),
(23, 2, 'Otras Cervezas'),
(24, 7, 'Gaseosas'),
(25, 7, 'Ligas'),
(26, 2, 'Bavaria'),
(28, 2, 'Bamboo'),
(29, 3, 'Cacique'),
(30, 3, 'Centenario'),
(31, 3, 'Ginebra'),
(32, 3, 'Anis'),
(33, 3, 'J&B'),
(34, 3, 'Tequila OSC'),
(35, 3, 'Vino'),
(36, 3, 'JAGUER'),
(37, 3, 'BLACK AND WHITE'),
(38, 3, 'CHIVAS'),
(39, 3, 'OLD PAR'),
(40, 3, 'JHONY NEGRO'),
(41, 3, 'JHONY ROJO'),
(42, 3, 'VALDESPINO'),
(43, 3, 'PASPORT'),
(44, 3, 'Tequila Claro'),
(45, 3, 'Vino Tinto'),
(46, 3, 'Bacardi'),
(47, 12, 'Galletas'),
(48, 12, 'Papas'),
(49, 12, 'Maní'),
(50, 12, 'Semillas'),
(51, 12, 'Confites'),
(52, 12, 'Chicles'),
(53, 12, 'Chocolates'),
(54, 12, 'Helados'),
(55, 12, 'Yucas'),
(56, 12, 'Plátanos'),
(57, 2, 'Smirnoff-Botella'),
(58, 13, 'OtrosProductos'),
(59, 3, 'Aguardiente'),
(60, 3, 'Fireball'),
(61, 3, 'Campari'),
(62, 3, 'Hypnotic'),
(63, 3, 'Dn Julio'),
(64, 3, 'Flor de Caña'),
(65, 3, 'Buchanans'),
(66, 3, 'Tequila 1800'),
(67, 3, 'Frangelico'),
(68, 3, 'Capitán Morgan'),
(69, 3, 'Dewards'),
(70, 3, 'Gambucha'),
(71, 3, 'Jack Daniels'),
(72, 3, 'Bombai'),
(73, 3, 'VODKA'),
(74, 3, 'Jameson'),
(75, 3, 'Tequila Rose'),
(76, 3, 'Baileys'),
(77, 3, 'Tequila Jarana'),
(78, 3, 'Tequila Jose Cuervo'),
(79, 3, 'Otros Shots');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_ajuste_inventario`
--

CREATE TABLE `tipos_ajuste_inventario` (
  `id_tipos_ajuste` int(11) NOT NULL,
  `tipo_cuenta` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipos_ajuste_inventario`
--

INSERT INTO `tipos_ajuste_inventario` (`id_tipos_ajuste`, `tipo_cuenta`, `nombre`) VALUES
(1, 1, 'Ajuste Entrada'),
(2, 1, 'Ajuste por Regalía'),
(3, 1, 'Otro'),
(4, 1, 'Recibido Otra Localidad'),
(5, 2, 'Ajuste Salida'),
(6, 2, 'Ajuste Garantía'),
(7, 2, 'Ajuste Regalía'),
(8, 2, 'Uso Propio'),
(9, 2, 'Otro'),
(10, 2, 'Enviado a Otra localidad');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_cuenta`
--

CREATE TABLE `tipos_cuenta` (
  `id_tipo_cuenta` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `tipos_cuenta`
--

INSERT INTO `tipos_cuenta` (`id_tipo_cuenta`, `nombre`) VALUES
(1, 'Entrada'),
(2, 'Salida');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_pago`
--

CREATE TABLE `tipos_pago` (
  `id_tipos_pago` int(11) NOT NULL,
  `descripcion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipos_pago`
--

INSERT INTO `tipos_pago` (`id_tipos_pago`, `descripcion`) VALUES
(1, 'Efectivo'),
(2, 'Tarjeta'),
(3, 'Cuenta x Cobrar'),
(5, 'Efectivo/Tarjeta'),
(8, 'SINPE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ubicaciones_inventario`
--

CREATE TABLE `ubicaciones_inventario` (
  `id_ubicaciones_inventario` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ubicaciones_inventario`
--

INSERT INTO `ubicaciones_inventario` (`id_ubicaciones_inventario`, `descripcion`) VALUES
(1, 'BODEGA1'),
(2, 'BODEGA2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ubicaciones_mesas`
--

CREATE TABLE `ubicaciones_mesas` (
  `id_ubicaciones_mesas` int(11) NOT NULL,
  `nombre_ubicacion` varchar(100) NOT NULL,
  `estado` varchar(10) NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ubicaciones_mesas`
--

INSERT INTO `ubicaciones_mesas` (`id_ubicaciones_mesas`, `nombre_ubicacion`, `estado`) VALUES
(1, 'Salón Principal', 'Activo'),
(2, 'Barra', 'Activo'),
(3, '2dopiso', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuarios` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `nombre_completo` varchar(120) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `perfil` varchar(20) NOT NULL,
  `esta_activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuarios`, `usuario`, `nombre_completo`, `password_hash`, `perfil`, `esta_activo`) VALUES
(1, 'admin', 'Administrador Principal', 'admin2023', 'administrador', 1),
(2, 'ASANCHEZ', 'A. Sanchez', '123456', 'administrador', 1),
(3, 'cajero', 'Cajero de Turno', 'cajero', 'cajero', 0),
(4, 'evega', 'Eva Luna', 'evaluna', 'cajero', 1),
(5, 'fsanchez', 'F. Sanchez', '*F4t1m4h1j417012016*', 'administrador', 1),
(6, 'rmayorga', 'Roy Mayorga', 'ToXico2023', 'administrador', 1),
(7, 'TI', 'Soporte TI', 'ti', 'administrador', 0),
(23, 'Pika Bar', 'Pika Bar', 'hash_ejemplo_seguro', 'mesero', 1);

--
-- Disparadores `usuarios`
--
DELIMITER $$
CREATE TRIGGER `trg_usuarios_check_perfil_before_insert` BEFORE INSERT ON `usuarios` FOR EACH ROW BEGIN
    IF NEW.perfil NOT IN ('administrador', 'cajero', 'mesero', 'cocina') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El valor para "perfil" no es válido. Solo se permite "administrador", "cajero", "mesero" o "cocina".';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_usuarios_check_perfil_before_update` BEFORE UPDATE ON `usuarios` FOR EACH ROW BEGIN
    IF NEW.perfil NOT IN ('administrador', 'cajero', 'mesero', 'cocina') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El valor para "perfil" no es válido. Solo se permite "administrador", "cajero", "mesero" o "cocina".';
    END IF;
END
$$
DELIMITER ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ajustes_inventario`
--
ALTER TABLE `ajustes_inventario`
  ADD PRIMARY KEY (`id_ajuste_inventario`),
  ADD KEY `id_articulo` (`id_articulo`),
  ADD KEY `id_tipo_ajuste` (`id_tipo_ajuste`);

--
-- Indices de la tabla `articulos`
--
ALTER TABLE `articulos`
  ADD PRIMARY KEY (`id_articulos`),
  ADD KEY `FK_articulos_familias` (`id_familia`),
  ADD KEY `FK_articulos_medidas` (`id_medida`),
  ADD KEY `FK_articulos_proveedores` (`id_proveedor`),
  ADD KEY `FK_articulos_subfamilias` (`id_subfamilia`),
  ADD KEY `FK_articulos_ubicaciones` (`id_ubicacion_inventario`);

--
-- Indices de la tabla `cajas_sesiones`
--
ALTER TABLE `cajas_sesiones`
  ADD PRIMARY KEY (`id_cajas_sesiones`),
  ADD KEY `FK_cajas_sesiones_usuario_apertura` (`id_usuario_apertura`),
  ADD KEY `FK_cajas_sesiones_usuario_cierre` (`id_usuario_cierre`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_clientes`),
  ADD UNIQUE KEY `UQ_clientes_cedula` (`cedula`);

--
-- Indices de la tabla `decoraciones`
--
ALTER TABLE `decoraciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `facturas_detalle`
--
ALTER TABLE `facturas_detalle`
  ADD PRIMARY KEY (`id_facturas_detalle`),
  ADD KEY `FK_facturas_detalle_articulos` (`id_articulo`),
  ADD KEY `FK_facturas_detalle_maestro` (`id_factura_maestro`);

--
-- Indices de la tabla `facturas_maestro`
--
ALTER TABLE `facturas_maestro`
  ADD PRIMARY KEY (`id_facturas_maestro`),
  ADD KEY `FK_facturas_maestro_clientes` (`id_cliente`),
  ADD KEY `FK_facturas_maestro_mesas` (`id_mesa`),
  ADD KEY `FK_facturas_maestro_tipos_pago` (`id_tipo_pago`),
  ADD KEY `FK_facturas_maestro_usuarios` (`id_usuario`);

--
-- Indices de la tabla `familias`
--
ALTER TABLE `familias`
  ADD PRIMARY KEY (`id_familias`),
  ADD UNIQUE KEY `UQ_familias_descripcion` (`descripcion`);

--
-- Indices de la tabla `medidas`
--
ALTER TABLE `medidas`
  ADD PRIMARY KEY (`id_medidas`);

--
-- Indices de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD PRIMARY KEY (`id_movimientos_inventario`),
  ADD KEY `FK_movimientos_inventario_articulos` (`id_articulo`),
  ADD KEY `FK_movimientos_inventario_facturas` (`id_factura_maestro`),
  ADD KEY `FK_movimientos_inventario_usuarios` (`id_usuario`);

--
-- Indices de la tabla `parametros_sistema`
--
ALTER TABLE `parametros_sistema`
  ADD PRIMARY KEY (`id_parametros`);

--
-- Indices de la tabla `paredes`
--
ALTER TABLE `paredes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedores`),
  ADD UNIQUE KEY `UQ_proveedores_cedula` (`cedula_juridica`),
  ADD UNIQUE KEY `UQ_proveedores_email` (`email`),
  ADD KEY `FK_proveedores_provincias` (`id_provincia`);

--
-- Indices de la tabla `provincias`
--
ALTER TABLE `provincias`
  ADD PRIMARY KEY (`id_provincias`);

--
-- Indices de la tabla `recetas`
--
ALTER TABLE `recetas`
  ADD PRIMARY KEY (`id_articulo_padre`,`id_articulo_ingrediente`),
  ADD KEY `FK_recetas_articulo_ingrediente` (`id_articulo_ingrediente`);

--
-- Indices de la tabla `salones_mesas`
--
ALTER TABLE `salones_mesas`
  ADD PRIMARY KEY (`id_salones_mesas`),
  ADD UNIQUE KEY `UQ_salones_mesas_identificador` (`identificador`),
  ADD KEY `FK_salones_mesas_ubicaciones_mesas` (`id_ubicacion_mesa`);

--
-- Indices de la tabla `subfamilias`
--
ALTER TABLE `subfamilias`
  ADD PRIMARY KEY (`id_subfamilias`),
  ADD KEY `FK_subfamilias_familias` (`id_familia`);

--
-- Indices de la tabla `tipos_ajuste_inventario`
--
ALTER TABLE `tipos_ajuste_inventario`
  ADD PRIMARY KEY (`id_tipos_ajuste`),
  ADD KEY `fk_tipo_cuenta` (`tipo_cuenta`);

--
-- Indices de la tabla `tipos_cuenta`
--
ALTER TABLE `tipos_cuenta`
  ADD PRIMARY KEY (`id_tipo_cuenta`);

--
-- Indices de la tabla `tipos_pago`
--
ALTER TABLE `tipos_pago`
  ADD PRIMARY KEY (`id_tipos_pago`);

--
-- Indices de la tabla `ubicaciones_inventario`
--
ALTER TABLE `ubicaciones_inventario`
  ADD PRIMARY KEY (`id_ubicaciones_inventario`);

--
-- Indices de la tabla `ubicaciones_mesas`
--
ALTER TABLE `ubicaciones_mesas`
  ADD PRIMARY KEY (`id_ubicaciones_mesas`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuarios`),
  ADD UNIQUE KEY `UQ_usuarios_usuario` (`usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ajustes_inventario`
--
ALTER TABLE `ajustes_inventario`
  MODIFY `id_ajuste_inventario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `articulos`
--
ALTER TABLE `articulos`
  MODIFY `id_articulos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1133;

--
-- AUTO_INCREMENT de la tabla `cajas_sesiones`
--
ALTER TABLE `cajas_sesiones`
  MODIFY `id_cajas_sesiones` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_clientes` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `decoraciones`
--
ALTER TABLE `decoraciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT de la tabla `facturas_detalle`
--
ALTER TABLE `facturas_detalle`
  MODIFY `id_facturas_detalle` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `facturas_maestro`
--
ALTER TABLE `facturas_maestro`
  MODIFY `id_facturas_maestro` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `familias`
--
ALTER TABLE `familias`
  MODIFY `id_familias` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `medidas`
--
ALTER TABLE `medidas`
  MODIFY `id_medidas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  MODIFY `id_movimientos_inventario` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `parametros_sistema`
--
ALTER TABLE `parametros_sistema`
  MODIFY `id_parametros` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `paredes`
--
ALTER TABLE `paredes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedores` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `provincias`
--
ALTER TABLE `provincias`
  MODIFY `id_provincias` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `salones_mesas`
--
ALTER TABLE `salones_mesas`
  MODIFY `id_salones_mesas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT de la tabla `subfamilias`
--
ALTER TABLE `subfamilias`
  MODIFY `id_subfamilias` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT de la tabla `tipos_ajuste_inventario`
--
ALTER TABLE `tipos_ajuste_inventario`
  MODIFY `id_tipos_ajuste` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `tipos_cuenta`
--
ALTER TABLE `tipos_cuenta`
  MODIFY `id_tipo_cuenta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tipos_pago`
--
ALTER TABLE `tipos_pago`
  MODIFY `id_tipos_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `ubicaciones_inventario`
--
ALTER TABLE `ubicaciones_inventario`
  MODIFY `id_ubicaciones_inventario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `ubicaciones_mesas`
--
ALTER TABLE `ubicaciones_mesas`
  MODIFY `id_ubicaciones_mesas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuarios` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ajustes_inventario`
--
ALTER TABLE `ajustes_inventario`
  ADD CONSTRAINT `ajustes_inventario_ibfk_1` FOREIGN KEY (`id_articulo`) REFERENCES `articulos` (`id_articulos`),
  ADD CONSTRAINT `ajustes_inventario_ibfk_2` FOREIGN KEY (`id_tipo_ajuste`) REFERENCES `tipos_ajuste_inventario` (`id_tipos_ajuste`);

--
-- Filtros para la tabla `articulos`
--
ALTER TABLE `articulos`
  ADD CONSTRAINT `FK_articulos_familias` FOREIGN KEY (`id_familia`) REFERENCES `familias` (`id_familias`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_articulos_medidas` FOREIGN KEY (`id_medida`) REFERENCES `medidas` (`id_medidas`) ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_articulos_proveedores` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedores`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_articulos_subfamilias` FOREIGN KEY (`id_subfamilia`) REFERENCES `subfamilias` (`id_subfamilias`),
  ADD CONSTRAINT `FK_articulos_ubicaciones` FOREIGN KEY (`id_ubicacion_inventario`) REFERENCES `ubicaciones_inventario` (`id_ubicaciones_inventario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `cajas_sesiones`
--
ALTER TABLE `cajas_sesiones`
  ADD CONSTRAINT `FK_cajas_sesiones_usuario_apertura` FOREIGN KEY (`id_usuario_apertura`) REFERENCES `usuarios` (`id_usuarios`),
  ADD CONSTRAINT `FK_cajas_sesiones_usuario_cierre` FOREIGN KEY (`id_usuario_cierre`) REFERENCES `usuarios` (`id_usuarios`);

--
-- Filtros para la tabla `facturas_detalle`
--
ALTER TABLE `facturas_detalle`
  ADD CONSTRAINT `FK_facturas_detalle_articulos` FOREIGN KEY (`id_articulo`) REFERENCES `articulos` (`id_articulos`) ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_facturas_detalle_maestro` FOREIGN KEY (`id_factura_maestro`) REFERENCES `facturas_maestro` (`id_facturas_maestro`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `facturas_maestro`
--
ALTER TABLE `facturas_maestro`
  ADD CONSTRAINT `FK_facturas_maestro_clientes` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_clientes`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_facturas_maestro_mesas` FOREIGN KEY (`id_mesa`) REFERENCES `salones_mesas` (`id_salones_mesas`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_facturas_maestro_tipos_pago` FOREIGN KEY (`id_tipo_pago`) REFERENCES `tipos_pago` (`id_tipos_pago`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_facturas_maestro_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD CONSTRAINT `FK_movimientos_inventario_articulos` FOREIGN KEY (`id_articulo`) REFERENCES `articulos` (`id_articulos`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_movimientos_inventario_facturas` FOREIGN KEY (`id_factura_maestro`) REFERENCES `facturas_maestro` (`id_facturas_maestro`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_movimientos_inventario_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD CONSTRAINT `FK_proveedores_provincias` FOREIGN KEY (`id_provincia`) REFERENCES `provincias` (`id_provincias`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `recetas`
--
ALTER TABLE `recetas`
  ADD CONSTRAINT `FK_recetas_articulo_ingrediente` FOREIGN KEY (`id_articulo_ingrediente`) REFERENCES `articulos` (`id_articulos`),
  ADD CONSTRAINT `FK_recetas_articulo_padre` FOREIGN KEY (`id_articulo_padre`) REFERENCES `articulos` (`id_articulos`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `salones_mesas`
--
ALTER TABLE `salones_mesas`
  ADD CONSTRAINT `FK_salones_mesas_ubicaciones_mesas` FOREIGN KEY (`id_ubicacion_mesa`) REFERENCES `ubicaciones_mesas` (`id_ubicaciones_mesas`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `subfamilias`
--
ALTER TABLE `subfamilias`
  ADD CONSTRAINT `FK_subfamilias_familias` FOREIGN KEY (`id_familia`) REFERENCES `familias` (`id_familias`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `tipos_ajuste_inventario`
--
ALTER TABLE `tipos_ajuste_inventario`
  ADD CONSTRAINT `fk_tipo_cuenta` FOREIGN KEY (`tipo_cuenta`) REFERENCES `tipos_cuenta` (`id_tipo_cuenta`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
