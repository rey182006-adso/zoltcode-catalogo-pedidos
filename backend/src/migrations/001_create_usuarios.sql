-- src/migrations/001_create_usuarios.sql
-- Crea la tabla de usuarios con los campos definidos en el modelo de datos

CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'cliente' CHECK (rol IN ('cliente', 'admin')),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()
);