# Sistema de Restaurante POS - Integración con Base de Datos

## Descripción
Sistema de punto de venta para restaurantes integrado con base de datos SQL Server, desarrollado con PHP, HTML, CSS y JavaScript.

## Estructura del Proyecto

```
resta2/
├── config/
│   └── conexion.php          # Configuración de conexión a BD
├── clases/
│   ├── Articulos.php         # Manejo de artículos/productos
│   ├── Familias.php          # Manejo de familias de productos
│   └── Mesas.php             # Manejo de mesas del restaurante
├── api/
│   ├── articulos.php         # API REST para artículos
│   └── mesas.php             # API REST para mesas
├── js/
│   ├── api.js                # Cliente JavaScript para APIs
│   └── script.js             # Lógica principal del frontend
├── css/
│   └── style.css             # Estilos de la aplicación
├── index.html                # Página principal
├── test_conexion.php         # Archivo de prueba de conexión
└── README.md                 # Este archivo
```

## Configuración de la Base de Datos

### 1. Requisitos Previos
- XAMPP con PHP 7.4 o superior
- SQL Server (LocalDB, Express o completo)
- Driver PDO_SQLSRV para PHP

### 2. Configurar Credenciales
Edita el archivo `config/conexion.php` y modifica las siguientes variables:

```php
private $servidor = "localhost";        // Tu servidor SQL Server
private $baseDatos = "restaurante_pos"; // Nombre de la base de datos
private $usuario = "sa";                // Tu usuario de SQL Server
private $password = "";                 // Tu contraseña
```

### 3. Crear la Base de Datos
Ejecuta el script SQL proporcionado para crear la base de datos `restaurante_pos` con todas las tablas necesarias.

### 4. Instalar Driver PDO_SQLSRV
Si no tienes el driver instalado:
1. Descarga los drivers de Microsoft para PHP
2. Copia los archivos .dll a la carpeta `ext/` de PHP
3. Agrega estas líneas a tu `php.ini`:
   ```
   extension=pdo_sqlsrv
   extension=sqlsrv
   ```

## Probar la Conexión

1. Abre tu navegador y ve a: `http://localhost/resta2/test_conexion.php`
2. Si la conexión es exitosa, verás un mensaje verde
3. Si hay errores, sigue las instrucciones mostradas

## Funcionalidades Implementadas

### APIs Disponibles

#### Artículos (`api/articulos.php`)
- `GET ?accion=familias` - Obtener todas las familias
- `GET ?accion=por_familia&id_familia=X` - Artículos por familia
- `GET ?accion=buscar&nombre=X` - Buscar artículos por nombre
- `GET ?accion=por_id&id=X` - Obtener artículo específico

#### Mesas (`api/mesas.php`)
- `GET` - Obtener todas las mesas
- `GET ?accion=disponibles` - Obtener mesas disponibles
- `PUT` - Cambiar estado de mesa (JSON: `{id: X, estado: "disponible|ocupada"}`)

### Clases PHP

#### Articulos.php
- `obtenerPorFamilia($idFamilia)` - Obtener artículos por familia
- `obtenerPorId($id)` - Obtener artículo específico
- `buscarPorNombre($nombre)` - Buscar artículos
- `actualizarExistencia($id, $cantidad)` - Actualizar stock
- `verificarStock($id, $cantidad)` - Verificar disponibilidad

#### Familias.php
- `obtenerTodas()` - Obtener todas las familias
- `obtenerPorId($id)` - Obtener familia específica
- `obtenerConConteoArticulos()` - Familias con conteo de productos

#### Mesas.php
- `obtenerTodas()` - Obtener todas las mesas
- `obtenerPorId($id)` - Obtener mesa específica
- `cambiarEstado($id, $estado)` - Cambiar estado de mesa
- `obtenerDisponibles()` - Obtener mesas disponibles

## Frontend JavaScript

### api.js
Cliente JavaScript que maneja las llamadas a las APIs PHP:
- `obtenerFamilias()` - Cargar familias
- `obtenerArticulosPorFamilia(id)` - Cargar productos
- `buscarArticulos(nombre)` - Buscar productos
- `obtenerMesas()` - Cargar mesas
- `cambiarEstadoMesa(id, estado)` - Actualizar mesa

### script.js
Lógica principal que:
- Inicializa la aplicación cargando datos de la BD
- Maneja la navegación entre vistas
- Actualiza el DOM con datos reales
- Gestiona eventos de usuario

## Uso de la Aplicación

1. **Inicio**: La aplicación carga automáticamente los datos desde la base de datos
2. **Navegación**: Usa el menú lateral para cambiar entre secciones
3. **Productos**: Los productos se cargan dinámicamente por familia
4. **Mesas**: Las mesas muestran su estado real y se pueden actualizar
5. **Filtros**: Usa los campos de filtro para buscar productos

## Solución de Problemas

### Error de Conexión
- Verifica que SQL Server esté ejecutándose
- Confirma las credenciales en `config/conexion.php`
- Asegúrate de que la base de datos existe
- Verifica que el driver PDO_SQLSRV esté instalado

### Error 500 en APIs
- Revisa los logs de PHP para detalles del error
- Verifica que las clases PHP se puedan cargar correctamente
- Confirma que las tablas de la base de datos existen

### Datos No Cargan
- Abre la consola del navegador para ver errores JavaScript
- Verifica que las APIs respondan correctamente
- Confirma que hay datos en las tablas de la base de datos

## Próximos Pasos

Para expandir el sistema, puedes:
1. Implementar el módulo de facturación
2. Agregar gestión de usuarios y autenticación
3. Crear reportes y estadísticas
4. Implementar el manejo de inventario
5. Agregar funcionalidad de caja

## Soporte

Si encuentras problemas, revisa:
1. Los logs de PHP en XAMPP
2. La consola del navegador para errores JavaScript
3. El archivo `test_conexion.php` para verificar la conectividad
