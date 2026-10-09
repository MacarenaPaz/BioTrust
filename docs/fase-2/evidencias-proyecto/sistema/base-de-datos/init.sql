CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    rut VARCHAR(12) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    embedding_facial BYTEA,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contratos (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    titulo VARCHAR(150) NOT NULL,
    hash_sha256 VARCHAR(64) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    firmado_en TIMESTAMP
);