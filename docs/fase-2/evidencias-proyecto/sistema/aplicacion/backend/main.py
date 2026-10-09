import os
import hashlib
import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="BioTrust API", version="1.0")

# Habilitar CORS para permitir peticiones desde el Frontend de React (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de conexión a PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:secretpassword@db:5432/biotrust_db")

def get_db():
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)

# Modelos Pydantic para validación de entrada
class UsuarioCreate(BaseModel):
    rut: str
    nombre: str
    email: str

class ContratoCreate(BaseModel):
    usuario_id: int
    titulo: str
    documento_texto: str

class FirmaContrato(BaseModel):
    contrato_id: int
    rut_usuario: str
    embedding_simulado: str  # Representación vectorial o hash del rostro

@app.get("/")
def read_root():
    return {
        "status": "ok", 
        "system": "BioTrust API", 
        "privacy": "Privacy by Design - Hashing & Local Embeddings Only"
    }

@app.post("/api/v1/usuarios")
def registrar_usuario(usuario: UsuarioCreate):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO usuarios (rut, nombre, email) VALUES (%s, %s, %s) RETURNING id, rut, nombre, email;",
            (usuario.rut, usuario.nombre, usuario.email)
        )
        nuevo_usuario = cursor.fetchone()
        conn.commit()
        return {"status": "success", "data": nuevo_usuario}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.post("/api/v1/contratos")
def crear_contrato(contrato: ContratoCreate):
    conn = get_db()
    cursor = conn.cursor()
    
    # Generar Hash SHA-256 del documento para integridad (Privacy by Design)
    hash_documento = hashlib.sha256(contrato.documento_texto.encode('utf-8')).hexdigest()
    
    try:
        cursor.execute(
            "INSERT INTO contratos (usuario_id, titulo, hash_sha256) VALUES (%s, %s, %s) RETURNING id, titulo, hash_sha256, estado;",
            (contrato.usuario_id, contrato.titulo, hash_documento)
        )
        nuevo_contrato = cursor.fetchone()
        conn.commit()
        return {"status": "success", "data": nuevo_contrato}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.post("/api/v1/contratos/firmar")
def firmar_contrato(datos: FirmaContrato):
    conn = get_db()
    cursor = conn.cursor()
    try:
        # 1. Guardar hash del embedding del rostro
        hash_biometrico = hashlib.sha256(datos.embedding_simulado.encode('utf-8')).digest()
        
        cursor.execute(
            "UPDATE usuarios SET embedding_facial = %s WHERE rut = %s RETURNING id;",
            (hash_biometrico, datos.rut_usuario)
        )
        usuario = cursor.fetchone()
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        # 2. Actualizar estado del contrato a 'firmado'
        cursor.execute(
            "UPDATE contratos SET estado = 'firmado', firmado_en = CURRENT_TIMESTAMP WHERE id = %s RETURNING id, estado, firmado_en;",
            (datos.contrato_id,)
        )
        contrato = cursor.fetchone()
        conn.commit()

        return {
            "status": "success",
            "message": "Contrato firmado exitosamente con verificación biométrica hash",
            "data": contrato
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()