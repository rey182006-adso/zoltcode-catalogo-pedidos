# ZoltCode — KingLux Casa Rey

E-commerce completo (backend + frontend) para KingLux Casa Rey, joyería en oro laminado 18K. Proyecto de portafolio desarrollado bajo la marca **ZoltCode**, con enfoque en seguridad desde el diseño.

> Desarrollado por Sebastián Rey, estudiante de Análisis y Desarrollo de Software (ADSO) en el SENA, con certificaciones en desarrollo seguro y ciberseguridad (Platzi).

## Qué es este proyecto

Una tienda en línea funcional de punta a punta: catálogo de productos, autenticación de usuarios, carrito de compras y sistema de pedidos con control de inventario — todo construido desde cero, sin plantillas ni frameworks de e-commerce prearmados, priorizando buenas prácticas de seguridad en cada capa.

## Stack completo

**Backend**
- Node.js + Express 5
- PostgreSQL (Neon)
- JWT + bcrypt para autenticación
- Helmet, CORS y rate-limiting para seguridad HTTP

**Frontend**
- React 19 + Vite
- react-router-dom
- axios

## Arquitectura del repositorio

catalogo-pedidos/
├── backend/     # API REST (ver backend/README.md para detalle completo)
└── frontend/    # Interfaz web en React (ver frontend/README.md para detalle completo)

## Funcionalidades principales

- **Autenticación y roles:** registro, login con JWT, control de acceso diferenciado entre `cliente` y `admin`
- **Catálogo:** gestión de productos con soft delete, disponible públicamente vía API y consumido en tiempo real por el frontend
- **Pedidos:** creación transaccional (todo o nada) con validación y descuento de stock automático
- **Carrito de compras:** persistente en el navegador, conectado a la creación real de pedidos
- **Historial:** cada usuario puede ver sus pedidos anteriores

## Seguridad implementada

- Contraseñas hasheadas con bcrypt (nunca en texto plano)
- Tokens JWT con expiración de 2 horas
- Consultas SQL parametrizadas (protección contra inyección SQL)
- Transacciones SQL reales en operaciones críticas (creación de pedidos)
- Rate-limiting contra ataques de fuerza bruta en login/registro
- Headers de seguridad HTTP vía Helmet
- CORS restringido al origen autorizado del frontend
- Control de acceso: un usuario solo puede ver sus propios pedidos (salvo administradores)
- Variables sensibles (`.env`) excluidas del control de versiones en ambos proyectos
- Mensajes de error genéricos hacia el cliente; detalle completo solo en logs del servidor

## Cómo correr el proyecto completo

1. Configurar y levantar el backend (ver instrucciones detalladas en [`backend/README.md`](./backend/README.md)):
```bash
   cd backend
   npm install
   node src/migrations/migrate.js
   node src/server.js
```

2. En otra terminal, levantar el frontend (ver [`frontend/README.md`](./frontend/README.md)):
```bash
   cd frontend
   npm install
   npm run dev
```

3. Abrir `http://localhost:5173` en el navegador.

## Documentación detallada

- [Backend — documentación completa de la API](./backend/README.md)
- [Frontend — documentación completa de la interfaz](./frontend/README.md)

## Autor

**Sebastián Rey**
Desarrollador de software con enfoque en seguridad — **ZoltCode**