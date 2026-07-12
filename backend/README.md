# ZoltCode — Catálogo y Pedidos

API REST para gestión de catálogo de productos y pedidos, con autenticación segura y control de acceso por roles. Desarrollado como proyecto de portafolio con enfoque en buenas prácticas de seguridad.

## Tecnologías utilizadas

- **Node.js** + **Express 5** — servidor y enrutamiento
- **PostgreSQL** (alojado en **Neon**) — base de datos
- **JWT (jsonwebtoken)** — autenticación por token
- **bcrypt** — hashing de contraseñas
- **dotenv** — manejo de variables de entorno
- **pg** — cliente de PostgreSQL para Node

## Características

- **Autenticación completa:** registro, login y perfil protegido con JWT (expiración de 2h)
- **RBAC (control de acceso por roles):** middleware que distingue entre usuarios `cliente` y `admin`
- **Catálogo de productos:** operaciones CRUD, con soft delete (los productos nunca se borran físicamente, solo se desactivan)
- **Sistema de pedidos:**
  - Creación de pedidos con transacciones SQL (`BEGIN` / `COMMIT` / `ROLLBACK`)
  - Validación de stock antes de confirmar
  - Descuento automático de stock
  - Historial de pedidos por usuario
  - Detalle de un pedido específico con sus productos
- **Seguridad:**
  - Contraseñas hasheadas con bcrypt
  - Rutas protegidas por token y por rol
  - Validación de que un pedido solo pueda ser visto por su dueño o un admin
  - Variables sensibles (`.env`) excluidas del control de versiones
  - Mensajes de error que no exponen detalles internos del sistema al cliente

## Estructura del proyecto

backend/
├── src/
│   ├── config/
│   │   └── db.js                  # Conexión a PostgreSQL (Neon)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productosController.js
│   │   └── pedidosController.js
│   ├── middleware/
│   │   └── authMiddleware.js      # verificarToken, soloAdmin
│   ├── migrations/
│   │   ├── 001_create_usuarios.sql
│   │   ├── 002_create_productos.sql
│   │   ├── 003_create_pedidos.sql
│   │   └── migrate.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productosRoutes.js
│   │   └── pedidosRoutes.js
│   └── server.js
├── .env
└── package.json

## Instalación y configuración

1. Clonar el repositorio:

```bash
git clone https://github.com/rey182006-adso/zoltcode-catalogo-pedidos.git
cd zoltcode-catalogo-pedidos/backend
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear un archivo `.env` en la carpeta `backend` con las siguientes variables:

DATABASE_URL=postgresql://usuario:password@host/basededatos
JWT_SECRET=tu_secreto_para_firmar_tokens
PORT=3000

4. Ejecutar las migraciones (crea las tablas en la base de datos):

```bash
node src/migrations/migrate.js
```

5. Levantar el servidor:

```bash
node src/server.js
```

El servidor queda disponible en `http://localhost:3000`

## Endpoints disponibles

| Método | Ruta                  | Protección          | Descripción                          |
|--------|-----------------------|----------------------|---------------------------------------|
| POST   | `/api/auth/registro`  | Pública              | Registrar nuevo usuario (rol cliente) |
| POST   | `/api/auth/login`     | Pública              | Iniciar sesión, devuelve JWT          |
| GET    | `/api/auth/perfil`    | Autenticado          | Ver perfil del usuario logueado       |
| GET    | `/api/productos`      | Pública              | Listar productos activos              |
| GET    | `/api/productos/:id`  | Pública              | Ver un producto específico            |
| POST   | `/api/productos`      | Admin                | Crear producto                        |
| PUT    | `/api/productos/:id`  | Admin                | Actualizar producto                   |
| DELETE | `/api/productos/:id`  | Admin                | Desactivar producto (soft delete)     |
| POST   | `/api/pedidos`        | Autenticado          | Crear un pedido                       |
| GET    | `/api/pedidos`        | Autenticado          | Ver historial de pedidos propios      |
| GET    | `/api/pedidos/:id`    | Autenticado (dueño o admin) | Ver detalle de un pedido       |

## Notas de seguridad

- Las contraseñas nunca se almacenan en texto plano — se usa bcrypt con 10 rounds de salting.
- Los tokens JWT expiran a las 2 horas y viajan en el header `Authorization: Bearer <token>`.
- Todas las consultas SQL usan parámetros (`$1`, `$2`, ...) para prevenir inyección SQL.
- Las operaciones de creación de pedidos usan transacciones reales: si algo falla a mitad de camino, se revierte todo (no quedan pedidos a medio crear ni stock descontado incorrectamente).
- El detalle de un pedido (`GET /api/pedidos/:id`) valida que quien lo solicita sea el dueño del pedido o un administrador, evitando que un usuario vea pedidos ajenos.
- Los mensajes de error devueltos al cliente son genéricos para fallos internos (no exponen detalles de la base de datos), mientras que los logs del servidor sí registran el detalle completo para debugging.

## Autor

**Sebastián Rey** — ZoltCode