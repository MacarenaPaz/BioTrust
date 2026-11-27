# BioTrust - Plataforma Web SaaS de Validación de Identidad Digital Biométrica (OCR/Reconocimiento Facial) y Sellado Criptográfico con QR para Contratos en PYMES.

## 📌 Descripción del Proyecto
BioTrust es una solución web de carácter SaaS diseñada para resolver la problemática de suplantación de identidad e incertidumbre jurídica en la firma de contratos y acuerdos simples para PYMES en Chile. Permite validar en tiempo real la identidad de los firmantes mediante la lectura automatizada del carnet de identidad (OCR) y prueba de vida biométrica (reconocimiento facial vía webcam), emitiendo documentos PDF inalterables con marcas de agua, hash criptográfico y un código QR de verificación de autenticidad.

## 🛠️ Tecnologías Utilizadas
- **Frontend:** React.js + Vite, HTML5, CSS3, JavaScript (ES6+)
- **Backend:** API REST en Python (FastAPI / Uvicorn) con middleware de seguridad CORS
- **Procesamiento Biométrico & Seguridad:** Prueba de Vida Activa (*Active Liveness Detection* / Anti-Spoofing), autenticación 2FA, hash criptográfico `SHA-256` y cifrado binario `BYTEA`
- **Base de Datos:** PostgreSQL 15 (`init.sql` con integridad referencial y consistencia ACID)
- **Infraestructura y Despliegue:** Docker & Docker Compose (arquitectura multi-contenedor en red aislada)

## 👥 Nombre y Roles
- **Macarena Avendaño:** Lead Developer, Arquitecta de Software, Ciberseguridad y DBA (Database Administrator).

## 🔄 Metodología de Trabajo
Se usa la metodología tradicional **Cascada (Waterfall)**, organizada de manera estrictamente secuencial en 6 actividades clave para cubrir las 18 semanas de la asignatura Capstone. Este enfoque permite avanzar por etapas ordenadas de análisis, diseño, desarrollo, integración y pruebas.

---

## 🗓️ Plan de Trabajo y Cronograma (18 Semanas)

El proyecto se estructura a lo largo del semestre académico en las 3 fases oficiales de Capstone:

### **Fase 1: Definición del Proyecto (Semanas 1 - 4)**
- **Actividad 1: Levantamiento y Requerimientos (SRS):** Definición formal del problema, casos de uso, requisitos funcionales/no funcionales y arquitectura base.

### **Fase 2: Desarrollo e Integración del Sistema (Semanas 4 - 15)**
- **Actividad 2: Construcción de BD y Backend Core (Semanas 4 - 6):** Diseñar la base de datos PostgreSQL y programar las APIs del servidor (autenticación y gestión documental).
- **Actividad 3: Desarrollo del Frontend Web (Semanas 7 - 8):** Maquetación y programación de la interfaz de usuario en React.
- **Actividad 4: Integración Biométrica y OCR (Semanas 9 - 11):** Módulo de lectura de cédula (OCR) y prueba de vida facial vía webcam.
- **Actividad 5: Motor de Cifrado y Sellado QR (Semanas 12 - 13):** Generación de hash SHA-256, marcas de agua y código QR inmutable en PDF.
- **Actividad 6: Pruebas, Despliegue Docker y Manuales (Semanas 14 - 15):** Pruebas integrales, containerización en Docker-Compose y redacción de documentación técnica.

### **Fase 3: Cierre y Examen (Semanas 16 - 18)**
- **Evaluación Final y Defensa Oral:** Consolidación de la documentación de cierre y preparación de la presentación ante la comisión evaluadora.

## 📐 Diagrama de Arquitectura

```text
[ Client / Browser ] ---> [ Frontend (React) ]
                                |
                         (REST API / HTTPS)
                                |
                                v
                   [ Backend (Python REST API) ]
                     |          |          |
                     v          v          v
                 [ OCR &     [ Engine   [ PostgreSQL DB ]
                 Biometry ]   Hash/QR ]   (Dockerized)
```

## 🚀 Instrucciones de Ejecución Local (Despliegue)

Para ejecutar **BioTrust** de manera local en un entorno aislado, asegurar de tener instalados **Git** y **Docker Desktop** (en ejecución) y seguir estos pasos:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/MacarenaPaz/BioTrust.git
   cd BioTrust/docs/fase-2/evidencias-proyecto/sistema
   ```

2. **Construir y levantar los contenedores:**
   ```bash
   docker-compose up -d --build
   ```

3. **Verificar que los 3 servicios estén activos (`Up`):**
   ```bash
   docker ps
   ```

4. **Acceder a los servicios locales:**
   - **Aplicación Web (Frontend React):** `http://localhost:3000`
   - **API REST & Documentación (Backend Python):** `http://localhost:8000/docs`
   - **Base de Datos (PostgreSQL 15):** Puerto `5432` (Base de datos: `biotrust_db`)

---

## 📁 Entregables y Documentación Capstone

Toda la documentación académica oficial del proyecto se encuentra organizada por fases en el directorio `/docs`:

### 📁 Entregables Fase 1 - BioTrust

#### 👤 Evidencias Individuales
- 📄 [1.1 Autoevaluación de Competencias](docs/fase-1/evidencias-individuales/1.1_APT122_AutoevaluacionCompetenciasFase1_Macarena_Avendano.docx)
- 📄 [1.2 Diario de Reflexión](docs/fase-1/evidencias-individuales/1.2_APT122_DiarioReflexionFase1_MACARENA_AVENDANO.docx)
- 📄 [1.3 Autoevaluación Fase 1](docs/fase-1/evidencias-individuales/1.3_APT122_AutoevaluaciónFase1_MACARENA_AVENDANO.docx)

#### 👥 Evidencias Grupales / Proyecto
- 📊 **Presentación del Proyecto (Defensa Oral):**
  * 🔴 [Ver Presentación Interactiva en Canva](https://canva.link/id03ah4p510vafw)
  * 📄 [Descargar Presentación PDF en Repository](docs/fase-1/evidencias-grupales/Presentación_Capstone_BioTrust_FASE1.pdf)
- 📄 [1.4 Formativa Fase 1](docs/fase-1/evidencias-grupales/1.4_APT122_FormativaFase1_MACARENA_AVENDANO.docx)
- 📄 [1.5 Guía Definición del Proyecto APT (Español-Inglés)](docs/fase-1/evidencias-grupales/1.5_Fase1_Definicion_Proyecto_APT_MACARENA_AVENDANO_corregido.docx)

---

### 📁 Entregables Fase 2 - BioTrust

#### 👤 Evidencias Individuales
- 📄 [2.1 Diario de Reflexión Fase 2](docs/fase-2/evidencias-individuales/2.1_APT122_DiarioReflexionFase2_MACARENA_AVENDANO.docx)

#### 👥 Evidencias Grupales
- 📄 [2.4 Guía Desarrollo Proyecto APT (Español-Inglés)](docs/fase-2/evidencias-grupales/2.4_GuiaEstudiante_Fase2_DesarrolloProyectoAPT_MACARENA_AVENDANO.docx)
- 📄 [2.6 Guía Informe Final Proyecto APT (Español-Inglés)](docs/fase-2/evidencias-grupales/2.6_GuiaEstudiante_Fase_2_Informe_Final_Proyecto_APT_Macarena_Avendano.docx)

#### 🚀 Evidencias Proyecto
- 📊 **Presentación del Proyecto (Defensa Oral):**
  * 🔴 [Ver Presentación Interactiva en Canva](https://canva.link/ewwgybinjd8i7uw)
  * 📄 [Descargar Presentación PDF en Repository](docs/fase-2/evidencias-proyecto/Presentacion_Proyecto_BioTrust-AVANCE.pdf)
  * 🎥 **Video de Presentación Fase 2 - Avance (8-10 min):** [Ver Video en Google Drive](https://drive.google.com/file/d/1dkb3c4mNwOm5kYNH_5NLZaJSol7mz6jx/view?usp=sharing)
- 📑 [Documentación Técnica (Arquitectura, SRS, Pruebas y Manuales)](docs/fase-2/evidencias-proyecto/documentacion/)
- 💻 [Código Fuente de la Aplicación y Base de Datos](docs/fase-2/evidencias-proyecto/sistema/)
- 📊 **Presentación Fase 2 - Final:** [Ver Presentación Oral y Demo en Canva](https://canva.link/x0ryjet9kme0jte)
  * 📄 [Descargar Presentación PDF en Repository](docs/fase-2/evidencias-proyecto/Presentacion_Proyecto_BioTrust-FINAL_Fase2.pdf)

---

### 📁 Entregables Fase 3 - Cierre y Defensa Final ante Comisión

#### 👤 Evidencias Individuales
- 📄 [3.1 Diario de Reflexión Fase 3](docs/fase-3/evidencias-individuales/3.1_APT122_DiarioReflexionFase3_Macarena_Avendano.docx)

#### 👥 Evidencias Grupales / Presentación Final
- 📊 **Presentación Final del Proyecto (Canva):** [Ver Presentación de Defensa en Canva](https://canva.link/z7kkonexoa1sjf0)
- 📄 [Presentación Final del Proyecto](docs/fase-3/evidencias-grupales/Presentacion_Final_Proyecto_BioTrust.pdf)
