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
Se usa la metodología ágil **Scrum/Kanban** gestionada a través de GitHub Projects, organizada en iteraciones semanales para cubrir las 3 fases del semestre de Capstone.

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
La aplicación cuenta con una arquitectura containerizada utilizandoo `Docker` y `Docker-Compose` para garantizar la portabilidad y continuidad operativa en entornos de producción simulados.
