-- src/migrations/002_create_productos.sql
-- Crea la tabla de productos del catalogo

CREATE TABLE IF NOT EXISTS productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    imagen_url VARCHAR(500),
    activo BOOLEAN NOT NULL DEFAULT true,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()
);