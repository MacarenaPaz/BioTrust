# BioTrust - Plataforma Web SaaS de Validación de Identidad Digital Biométrica (OCR/Reconocimiento Facial) y Sellado Criptográfico con QR para Contratos en PYMES.

## 📌 Descripción del Proyecto
BioTrust es una solución web de carácter SaaS diseñada para resolver la problemática de suplantación de identidad e incertidumbre jurídica en la firma de contratos y acuerdos simples para PYMES en Chile. Permite validar en tiempo real la identidad de los firmantes mediante la lectura automatizada del carnet de identidad (OCR) y prueba de vida biométrica (reconocimiento facial vía webcam), emitiendo documentos PDF inalterables con marcas de agua, hash criptográfico y un código QR de verificación de autenticidad.

## 🛠️ Tecnologías Utilizadas
- **Frontend:** React.js / HTML5 / CSS3 / JavaScript (ES6+)
- **Backend:** Python (FastAPI / Django) o Node.js (Express)
- **Procesamiento Biométrico y OCR:** OpenCV / Tesseract OCR / Face-Recognition API
- **Base de Datos:** PostgreSQL (Modelo Relacional Escalable)
- **Seguridad & Cryptography:** PyPDF / ReportLab, hashlib (SHA-256), QRCode Generator
- **Containerización:** Docker & Docker-Compose

## 👥 Nombre y Roles
- **Macarena Avendaño:** Lead Developer, Arquitecta de Software, Ciberseguridad y DBA (Database Administrator).

## 🔄 Metodología de Trabajo
Se usa la metodología tradicional **Cascada (Waterfall)**, organizada de manera estrictamente secuencial en 6 actividades clave para cubrir las 18 semanas de la asignatura Capstone. Este enfoque permite avanzar por etapas ordenadas de análisis, diseño, desarrollo, integración y pruebas.

---

## 🗓️ Plan de Trabajo y Cronograma (18 Semanas)

El proyecto se estructura a lo largo del semestre académico en las 3 fases oficiales de Capstone:

### **Fase 1: Definición del Proyecto (Semanas 1 - 4)**
* **Actividad 1: Levantamiento y Requerimientos (SRS):** Definición formal del problema, casos de uso, requisitos funcionales/no funcionales y arquitectura base.

### **Fase 2: Desarrollo e Integración del Sistema (Semanas 4 - 15)**
* **Actividad 2: Construcción de BD y Backend Core (Semanas 4 - 6):** Diseñar la base de datos PostgreSQL y programar las APIs del servidor (autenticación y gestión documental).
* **Actividad 3: Desarrollo del Frontend Web (Semanas 7 - 8):** Maquetación y programación de la interfaz de usuario en React.
* **Actividad 4: Integración Biométrica y OCR (Semanas 9 - 11):** Módulo de lectura de cédula (OCR) y prueba de vida facial vía webcam.
* **Actividad 5: Motor de Cifrado y Sellado QR (Semanas 12 - 13):** Generación de hash SHA-256, marcas de agua y código QR inmutable en PDF.
* **Actividad 6: Pruebas, Despliegue Docker y Manuales (Semanas 14 - 15):** Pruebas integrales, containerización en Docker-Compose y redacción de documentación técnica.

### **Fase 3: Cierre y Examen (Semanas 16 - 18)**
* **Evaluación Final y Defensa Oral:** Consolidación de la documentación de cierre y preparación de la presentación ante la comisión evaluadora.

## 📐 Diagrama de Arquitectura

```text
[ Client / Browser ] ---> [ Frontend (React) ]
                                |
                         (REST API / HTTPS)
                                |
                                v
                   [ Backend (Python/Node.js) ]
                     |          |          |
                     v          v          v
                 [ OCR &     [ Engine   [ PostgreSQL DB ]
                 Biometry ]   Hash/QR ]   (Dockerized)
```

## 🚀 Despliegue
La aplicación cuenta con una arquitectura containerizada utilizando `Docker` y `Docker-Compose` para garantizar la portabilidad y continuidad operativa en entornos de producción simulados.

---

## 📁 Entregables y Documentación Capstone

Toda la documentación académica oficial del proyecto se encuentra organizada por fases en el directorio `/docs`:

* 📂 **[Fase 1: Definición del Proyecto](./docs/fase-1/)**
  * `1.1_APT122_AutoevaluacionCompetenciasFase1_Macarena_Avendano.docx`
  * `1.2_APT122_DiarioReflexionFase1_MACARENA_AVENDANO.docx`
  * `1.3_APT122_AutoevaluaciónFase1_MACARENA_AVENDANO.docx`
  * `1.4_APT122_FormativaFase1_MACARENA_AVENDANO.docx`
  * `1.5_Fase 1_Definicion_Proyecto_APT_MACARENA_AVENDANO_corregido.docx`
  * `Presentacion_Proyecto_Fase1.pptx`
* 📂 **[Fase 2: Desarrollo y Evidencias](./docs/fase-2/)** *(En progreso)*
* 📂 **[Fase 3: Cierre y Defensa Final](./docs/fase-3/)** *(Pendiente)*
