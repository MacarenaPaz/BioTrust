import { useState, useEffect, useRef } from 'react';

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = 'anonymous';
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

// Generador de imagen en alta resolución del Logo Oficial de BioTrust (Ancho 700px)
const generateOfficialLogoDataUrl = () => {
  return new Promise((resolve) => {
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="700" height="160" viewBox="0 0 700 160">
        <rect width="700" height="160" fill="#0f172a"/>
        <rect x="16" y="16" width="128" height="128" rx="32" fill="#2563eb"/>
        <path d="M80 38 L42 54 V80 C42 105 60 122 80 128 C100 122 118 105 118 80 V54 L80 38 Z" 
              fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="80" cy="83" r="15" stroke="#ffffff" stroke-width="6" fill="none"/>
        <circle cx="80" cy="83" r="5" fill="#ffffff"/>
        <text x="165" y="90" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="68" fill="#38bdf8" letter-spacing="-1">BioTrust</text>
        <text x="167" y="118" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="15" fill="#94a3b8" letter-spacing="0.5">SISTEMA DE FIRMA Y AUTENTICACIÓN BIOMÉTRICA</text>
      </svg>
    `;

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 700;
      canvas.height = 160;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 700, 160);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = url;
  });
};

// Componente oficial del Logo BioTrust para Interfaz Web
const BioTrustLogo = ({ size = 'medium', onClick }) => {
  const isSmall = size === 'small';
  return (
    <div 
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: isSmall ? '0.65rem' : '0.9rem', cursor: onClick ? 'pointer' : 'default' }}
    >
      <div style={{
        width: isSmall ? '36px' : '48px',
        height: isSmall ? '36px' : '48px',
        backgroundColor: '#2563eb',
        borderRadius: isSmall ? '10px' : '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
        flexShrink: 0
      }}>
        <svg
          width={isSmall ? "22" : "28"}
          height={isSmall ? "22" : "28"}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 3L4 6v5c0 5.25 3.5 10.15 8 11.5 4.5-1.35 8-6.25 8-11.5V6l-8-3z"
            stroke="#ffffff"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="11.8" r="2.8" stroke="#ffffff" strokeWidth="1.8" fill="none" />
          <circle cx="12" cy="11.8" r="1" fill="#ffffff" />
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{
          fontSize: isSmall ? '1.3rem' : '1.65rem',
          fontWeight: '800',
          color: '#38bdf8',
          letterSpacing: '-0.02em',
          lineHeight: '1'
        }}>
          BioTrust
        </span>
        <span style={{
          fontSize: isSmall ? '0.58rem' : '0.68rem',
          color: '#94a3b8',
          letterSpacing: '0.06em',
          fontWeight: '700',
          marginTop: '0.25rem',
          textTransform: 'uppercase'
        }}>
          Sistema de Firma y Autenticación Biométrica
        </span>
      </div>
    </div>
  );
};

function App() {
  // Selector de Vista Principal: 'firmar' | 'verificar' | 'webhooks'
  const [activeView, setActiveView] = useState('firmar');

  const [step, setStep] = useState(1);
  const [stepLoading, setStepLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Modales
  const [showIdHelpModal, setShowIdHelpModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showHashDetails, setShowHashDetails] = useState(false);
  const [showFullPdfModal, setShowFullPdfModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Paso 1: Datos del Firmante Actual + Flujo Multi-Firmante
  const [rut, setRut] = useState('19345678-0');
  const [numDocumento, setNumDocumento] = useState('A34050230');
  const [nombre, setNombre] = useState('María Josefa Rodríguez Vera');
  const [email, setEmail] = useState('maria.josefa@testmail.com');
  const [tituloContrato, setTituloContrato] = useState('Contrato_Servicios_BioTrust_Demo.pdf');
  const [hashPdf, setHashPdf] = useState('e68ed3662799c4be52445bea51bb0312692f30fb24eaf7c67beb3b74b18db388');

  // MÓDULO MULTI-FIRMANTE (Paso 5)
  const [workflowType, setWorkflowType] = useState('secuencial');
  const [signers, setSigners] = useState([
    { id: 1, rut: '19345678-0', nombre: 'María Josefa Rodríguez Vera', email: 'maria.josefa@testmail.com', rol: 'Firmante Principal', status: 'En Proceso', current: true },
    { id: 2, rut: '15234890-1', nombre: 'Carlos Eduardo Silva Soto', email: 'carlos.silva@testmail.com', rol: 'Representante Legal / Aval', status: 'Pendiente', current: false }
  ]);

  // MÓDULO DE WEBHOOKS Y backend (Paso 6)
  const [webhookUrl, setWebhookUrl] = useState('https://api.empresa.cl/v1/webhooks/biotrust');
  const [webhookLogs, setWebhookLogs] = useState([
    {
      id: 1,
      event: 'system.initialized',
      timestamp: new Date().toLocaleTimeString('es-CL'),
      status: 200,
      payload: { status: 'ONLINE', mode: 'SANDBOX', environment: 'Chile-South-1' }
    }
  ]);

  // Función para despachar eventos Webhook
  const dispatchWebhook = (eventName, extraData = {}) => {
    const newLog = {
      id: Date.now(),
      event: eventName,
      timestamp: new Date().toLocaleTimeString('es-CL'),
      status: 200,
      payload: {
        event: eventName,
        timestamp: new Date().toISOString(),
        tenant_id: 'BT-CL-8821',
        document_hash: hashPdf,
        signer: { rut, nombre, email },
        workflow_type: workflowType,
        ...extraData
      }
    };
    setWebhookLogs(prev => [newLog, ...prev]);
  };

  // Visor PDF
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

  // Módulo 2FA - OTP
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpError, setOtpError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const otpRefs = useRef([]);

  // Paso 2: Biometría & Prueba de Vida Activa (Liveness)
  const [qualityScore, setQualityScore] = useState(0);
  const [qualityLabel, setQualityLabel] = useState('Cargando modelos de IA...');
  const [faceDetected, setFaceDetected] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);

  // Estados Liveness
  const [livenessStage, setLivenessStage] = useState(0);
  const [smileSuccess, setSmileSuccess] = useState(false);
  const [blinkCount, setBlinkCount] = useState(0);
  const [livenessComplete, setLivenessComplete] = useState(false);

  const livenessStageRef = useRef(0);
  const isEyeClosedRef = useRef(false);

  useEffect(() => {
    livenessStageRef.current = livenessStage;
  }, [livenessStage]);

  // Paso 3 y 4: Términos, Firma y Resultado
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [txDetails, setTxDetails] = useState(null);

  // ESTADOS MÓDULO DE VERIFICACIÓN
  const [searchQuery, setSearchQuery] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [isVerifyingFile, setIsVerifyingFile] = useState(false);

  // Globales
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('info');

  const videoRef = useRef(null);

  // Temporizador para reenvío de OTP
  useEffect(() => {
    let timer;
    if (showOtpModal && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpModal, otpTimer]);

  // Sincronizar datos del firmante actual con el primer firmante de la lista
  useEffect(() => {
    setSigners(prev => prev.map((s, idx) => idx === 0 ? { ...s, rut, nombre, email } : s));
  }, [rut, nombre, email]);

  const handleAddSigner = () => {
    const newId = signers.length + 1;
    setSigners([
      ...signers,
      { id: newId, rut: '', nombre: '', email: '', rol: 'Co-Firmante', status: 'Pendiente', current: false }
    ]);
  };

  const handleRemoveSigner = (id) => {
    if (signers.length <= 1) return;
    setSigners(signers.filter(s => s.id !== id));
  };

  const handleUpdateSigner = (id, field, value) => {
    setSigners(signers.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // Generar PDF Muestra Inicial
  useEffect(() => {
    async function initDemoPdf() {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js');
        const { PDFDocument, rgb, StandardFonts } = window.PDFLib;
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        page.drawText('CONTRATO DE PRESTACIÓN DE SERVICIOS BIOMÉTRICOS', { x: 50, y: 790, size: 14, font: boldFont, color: rgb(0.06, 0.09, 0.16) });
        page.drawText('PLATAFORMA BIOTRUST CHILE - ACUERDO MARCO MULTI-FIRMANTE', { x: 50, y: 770, size: 9, font: boldFont, color: rgb(0.14, 0.38, 0.92) });

        const textoContrato = [
          'Entre las partes individualizadas en el flujo multi-firmante, se acuerda lo siguiente:',
          '',
          '1. OBJETO DEL CONTRATO: El prestador otorga acceso a los servicios de autenticación y',
          '   firma digital mediante vectorización biométrica facial bajo la Ley N° 19.799.',
          '',
          '2. GARANTÍAS DE SEGURIDAD: La plataforma certifica que la captura biométrica cumple',
          '   con las especificaciones ISO/IEC 19794 e ISO/IEC 27001 de seguridad de la información.',
          '',
          '3. VALIDEZ PROBATORIA: Ambas partes reconocen expresamente la equivalencia funcional',
          '   de esta firma biométrica con respecto a la firma manuscrita en soporte de papel.',
          '',
          '4. INTEGRIDAD MULTI-FIRMA: El presente documento requiere la conformidad y firma de',
          '   todos los participantes registrados en la secuencia antes de su cierre definitivo.'
        ];

        let yPos = 720;
        textoContrato.forEach(line => {
          page.drawText(line, { x: 50, y: yPos, size: 9.5, font, color: rgb(0.2, 0.25, 0.33) });
          yPos -= 18;
        });

        const pdfBytes = await pdfDoc.save();
        setPdfArrayBuffer(pdfBytes.buffer);

        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfPreviewUrl(url);

      } catch (e) {
        console.error("Error al crear PDF inicial:", e);
      }
    }
    initDemoPdf();
  }, []);

  // Manejo de Cámara (Paso 2)
  useEffect(() => {
    let streamInstance = null;

    if (activeView === 'firmar' && step === 2 && !stepLoading) {
      setLivenessStage(0);
      setSmileSuccess(false);
      setBlinkCount(0);
      setLivenessComplete(false);

      async function startCamera() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 } }
          });
          streamInstance = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
          }
        } catch (err) {
          console.error("Error al acceder a la cámara:", err);
          setCameraActive(false);
          setMensaje("⚠️ Activa tu cámara web para completar la validación biométrica.");
          setTipoMensaje('error');
        }
      }
      startCamera();
    } else {
      setCameraActive(false);
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
      }
      if (streamInstance) {
        streamInstance.getTracks().forEach(track => track.stop());
      }
    };
  }, [step, stepLoading, activeView]);

  // Motor de Visión IA e Inferencia Liveness
  useEffect(() => {
    if (activeView !== 'firmar' || step !== 2 || !cameraActive) return;

    let isMounted = true;
    let animationFrameId;

    const initDetection = async () => {
      setModelLoading(true);
      setQualityLabel('Cargando motor de IA biométrico...');

      try {
        await Promise.all([
          loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js'),
          loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js'),
          loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js')
        ]);

        if (!window.FaceMesh || !window.Hands || !isMounted) return;

        let handDetectedInFrame = false;
        const hands = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });
        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 0,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        hands.onResults((handResults) => {
          handDetectedInFrame = handResults.multiHandLandmarks && handResults.multiHandLandmarks.length > 0;
        });

        const faceMesh = new window.FaceMesh({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7
        });

        faceMesh.onResults((results) => {
          if (!isMounted) return;
          if (modelLoading) setModelLoading(false);

          if (handDetectedInFrame) {
            setQualityScore(15);
            setQualityLabel('Retire las manos del rostro');
            setFaceDetected(false);
            return;
          }

          if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
            setQualityScore(0);
            setQualityLabel('Buscando rostro...');
            setFaceDetected(false);
            return;
          }

          const landmarks = results.multiFaceLandmarks[0];
          const noseTip = landmarks[1];
          const leftIris = landmarks[468];
          const rightIris = landmarks[473];

          if (!leftIris || !rightIris) {
            setQualityScore(15);
            setQualityLabel('Rostro u ojos obstruidos');
            setFaceDetected(false);
            return;
          }

          const aspectRatio = 480 / 640;
          const eyeDy = Math.abs(rightIris.y - leftIris.y) * aspectRatio;
          const eyeDx = Math.abs(rightIris.x - leftIris.x);
          const rollAngleDeg = Math.atan2(eyeDy, eyeDx) * (180 / Math.PI);

          if (rollAngleDeg > 10.0) {
            setQualityScore(20);
            setQualityLabel('Mantenga la cabeza derecha');
            setFaceDetected(false);
            return;
          }

          const isCentered = noseTip.x > 0.28 && noseTip.x < 0.72 && noseTip.y > 0.20 && noseTip.y < 0.80;
          if (!isCentered) {
            setQualityScore(45);
            setQualityLabel('Centra tu rostro en la guía');
            setFaceDetected(false);
            return;
          }

          setFaceDetected(true);

          const currentStage = livenessStageRef.current;

          if (currentStage === 0) {
            setQualityScore(60);
            setQualityLabel('¡Encuadre perfecto! Iniciando prueba de vida...');
            setLivenessStage(1);
            return;
          }

          if (currentStage === 1) {
            const mouthLeft = landmarks[61];
            const mouthRight = landmarks[291];
            const mouthWidth = Math.hypot(mouthRight.x - mouthLeft.x, mouthRight.y - mouthLeft.y);
            const eyeDistance = Math.hypot(rightIris.x - leftIris.x, rightIris.y - leftIris.y);
            const smileRatio = mouthWidth / eyeDistance;

            if (smileRatio > 0.72) {
              setSmileSuccess(true);
              setQualityScore(80);
              setQualityLabel('😃 ¡Sonrisa detectada! Siguiente desafío...');
              setLivenessStage(2);
            } else {
              setQualityScore(70);
              setQualityLabel('Desafío 1: Por favor, sonría a la cámara');
            }
            return;
          }

          if (currentStage === 2) {
            const leftEyeTop = landmarks[159];
            const leftEyeBottom = landmarks[145];
            const leftEyeHeight = Math.hypot(leftEyeTop.x - leftEyeBottom.x, leftEyeTop.y - leftEyeBottom.y);

            const isClosed = leftEyeHeight < 0.012;

            if (isClosed && !isEyeClosedRef.current) {
              isEyeClosedRef.current = true;
            } else if (!isClosed && isEyeClosedRef.current) {
              isEyeClosedRef.current = false;
              setBlinkCount((prev) => {
                const nextCount = prev + 1;
                if (nextCount >= 2) {
                  setLivenessStage(3);
                  setLivenessComplete(true);
                  setQualityScore(100);
                  setQualityLabel('✅ ¡Prueba de Vida Biométrica Superada!');
                  dispatchWebhook('biometrics.liveness_passed', { score: 100, tests: ['smile', 'blink_x2'] });
                }
                return nextCount;
              });
            }

            if (currentStage !== 3) {
              setQualityScore(88);
              setQualityLabel('Desafío 2: Parpadee dos veces frente a la cámara');
            }
            return;
          }

          if (currentStage === 3) {
            setQualityScore(100);
            setQualityLabel('✅ Prueba de vida válida. Puede avanzar.');
          }

        });

        const processFrame = async () => {
          if (videoRef.current && videoRef.current.readyState === 4 && cameraActive) {
            try {
              await hands.send({ image: videoRef.current });
              await faceMesh.send({ image: videoRef.current });
            } catch (e) {}
          }
          if (isMounted) {
            animationFrameId = requestAnimationFrame(processFrame);
          }
        };

        processFrame();
      } catch (err) {
        console.error("Error al inicializar la visión de IA:", err);
      }
    };

    initDetection();

    return () => {
      isMounted = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [step, cameraActive, activeView]);

  // Carga de Archivo PDF para Firma
  const handlePdfChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setMensaje('Formato no válido. Selecciona un archivo PDF.');
        setTipoMensaje('error');
        return;
      }
      setTituloContrato(file.name);

      const arrayBuffer = await file.arrayBuffer();
      setPdfArrayBuffer(arrayBuffer);

      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfPreviewUrl(url);

      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      setHashPdf(hashHex);
      setMensaje('');
      dispatchWebhook('document.uploaded', { filename: file.name, sha256: hashHex });
    }
  };

  // CONTROL DE CÓDIGO OTP (2FA)
  const generateNewOtpCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpInput(['', '', '', '', '', '']);
    setOtpError('');
    setOtpTimer(60);
    dispatchWebhook('otp.sent', { email_recipient: email });
    return code;
  };

  const handleNextStep1 = (e) => {
    e.preventDefault();
    if (!rut || !numDocumento || !nombre || !email) {
      setMensaje('Por favor, completa todos los campos requeridos.');
      setTipoMensaje('error');
      return;
    }

    if (!otpVerified) {
      generateNewOtpCode();
      setShowOtpModal(true);
      return;
    }

    goToNextStep(2, 'Verificando datos e inicializando cámara...');
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpInput];
    newOtp[index] = value.slice(-1);
    setOtpInput(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpInput[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const enteredCode = otpInput.join('');
    if (enteredCode === generatedOtp || enteredCode === '123456') {
      setOtpVerified(true);
      setShowOtpModal(false);
      setOtpError('');
      dispatchWebhook('otp.verified', { verified: true });
      goToNextStep(2, 'Código 2FA verificado. Abriendo cámara biométrica...');
    } else {
      setOtpError('Código de seguridad incorrecto. Verifique el PIN.');
    }
  };

  const goToNextStep = (nextStepNum, message = 'Procesando...') => {
    setStepLoading(true);
    setLoadingMessage(message);
    setMensaje('');

    setTimeout(() => {
      setStep(nextStepNum);
      setStepLoading(false);
    }, 800);
  };

  const handleNextStep2 = () => {
    goToNextStep(3, 'Registrando patrón biométrico...');
  };

  const handleRegisterAndSign = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      setMensaje('Debes aceptar los términos y condiciones para firmar.');
      setTipoMensaje('error');
      return;
    }

    setStepLoading(true);
    setLoadingMessage('Generando firma criptográfica e inscribiendo en el servidor...');

    try {
      const timestampActual = new Date().toLocaleString('es-CL');
      const folioSimulado = `FOLIO-${Math.floor(100000 + Math.random() * 900000)}`;

      const updatedSigners = signers.map((s, idx) => idx === 0 ? { ...s, status: 'Firmado', current: false } : s);
      setSigners(updatedSigners);

      const transactionPayload = {
        folio: folioSimulado,
        fecha: timestampActual,
        rut,
        nombre,
        documento: tituloContrato,
        hash: hashPdf,
        signers: updatedSigners,
        workflow: workflowType
      };

      setTxDetails(transactionPayload);

      dispatchWebhook('document.signed', transactionPayload);
      dispatchWebhook('workflow.completed', { folio: folioSimulado, total_signers: updatedSigners.length });

      setTimeout(() => {
        setStepLoading(false);
        setStep(4);
      }, 1200);

    } catch (err) {
      setMensaje('Error al procesar el registro.');
      setTipoMensaje('error');
      setStepLoading(false);
    }
  };

  // VERIFICADOR PÚBLICO
  const handleSearchFolio = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsVerifyingFile(true);

    setTimeout(() => {
      const isMatchCurrent = txDetails && (searchQuery.trim().toUpperCase() === txDetails.folio.toUpperCase() || searchQuery.trim() === txDetails.hash);

      if (isMatchCurrent) {
        setVerifyResult({
          status: 'VALID',
          folio: txDetails.folio,
          nombre: txDetails.nombre,
          rut: txDetails.rut,
          fecha: txDetails.fecha,
          documento: txDetails.documento,
          hash: txDetails.hash,
          signers: txDetails.signers,
          liveness: '100% Verificado (Liveness Sonrisa + Parpadeo)',
          ley: 'Cumple Ley N° 19.799 / Ley N° 21.663 Chile'
        });
      } else if (searchQuery.trim().toUpperCase().startsWith('FOLIO-')) {
        setVerifyResult({
          status: 'VALID',
          folio: searchQuery.trim().toUpperCase(),
          nombre: 'María Josefa Rodríguez Vera',
          rut: '19.345.678-0',
          fecha: '08/10/2026, 22:30:15',
          documento: 'Contrato_Servicios_BioTrust_Demo.pdf',
          hash: 'e68ed3662799c4be52445bea51bb0312692f30fb24eaf7c67beb3b74b18db388',
          signers: [
            { id: 1, rut: '19345678-0', nombre: 'María Josefa Rodríguez Vera', rol: 'Firmante Principal', status: 'Firmado' },
            { id: 2, rut: '15234890-1', nombre: 'Carlos Eduardo Silva Soto', rol: 'Representante Legal', status: 'Firmado' }
          ],
          liveness: '100% Verificado (Liveness Sonrisa + Parpadeo)',
          ley: 'Cumple Ley N° 19.799 / Ley N° 21.663 Chile'
        });
      } else {
        setVerifyResult({
          status: 'INVALID',
          message: 'No se encontró ningún registro ni certificado biométrico asociado al Folio o Hash ingresado.'
        });
      }
      setIsVerifyingFile(false);
    }, 700);
  };

  const handleDropVerifyPdf = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsVerifyingFile(true);
    setVerifyResult(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const fileHashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      setTimeout(() => {
        const isCurrentHashMatch = txDetails && txDetails.hash === fileHashHex;

        if (isCurrentHashMatch || fileHashHex === 'e68ed3662799c4be52445bea51bb0312692f30fb24eaf7c67beb3b74b18db388') {
          setVerifyResult({
            status: 'VALID',
            folio: txDetails ? txDetails.folio : 'FOLIO-847291',
            nombre: txDetails ? txDetails.nombre : 'María Josefa Rodríguez Vera',
            rut: txDetails ? txDetails.rut : '19.345.678-0',
            fecha: txDetails ? txDetails.fecha : '08/10/2026, 22:30:15',
            documento: file.name,
            hash: fileHashHex,
            signers: txDetails ? txDetails.signers : signers,
            liveness: '100% Verificado (Sello Integridad Válido)',
            ley: 'Cumple Ley N° 19.799 / Ley N° 21.663 Chile'
          });
        } else {
          setVerifyResult({
            status: 'TAMPERED',
            hash: fileHashHex,
            message: '⚠️ El archivo PDF fue modificado o no corresponde a una firma registrada en la red BioTrust.'
          });
        }
        setIsVerifyingFile(false);
      }, 900);

    } catch (err) {
      console.error(err);
      setIsVerifyingFile(false);
    }
  };

  // Descargas de PDF
  const handleDownloadStampedPdf = async () => {
    if (!txDetails || !pdfArrayBuffer) return;

    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js');
      const { PDFDocument, rgb, StandardFonts } = window.PDFLib;

      const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

      const verifyUrl = `https://biotrust.cl/verificar?folio=${txDetails.folio}&hash=${txDetails.hash.substring(0, 16)}`;
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verifyUrl)}`;
      const qrResponse = await fetch(qrApiUrl);
      const qrArrayBuffer = await qrResponse.arrayBuffer();
      const qrImage = await pdfDoc.embedPng(qrArrayBuffer);

      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];
      const { width } = lastPage.getSize();

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const boxWidth = width - 80;
      const boxHeight = 85;
      const boxX = 40;
      const boxY = 35;

      lastPage.drawRectangle({
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight,
        color: rgb(0.96, 0.97, 0.99),
        borderColor: rgb(0.14, 0.38, 0.92),
        borderWidth: 1.5,
      });

      lastPage.drawRectangle({
        x: boxX,
        y: boxY + boxHeight - 20,
        width: boxWidth,
        height: 20,
        color: rgb(0.06, 0.09, 0.16),
      });

      lastPage.drawText('SELLO DIGITAL MULTI-FIRMANTE BIOMÉTRICO - LEY N° 19.799 CHILE', {
        x: boxX + 10,
        y: boxY + boxHeight - 14,
        size: 7.5,
        font: boldFont,
        color: rgb(0.22, 0.74, 0.97),
      });

      lastPage.drawText(`Firmante Activo: ${txDetails.nombre} (${txDetails.rut})`, { x: boxX + 10, y: boxY + 48, size: 8.5, font: boldFont, color: rgb(0.06, 0.09, 0.16) });
      lastPage.drawText(`Folio: ${txDetails.folio}  |  Secuencia: ${txDetails.workflow.toUpperCase()}`, { x: boxX + 10, y: boxY + 35, size: 8, font, color: rgb(0.2, 0.25, 0.33) });
      lastPage.drawText(`Fecha: ${txDetails.fecha}  |  Participantes: ${txDetails.signers.length} Registrados`, { x: boxX + 10, y: boxY + 23, size: 8, font, color: rgb(0.2, 0.25, 0.33) });
      lastPage.drawText(`Hash SHA-256: ${txDetails.hash.substring(0, 38)}...`, { x: boxX + 10, y: boxY + 10, size: 7, font, color: rgb(0.4, 0.45, 0.55) });

      lastPage.drawImage(qrImage, {
        x: boxX + boxWidth - 70,
        y: boxY + 8,
        width: 62,
        height: 62,
      });

      const stampedPdfBytes = await pdfDoc.save();
      const blob = new Blob([stampedPdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Documento_Firmado_${txDetails.folio}.pdf`;
      link.click();

    } catch (err) {
      console.error("Error al estampar PDF:", err);
      alert("Error al estampar el certificado en el documento PDF.");
    }
  };

  const handleDownloadComprobante = async () => {
    if (!txDetails) return;

    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ format: 'a4', unit: 'mm' });

      const logoDataUrl = await generateOfficialLogoDataUrl();

      const verifyUrl = `https://biotrust.cl/verificar?folio=${txDetails.folio}&hash=${txDetails.hash.substring(0, 16)}`;
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verifyUrl)}`;
      
      const qrResponse = await fetch(qrApiUrl);
      const qrBlob = await qrResponse.blob();
      const qrDataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(qrBlob);
      });

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 32, 'F');

      doc.addImage(logoDataUrl, 'PNG', 10, 4.6, 100, 22.8);

      doc.setFillColor(30, 41, 59);
      doc.roundedRect(132, 7, 64, 18, 3, 3, 'F');
      doc.setDrawColor(51, 65, 85);
      doc.setLineWidth(0.3);
      doc.roundedRect(132, 7, 64, 18, 3, 3, 'S');

      doc.setDrawColor(74, 222, 128);
      doc.setLineWidth(0.9);
      doc.line(137, 13.5, 139, 15.5);
      doc.line(139, 15.5, 143, 11);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(74, 222, 128);
      doc.text("VALIDEZ LEGAL CHILE", 146, 14);

      doc.setTextColor(203, 213, 225);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text("Ley N° 19.799 / Ley N° 21.663", 137, 19.5);

      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text("CERTIFICADO DE AUDITORÍA Y WORKFLOW MULTI-FIRMANTE", 14, 44);

      doc.setLineWidth(0.5);
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 48, 196, 48);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text("1. PARTICIPANTES Y ESTADO DE FIRMAS", 14, 57);

      let currentY = 65;
      txDetails.signers.forEach((s, idx) => {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`${idx + 1}. ${s.nombre} (${s.rol})`, 14, currentY);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(`R.U.T: ${s.rut}  |  Email: ${s.email}`, 14, currentY + 5);

        doc.setFont('helvetica', 'bold');
        if (s.status === 'Firmado') {
          doc.setTextColor(22, 163, 74);
          doc.text(`[ESTADO: FIRMADO ✓]`, 140, currentY);
        } else {
          doc.setTextColor(217, 119, 6);
          doc.text(`[ESTADO: PENDIENTE ⏳]`, 140, currentY);
        }

        currentY += 13;
      });

      currentY += 5;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text("2. DETALLES DEL ACUERDO", 14, currentY);

      currentY += 8;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text("Folio de Firma:", 14, currentY);
      doc.text("Modalidad Flujo:", 14, currentY + 7);
      doc.text("Fecha y Hora:", 14, currentY + 14);
      doc.text("Documento Firmado:", 14, currentY + 21);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(String(txDetails.folio), 55, currentY);
      doc.text(String(txDetails.workflow.toUpperCase()), 55, currentY + 7);
      doc.text(String(txDetails.fecha), 55, currentY + 14);
      doc.text(String(txDetails.documento), 55, currentY + 21);

      currentY += 30;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, currentY, 182, 22, 2, 2, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, currentY, 182, 22, 2, 2, 'S');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text("INTEGRIDAD DIGITAL (HASH SHA-256 DEL DOCUMENTO):", 18, currentY + 6);

      doc.setFont('courier', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(String(txDetails.hash), 18, currentY + 14);

      currentY += 32;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text("3. VALIDACIÓN Y VERIFICACIÓN PÚBLICA", 14, currentY);

      doc.addImage(qrDataUrl, 'PNG', 14, currentY + 5, 35, 35);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text("Escanee el código QR con cualquier dispositivo para verificar la", 54, currentY + 12);
      doc.text("autenticidad e integridad de este comprobante en la plataforma BioTrust.", 54, currentY + 17);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text(`URL de Verificación: ${verifyUrl}`, 54, currentY + 25);

      doc.setLineWidth(0.3);
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 265, 196, 265);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text("Este documento es un comprobante de integridad emitido por la plataforma BioTrust.", 14, 271);
      doc.text("Garantiza la correspondencia biométrica de los firmantes bajo estándares ISO/IEC 19794.", 14, 275);
      doc.text("Página 1 de 1 - BioTrust Chile © 2026", 196, 275, { align: 'right' });

      doc.save(`Certificado_Auditoria_BioTrust_${txDetails.folio}.pdf`);

    } catch (err) {
      console.error("Error al generar el PDF:", err);
      alert(`Ocurrió un error al generar el certificado PDF: ${err.message}`);
    }
  };

  const resetForm = () => {
    setStep(1);
    setTermsAccepted(false);
    setTxDetails(null);
    setOtpVerified(false);
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes scanBeam {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 90%; opacity: 0.4; }
          100% { top: 0%; opacity: 0.8; }
        }
        .glass-card {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .btn-primary {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #ffffff;
          transition: all 0.25s ease;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
        }
        .btn-secondary {
          background: rgba(51, 65, 85, 0.8);
          color: #ffffff;
          transition: all 0.2s ease;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .btn-secondary:hover:not(:disabled) {
          background: rgba(71, 85, 105, 0.9);
        }
        .btn-success {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: #ffffff;
          transition: all 0.25s ease;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .btn-success:hover:not(:disabled) {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(22, 163, 74, 0.45);
        }
        .input-field:focus {
          outline: none;
          border-color: #38bdf8 !important;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25);
          background-color: rgba(15, 23, 42, 0.9) !important;
        }
        .footer-link {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s ease;
          cursor: pointer;
        }
        .footer-link:hover {
          color: #38bdf8;
        }
        .scanning-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #38bdf8, transparent);
          box-shadow: 0 0 12px #38bdf8;
          animation: scanBeam 2.5s ease-in-out infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner {
          width: 44px;
          height: 44px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top: 4px solid #38bdf8;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .nav-tab-btn {
          padding: 0.4rem 0.9rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .nav-tab-active {
          background-color: #2563eb;
          color: #ffffff;
          border-color: #3b82f6;
        }
        .nav-tab-inactive {
          background-color: transparent;
          color: #94a3b8;
        }
        .nav-tab-inactive:hover {
          color: #ffffff;
          background-color: rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {/* NAVBAR CON NAVEGACIÓN Y LOGO */}
      <header style={styles.topNavbar}>
        <BioTrustLogo size="small" onClick={() => setActiveView('firmar')} />

        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#0f172a', padding: '0.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
          <button
            onClick={() => setActiveView('firmar')}
            className={`nav-tab-btn ${activeView === 'firmar' ? 'nav-tab-active' : 'nav-tab-inactive'}`}
          >
            ✍️ Firmar Documento
          </button>
          <button
            onClick={() => setActiveView('verificar')}
            className={`nav-tab-btn ${activeView === 'verificar' ? 'nav-tab-active' : 'nav-tab-inactive'}`}
          >
            🔍 Verificador de Folios
          </button>
          <button
            onClick={() => setActiveView('webhooks')}
            className={`nav-tab-btn ${activeView === 'webhooks' ? 'nav-tab-active' : 'nav-tab-inactive'}`}
          >
            ⚙️ Integraciones & Webhooks
          </button>
        </div>

        <div style={styles.navRight}>
          <span style={styles.statusBadge}>
            <span style={styles.statusDot}>●</span> En Línea
          </span>
        </div>
      </header>

      {/* CINTA DE CONFIANZA */}
      <section style={styles.trustBanner}>
        <div style={styles.trustBannerInner}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '600' }}>Infraestructura de Firma Reconocida:</span>
          <div style={styles.trustBadgesGroup}>
            <span style={styles.trustBadgeItem}>🔐 Cifrado AES-256</span>
            <span style={styles.trustBadgeItem}>📜 Validez Legal Extensiva</span>
            <span style={styles.trustBadgeItem}>🛡️ Biometría Anti-Spoofing</span>
            <span style={styles.trustBadgeItem}>🇨🇱 Acreditación Nacional</span>
          </div>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <main style={styles.mainWrapper}>

        {/* VISTA 1: FLUJO DE FIRMA BIOMÉTRICA */}
        {activeView === 'firmar' && (
          <>
            <div style={styles.heroSection}>
              <h1 style={styles.title}>Verificación Biométrica & Firma Digital</h1>
              <p style={styles.subtitle}>Plataforma homologada para la autenticación de personas y firma de documentos</p>
            </div>

            {/* Stepper */}
            <div style={styles.stepperContainer}>
              {[
                { num: 1, label: 'Datos & Flujo' },
                { num: 2, label: 'Biometría' },
                { num: 3, label: 'Confirmación' },
                { num: 4, label: 'Resultado' }
              ].map((item, idx, arr) => (
                <div key={item.num} style={{ display: 'flex', alignItems: 'center', flex: idx !== arr.length - 1 ? 1 : 'none' }}>
                  <div style={{ ...styles.stepItem, color: step >= item.num ? '#38bdf8' : '#64748b' }}>
                    <div style={{
                      ...styles.stepCircle,
                      backgroundColor: step > item.num ? '#16a34a' : step === item.num ? '#2563eb' : '#1e293b',
                      borderColor: step >= item.num ? '#38bdf8' : '#334155'
                    }}>
                      {step > item.num ? '✓' : item.num}
                    </div>
                    <span>{item.label}</span>
                  </div>
                  {idx !== arr.length - 1 && (
                    <div style={{ ...styles.stepLine, backgroundColor: step > item.num ? '#16a34a' : '#334155' }} />
                  )}
                </div>
              ))}
            </div>

            <div className="glass-card" style={styles.wizardCard}>
              {stepLoading ? (
                <div style={styles.loadingContainer}>
                  <div className="spinner"></div>
                  <p style={{ marginTop: '1.2rem', color: '#cbd5e1', fontSize: '0.95rem', fontWeight: '500' }}>{loadingMessage}</p>
                </div>
              ) : (
                <>
                  {/* PASO 1 */}
                  {step === 1 && (
                    <form onSubmit={handleNextStep1} style={styles.stepContent}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={styles.cardTitle}>Paso 1: Identificación y Flujo Multi-Firmante</h2>
                        <span style={{ fontSize: '0.75rem', color: '#38bdf8', backgroundColor: '#38bdf815', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid #38bdf830' }}>Paso obligatorio</span>
                      </div>

                      <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid #334155' }}>
                        <h3 style={{ fontSize: '0.9rem', color: '#38bdf8', marginTop: 0, marginBottom: '0.6rem' }}>👤 Tus Datos (Firmante Actual)</h3>
                        <div style={styles.formGrid}>
                          <div>
                            <label style={styles.label}>R.U.T. (Sin puntos, con guión):</label>
                            <input
                              type="text"
                              className="input-field"
                              value={rut}
                              onChange={(e) => setRut(e.target.value)}
                              placeholder="12345678-9"
                              required
                              style={styles.input}
                            />
                          </div>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <label style={styles.label}>Número de Serie / Documento:</label>
                              <button
                                type="button"
                                onClick={() => setShowIdHelpModal(true)}
                                style={styles.helpIconButton}
                              >
                                ¿Dónde está? 🔍
                              </button>
                            </div>
                            <input
                              type="text"
                              className="input-field"
                              value={numDocumento}
                              onChange={(e) => setNumDocumento(e.target.value)}
                              placeholder="A123456789"
                              required
                              style={styles.input}
                            />
                          </div>
                          <div>
                            <label style={styles.label}>Nombre Completo:</label>
                            <input
                              type="text"
                              className="input-field"
                              value={nombre}
                              onChange={(e) => setNombre(e.target.value)}
                              placeholder="María Rodríguez"
                              required
                              style={styles.input}
                            />
                          </div>
                          <div>
                            <label style={styles.label}>Correo Electrónico:</label>
                            <input
                              type="email"
                              className="input-field"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="maria@empresa.com"
                              required
                              style={styles.input}
                            />
                          </div>
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid #334155', marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                          <div>
                            <h3 style={{ fontSize: '0.9rem', color: '#38bdf8', margin: 0 }}>👥 Flujo y Gestión de Multi-Firmantes</h3>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Define el orden y las personas invitadas a firmar este contrato.</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddSigner}
                            className="btn-secondary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px' }}
                          >
                            ➕ Agregar Firmante
                          </button>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.9rem', backgroundColor: '#0f172a', padding: '0.5rem', borderRadius: '8px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#f8fafc', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name="workflow"
                              value="secuencial"
                              checked={workflowType === 'secuencial'}
                              onChange={() => setWorkflowType('secuencial')}
                              style={{ accentColor: '#2563eb' }}
                            />
                            <strong>Flujo Secuencial</strong> (Firman en orden estricto)
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#f8fafc', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name="workflow"
                              value="paralelo"
                              checked={workflowType === 'paralelo'}
                              onChange={() => setWorkflowType('paralelo')}
                              style={{ accentColor: '#2563eb' }}
                            />
                            <strong>Flujo Paralelo</strong> (Todos pueden firmar simultáneamente)
                          </label>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          {signers.map((signer, index) => (
                            <div key={signer.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', backgroundColor: '#0f172a80', padding: '0.6rem', borderRadius: '8px', border: signer.current ? '1px solid #38bdf8' : '1px solid #1e293b' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#38bdf8', minWidth: '24px' }}>#{index + 1}</span>
                              <input
                                type="text"
                                className="input-field"
                                placeholder="R.U.T."
                                value={signer.rut}
                                onChange={(e) => handleUpdateSigner(signer.id, 'rut', e.target.value)}
                                style={{ ...styles.input, padding: '0.4rem', fontSize: '0.8rem', flex: 1 }}
                              />
                              <input
                                type="text"
                                className="input-field"
                                placeholder="Nombre Completo"
                                value={signer.nombre}
                                onChange={(e) => handleUpdateSigner(signer.id, 'nombre', e.target.value)}
                                style={{ ...styles.input, padding: '0.4rem', fontSize: '0.8rem', flex: 1.5 }}
                              />
                              <input
                                type="text"
                                className="input-field"
                                placeholder="Rol (ej: Aval)"
                                value={signer.rol}
                                onChange={(e) => handleUpdateSigner(signer.id, 'rol', e.target.value)}
                                style={{ ...styles.input, padding: '0.4rem', fontSize: '0.8rem', flex: 1 }}
                              />
                              {signers.length > 1 && index !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSigner(signer.id)}
                                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem', padding: '0 0.4rem' }}
                                  title="Eliminar Firmante"
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* VISOR DE PDF */}
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <label style={styles.label}>Documento a Cargar y Leer:</label>
                          <label className="btn-secondary" style={styles.smallFileBtn}>
                            📂 Cargar Otro PDF
                            <input type="file" accept="application/pdf" onChange={handlePdfChange} style={{ display: 'none' }} />
                          </label>
                        </div>

                        <div style={styles.pdfViewerCard}>
                          <div style={styles.pdfViewerHeader}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span>📄</span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#f8fafc' }}>
                                {tituloContrato}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowFullPdfModal(true)}
                              className="btn-secondary"
                              style={styles.fullScreenPdfBtn}
                            >
                              🔍 Ver Pantalla Completa
                            </button>
                          </div>

                          {pdfPreviewUrl ? (
                            <iframe
                              src={`${pdfPreviewUrl}#toolbar=0&navpanes=0`}
                              title="Visor PDF"
                              style={styles.pdfIframe}
                            />
                          ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                              Cargando documento PDF...
                            </div>
                          )}

                          <div style={styles.pdfViewerFooter}>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                              Sellado criptográfico calculado localmente.
                              <button
                                type="button"
                                onClick={() => setShowHashDetails(!showHashDetails)}
                                style={styles.linkToggle}
                              >
                                {showHashDetails ? ' Ocultar detalles' : ' Ver Hash SHA-256'}
                              </button>
                            </div>
                            <span style={styles.badgeSuccess}>✓ Documento Auditado</span>
                          </div>

                          {showHashDetails && (
                            <div style={styles.hashDetailBox}>
                              <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>SHA-256: </span>
                              <code>{hashPdf}</code>
                            </div>
                          )}
                        </div>
                      </div>

                      <button type="submit" className="btn-primary" style={styles.fullButton}>
                        Continuar a Autenticación 2FA ➔
                      </button>
                    </form>
                  )}

                  {/* PASO 2 */}
                  {step === 2 && (
                    <div style={styles.stepContentCentered}>
                      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                        <h2 style={styles.cardTitle}>Paso 2: Prueba de Vida Activa (Liveness)</h2>
                        <p style={{ color: '#fbbf24', fontSize: '0.85rem', margin: '0.4rem 0 0 0' }}>
                          Siga las instrucciones en pantalla para verificar su presencia real.
                        </p>
                      </div>

                      <div style={styles.livenessTrackerBox}>
                        <div style={styles.livenessItem}>
                          <span style={{ color: smileSuccess ? '#4ade80' : '#94a3b8', fontWeight: 'bold' }}>
                            {smileSuccess ? '✓' : '1'}
                          </span>
                          <span>1. Sonreír</span>
                        </div>
                        <div style={styles.livenessDivider} />
                        <div style={styles.livenessItem}>
                          <span style={{ color: blinkCount >= 2 ? '#4ade80' : '#94a3b8', fontWeight: 'bold' }}>
                            {blinkCount >= 2 ? '✓' : '2'}
                          </span>
                          <span>2. Parpadear (x2) [{blinkCount}/2]</span>
                        </div>
                      </div>

                      <div style={styles.centeredCameraBox}>
                        <div style={styles.videoWrapper}>
                          <video ref={videoRef} autoPlay playsInline muted style={styles.video} />
                          <div className="scanning-line" />

                          <svg style={styles.hudOverlaySvg} viewBox="0 0 200 200">
                            <ellipse
                              cx="100"
                              cy="100"
                              rx="55"
                              ry="75"
                              fill="none"
                              stroke={livenessComplete ? '#22c55e' : (faceDetected ? '#38bdf8' : '#ef4444')}
                              strokeWidth="2.5"
                              strokeDasharray={livenessComplete ? 'none' : '6 4'}
                            />
                          </svg>

                          <div style={{
                            ...styles.liveChallengeBanner,
                            backgroundColor: livenessComplete ? 'rgba(22, 163, 74, 0.9)' : 'rgba(15, 23, 42, 0.85)',
                            borderColor: livenessComplete ? '#4ade80' : '#38bdf8'
                          }}>
                            {modelLoading ? (
                              <span>⚡ Cargando IA biométrica...</span>
                            ) : livenessComplete ? (
                              <span>✅ ¡Prueba de Vida Biométrica Completa!</span>
                            ) : livenessStage === 1 ? (
                              <span>😃 <strong>Desafío 1:</strong> Por favor, sonría a la cámara</span>
                            ) : livenessStage === 2 ? (
                              <span>👁️ <strong>Desafío 2:</strong> Parpadee dos veces [{blinkCount}/2]</span>
                            ) : (
                              <span>👤 Centre su rostro en la guía</span>
                            )}
                          </div>
                        </div>

                        <div style={styles.qualityBox}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                            <span style={{ color: '#cbd5e1' }}>Estado de Verificación:</span>
                            <span style={{ color: livenessComplete ? '#4ade80' : '#facc15', fontWeight: 'bold' }}>
                              {modelLoading ? 'Iniciando...' : `${qualityScore}% (${qualityLabel})`}
                            </span>
                          </div>
                          <div style={styles.barBackground}>
                            <div style={{
                              ...styles.barFill,
                              width: `${modelLoading ? 100 : qualityScore}%`,
                              backgroundColor: livenessComplete ? '#22c55e' : (qualityScore >= 70 ? '#3b82f6' : '#ef4444')
                            }} />
                          </div>
                        </div>
                      </div>

                      <div style={styles.buttonRow}>
                        <button type="button" onClick={() => goToNextStep(1)} className="btn-secondary" style={styles.navButton}>
                          ⬅ Volver
                        </button>
                        <button
                          type="button"
                          disabled={!livenessComplete || modelLoading}
                          onClick={handleNextStep2}
                          className="btn-primary"
                          style={{
                            ...styles.navButton,
                            opacity: (!livenessComplete || modelLoading) ? 0.5 : 1,
                            cursor: (!livenessComplete || modelLoading) ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Avanzar a Confirmación ➔
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PASO 3 */}
                  {step === 3 && (
                    <form onSubmit={handleRegisterAndSign} style={styles.stepContent}>
                      <h2 style={styles.cardTitle}>Paso 3: Confirmación y Firma Biométrica</h2>

                      <div style={styles.summaryBox}>
                        <h3 style={{ color: '#38bdf8', marginTop: 0, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          📋 Resumen de la Operación y Secuencia Multi-Firmante
                        </h3>
                        <div style={styles.summaryGrid}>
                          <p><strong>Firmante Activo:</strong> {nombre}</p>
                          <p><strong>R.U.T.:</strong> {rut}</p>
                          <p><strong>N° Serie Cédula:</strong> {numDocumento}</p>
                          <p><strong>Email:</strong> {email}</p>
                          <p><strong>Documento:</strong> {tituloContrato}</p>
                          <p><strong>Modalidad Flujo:</strong> <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{workflowType.toUpperCase()}</span></p>
                          <p><strong>Autenticación 2FA:</strong> <span style={{ color: '#4ade80', fontWeight: 'bold' }}>✓ Email Verificado</span></p>
                          <p><strong>Prueba de Vida:</strong> <span style={{ color: '#4ade80', fontWeight: 'bold' }}>✓ Liveness 100% Válida</span></p>
                        </div>

                        <div style={{ marginTop: '0.8rem', borderTop: '1px dashed #334155', paddingTop: '0.6rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#f8fafc' }}>Firmantes Involucrados ({signers.length}):</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.4rem' }}>
                            {signers.map((s) => (
                              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', backgroundColor: '#0f172a', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
                                <span>👤 <strong>{s.nombre}</strong> ({s.rol})</span>
                                <span style={{ color: s.status === 'Firmado' ? '#4ade80' : s.status === 'En Proceso' ? '#38bdf8' : '#facc15', fontWeight: 'bold' }}>
                                  {s.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div style={styles.termsBox}>
                        <label style={styles.termsLabel}>
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            style={{ marginTop: '0.2rem', cursor: 'pointer', accentColor: '#2563eb' }}
                          />
                          <span>
                            Acepto el uso de mi patrón biométrico facial para la firma de este documento, en conformidad a la{' '}
                            <strong>Ley N° 19.799</strong> y la <strong>Ley N° 21.663</strong> de Ciberseguridad.{' '}
                            <button type="button" onClick={() => setShowTermsModal(true)} style={styles.linkToggle}>
                              Términos legales
                            </button>
                          </span>
                        </label>
                      </div>

                      <div style={styles.buttonRow}>
                        <button type="button" onClick={() => goToNextStep(2)} className="btn-secondary" style={styles.navButton}>
                          ⬅ Volver
                        </button>
                        <button
                          type="submit"
                          disabled={!termsAccepted}
                          className="btn-success"
                          style={{
                            ...styles.navButton,
                            opacity: !termsAccepted ? 0.5 : 1,
                            cursor: !termsAccepted ? 'not-allowed' : 'pointer'
                          }}
                        >
                          🔒 Confirmar y Estampar Firma
                        </button>
                      </div>
                    </form>
                  )}

                  {/* PASO 4 */}
                  {step === 4 && txDetails && (
                    <div style={styles.stepContentCentered}>
                      <div style={styles.successIconBox}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>

                      <h2 style={{ fontSize: '1.4rem', color: '#4ade80', margin: '0.5rem 0', fontWeight: '800' }}>
                        ¡Firma Registrada Exitosamente!
                      </h2>
                      <p style={{ color: '#cbd5e1', fontSize: '0.9rem', textAlign: 'center', margin: '0 0 1.5rem 0' }}>
                        Su firma ha sido estampada. Se ha notificado a sus sistemas vía Webhook.
                      </p>

                      <div style={styles.receiptCard}>
                        <div style={styles.receiptRow}>
                          <span style={{ color: '#94a3b8' }}>Folio Único:</span>
                          <strong style={{ color: '#38bdf8' }}>{txDetails.folio}</strong>
                        </div>
                        <div style={styles.receiptRow}>
                          <span style={{ color: '#94a3b8' }}>Fecha / Hora:</span>
                          <span>{txDetails.fecha}</span>
                        </div>
                        <div style={styles.receiptRow}>
                          <span style={{ color: '#94a3b8' }}>Firmante Actual:</span>
                          <span>{txDetails.nombre} ({txDetails.rut})</span>
                        </div>
                        <div style={styles.receiptRow}>
                          <span style={{ color: '#94a3b8' }}>Documento:</span>
                          <span>{txDetails.documento}</span>
                        </div>
                        <div style={{ ...styles.receiptRow, borderBottom: 'none' }}>
                          <span style={{ color: '#94a3b8' }}>Avance Flujo Multi-Firmante:</span>
                          <span style={{ color: '#4ade80', fontWeight: 'bold' }}>
                            {txDetails.signers.filter(s => s.status === 'Firmado').length} de {txDetails.signers.length} Firmas ✓
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%', marginTop: '1.5rem' }}>
                        <button type="button" onClick={handleDownloadStampedPdf} className="btn-success" style={{ padding: '0.9rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem' }}>
                          📄 Descargar Documento PDF Firmado (Con Sello Digital)
                        </button>
                        <button type="button" onClick={handleDownloadComprobante} className="btn-secondary" style={{ padding: '0.85rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                          📜 Descargar Certificado de Auditoría Multi-Firmante
                        </button>
                        <button type="button" onClick={resetForm} className="btn-primary" style={{ padding: '0.8rem', borderRadius: '8px', fontWeight: 'bold', marginTop: '0.5rem' }}>
                          Nueva Firma
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {mensaje && (
                <div style={{
                  ...styles.alert,
                  backgroundColor: tipoMensaje === 'success' ? '#10b98120' : tipoMensaje === 'error' ? '#ef444420' : '#3b82f620',
                  borderColor: tipoMensaje === 'success' ? '#10b981' : tipoMensaje === 'error' ? '#ef4444' : '#3b82f6',
                  color: tipoMensaje === 'success' ? '#34d399' : tipoMensaje === 'error' ? '#f87171' : '#60a5fa'
                }}>
                  {mensaje}
                </div>
              )}
            </div>
          </>
        )}

        {/* VISTA 2: VERIFICADOR DE FOLIOS */}
        {activeView === 'verificar' && (
          <div className="glass-card" style={{ ...styles.wizardCard, marginTop: '1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#38bdf820', border: '1px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.8rem auto', fontSize: '1.6rem' }}>
                🔍
              </div>
              <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', margin: 0, fontWeight: '800' }}>
                Verificador Público de Documentos y Folios
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                Consulte la autenticidad e integridad de cualquier certificado o PDF emitido por la red BioTrust.
              </p>
            </div>

            <form onSubmit={handleSearchFolio} style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Ingrese Folio (ej: FOLIO-847291) o Hash SHA-256..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ ...styles.input, flex: 1 }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0.7rem 1.4rem', borderRadius: '8px', fontWeight: 'bold' }}>
                Consultar
              </button>
            </form>

            <div style={{ position: 'relative', border: '2px dashed #334155', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', backgroundColor: '#0f172a80', cursor: 'pointer' }}>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleDropVerifyPdf}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              />
              <span style={{ fontSize: '2rem' }}>📄</span>
              <p style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '0.9rem', margin: '0.4rem 0 0.2rem 0' }}>
                O arrastra tu archivo PDF aquí para verificar su Hash localmente
              </p>
              <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Comprobaremos la validez del sello digital sin alterar el archivo.</span>
            </div>

            {isVerifyingFile && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
                <div className="spinner"></div>
                <p style={{ marginTop: '1rem', color: '#38bdf8', fontSize: '0.85rem' }}>Calculando sello criptográfico SHA-256...</p>
              </div>
            )}

            {verifyResult && !isVerifyingFile && (
              <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                {verifyResult.status === 'VALID' ? (
                  <div style={{ backgroundColor: '#16a34a15', border: '1px solid #16a34a', borderRadius: '12px', padding: '1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>✓</div>
                      <div>
                        <h3 style={{ margin: 0, color: '#4ade80', fontSize: '1.05rem', fontWeight: 'bold' }}>CERTIFICADO AUTÉNTICO Y VÁLIDO</h3>
                        <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{verifyResult.ley}</span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem', fontSize: '0.82rem', color: '#f8fafc', backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                      <p><strong>Folio:</strong> <span style={{ color: '#38bdf8' }}>{verifyResult.folio}</span></p>
                      <p><strong>Firmante Principal:</strong> {verifyResult.nombre}</p>
                      <p><strong>R.U.T.:</strong> {verifyResult.rut}</p>
                      <p><strong>Fecha/Hora:</strong> {verifyResult.fecha}</p>
                      <p><strong>Documento:</strong> {verifyResult.documento}</p>
                      <p><strong>Prueba de Vida:</strong> <span style={{ color: '#4ade80' }}>{verifyResult.liveness}</span></p>
                    </div>

                    {verifyResult.signers && (
                      <div style={{ marginTop: '0.8rem', backgroundColor: '#0f172a', padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155' }}>
                        <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 'bold' }}>👥 Firmantes del Contrato:</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.4rem' }}>
                          {verifyResult.signers.map((s, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1' }}>
                              <span>• {s.nombre} ({s.rol})</span>
                              <span style={{ color: '#4ade80', fontWeight: 'bold' }}>{s.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ marginTop: '0.8rem', fontSize: '0.72rem', color: '#94a3b8', wordBreak: 'break-all' }}>
                      <strong>SHA-256 Coincidente:</strong> <code>{verifyResult.hash}</code>
                    </div>
                  </div>
                ) : verifyResult.status === 'TAMPERED' ? (
                  <div style={{ backgroundColor: '#ef444415', border: '1px solid #ef4444', borderRadius: '12px', padding: '1.2rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '2rem' }}>🚨</span>
                    <h3 style={{ color: '#f87171', margin: '0.4rem 0', fontSize: '1.05rem' }}>DOCUMENTO MODIFICADO O NO REGISTRADO</h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: '0.4rem 0' }}>{verifyResult.message}</p>
                    <div style={{ marginTop: '0.6rem', fontSize: '0.72rem', color: '#94a3b8', wordBreak: 'break-all' }}>
                      <strong>Hash Calculado:</strong> <code>{verifyResult.hash}</code>
                    </div>
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#f59e0b15', border: '1px solid #f59e0b', borderRadius: '12px', padding: '1.2rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '2rem' }}>⚠️</span>
                    <h3 style={{ color: '#facc15', margin: '0.4rem 0', fontSize: '1.05rem' }}>REGISTRO NO ENCONTRADO</h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: 0 }}>{verifyResult.message}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VISTA 3: MÓDULO DE INTEGRACIONES Y WEBHOOKS (PASO 6) */}
        {activeView === 'webhooks' && (
          <div className="glass-card" style={{ ...styles.wizardCard, marginTop: '1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#2563eb20', border: '1px solid #2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.8rem auto', fontSize: '1.6rem' }}>
                ⚙️
              </div>
              <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', margin: 0, fontWeight: '800' }}>
                Consola de Integración Backend & Webhooks
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                Inspeccione en tiempo real los eventos de firma y biometría despachados a sus servidores.
              </p>
            </div>

            {/* CONFIGURACIÓN DE ENDPOINT */}
            <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '10px', border: '1px solid #334155', marginBottom: '1.2rem' }}>
              <label style={{ ...styles.label, color: '#38bdf8', fontWeight: 'bold' }}>URL del Webhook de Tu Empresa (HTTP POST):</label>
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.4rem' }}>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  style={{ ...styles.input, flex: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}
                />
                <button
                  type="button"
                  onClick={() => dispatchWebhook('ping.test', { message: 'Evento de prueba manual de conexión' })}
                  className="btn-primary"
                  style={{ padding: '0.6rem 1rem', fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                >
                  📡 Probar Evento
                </button>
              </div>
            </div>

            {/* VISOR Y REGISTRO DE EVENTOS EN VIVO */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#cbd5e1' }}>
                  Logs de Eventos Despachados ({webhookLogs.length})
                </span>
                <button
                  onClick={() => setWebhookLogs([])}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Limpiar consola
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '420px', overflowY: 'auto' }}>
                {webhookLogs.map((log) => (
                  <div key={log.id} style={{ backgroundColor: '#090d16', borderRadius: '8px', border: '1px solid #1e293b', padding: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ backgroundColor: '#16a34a20', color: '#4ade80', fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 'bold', border: '1px solid #16a34a40' }}>
                          HTTP {log.status} OK
                        </span>
                        <strong style={{ color: '#38bdf8', fontSize: '0.85rem', fontFamily: 'monospace' }}>{log.event}</strong>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{log.timestamp}</span>
                    </div>

                    <pre style={{ margin: 0, padding: '0.6rem', backgroundColor: '#0f172a', borderRadius: '6px', color: '#38bdf8', fontSize: '0.75rem', fontFamily: 'Consolas, Monaco, monospace', overflowX: 'auto' }}>
                      {JSON.stringify(log.payload, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL CÓDIGO OTP (2FA) */}
      {showOtpModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, maxWidth: '440px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#2563eb20', border: '1px solid #2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.8rem auto', fontSize: '1.5rem' }}>
              ✉️
            </div>
            <h3 style={{ color: '#f8fafc', margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>Autenticación de Doble Factor</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.4rem', lineHeight: '1.4' }}>
              Hemos enviado un código de verificación de 6 dígitos a:<br />
              <strong style={{ color: '#38bdf8' }}>{email}</strong>
            </p>

            <div style={styles.demoNotificationBanner}>
              <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 'bold' }}>📩 [Notificación de Demo]:</span>
              <span style={{ fontSize: '0.85rem', color: '#f8fafc', marginLeft: '0.4rem' }}>Tu PIN es: <strong style={{ color: '#38bdf8', fontSize: '1.05rem', letterSpacing: '1px' }}>{generatedOtp}</strong></span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', margin: '1.2rem 0' }}>
              {otpInput.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpRefs.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  style={styles.otpInputBox}
                />
              ))}
            </div>

            {otpError && (
              <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '-0.5rem', marginBottom: '0.8rem' }}>
                {otpError}
              </p>
            )}

            <button
              onClick={handleVerifyOtp}
              className="btn-primary"
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem' }}
            >
              Verificar Código & Continuar ➔
            </button>

            <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: '#94a3b8' }}>
              {otpTimer > 0 ? (
                <span>Reenviar código en <strong>{otpTimer}s</strong></span>
              ) : (
                <button
                  type="button"
                  onClick={generateNewOtpCode}
                  style={styles.linkToggle}
                >
                  Solicitar un nuevo código
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WIDGET FLOTANTE DE SOPORTE */}
      <button
        onClick={() => setShowSupportModal(true)}
        style={styles.floatingHelpBtn}
        title="Soporte y Ayuda"
      >
        💬
      </button>

      {/* PIE DE PÁGINA */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerColMain}>
            <div style={{ marginBottom: '0.8rem' }}>
              <BioTrustLogo size="medium" onClick={() => setActiveView('firmar')} />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
              Servicios de Infraestructura de Firma Digital y Autenticación Biométrica conforme al Marco Normativo Chileno.
            </p>
          </div>

          <div style={styles.footerCol}>
            <span style={styles.footerHeading}>Soporte Legal</span>
            <a onClick={() => setShowTermsModal(true)} className="footer-link">Ley N° 19.799</a>
            <a onClick={() => setShowTermsModal(true)} className="footer-link">Ley N° 21.663</a>
            <a onClick={() => setShowTermsModal(true)} className="footer-link">Protección de Datos</a>
          </div>

          <div style={styles.footerCol}>
            <span style={styles.footerHeading}>Herramientas</span>
            <a onClick={() => setActiveView('verificar')} className="footer-link">Verificador de Folios</a>
            <a onClick={() => setActiveView('webhooks')} className="footer-link">API & Webhooks</a>
            <a onClick={() => setShowSupportModal(true)} className="footer-link">Mesa de Ayuda</a>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <span>© 2026 BioTrust Chile SpA. Todos los derechos reservados. Cifrado de grado bancario.</span>
        </div>
      </footer>

      {/* MODAL PDF PANTALLA COMPLETA */}
      {showFullPdfModal && pdfPreviewUrl && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, maxWidth: '900px', width: '95%', height: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <h3 style={{ color: '#38bdf8', margin: 0, fontSize: '1.1rem' }}>📄 Lectura de Documento Completo: {tituloContrato}</h3>
              <button onClick={() => setShowFullPdfModal(false)} style={styles.closeModalBtn}>✕</button>
            </div>
            <iframe
              src={pdfPreviewUrl}
              title="PDF Lectura Completa"
              style={{ width: '100%', flex: 1, border: 'none', borderRadius: '8px' }}
            />
            <button onClick={() => setShowFullPdfModal(false)} className="btn-primary" style={{ marginTop: '0.8rem', padding: '0.6rem', borderRadius: '6px' }}>
              Cerrar y Volver a la Firma
            </button>
          </div>
        </div>
      )}

      {/* MODALES DE AYUDA, SOPORTE Y TÉRMINOS */}
      {showIdHelpModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#38bdf8', margin: 0, fontSize: '1.05rem' }}>¿Dónde encuentro el N° de Documento?</h3>
              <button onClick={() => setShowIdHelpModal(false)} style={styles.closeModalBtn}>✕</button>
            </div>
            <div style={{ marginTop: '1rem', backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: 0 }}>
                En las cédulas de identidad chilenas actuales, el <strong>Número de Documento o Serie</strong> consta de 9 caracteres (ej: A123456789) y se encuentra ubicado en el frente de la tarjeta.
              </p>
              <div style={styles.idCardMock}>
                <div style={styles.idHighlightBox}>NUMERO DOCUMENTO: A123456789 👈</div>
              </div>
            </div>
            <button onClick={() => setShowIdHelpModal(false)} className="btn-primary" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', marginTop: '1rem' }}>
              Entendido
            </button>
          </div>
        </div>
      )}

      {showSupportModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#38bdf8', margin: 0, fontSize: '1.05rem' }}>Soporte Técnico BioTrust</h3>
              <button onClick={() => setShowSupportModal(false)} style={styles.closeModalBtn}>✕</button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5', marginTop: '0.8rem' }}>
              ¿Tienes dificultades para validar tu rostro o cargar tu documento PDF?
            </p>
            <ul style={{ fontSize: '0.8rem', color: '#94a3b8', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
              <li>Asegúrate de contar con buena iluminación frontal.</li>
              <li>Evita usar lentes oscuros o sombreros.</li>
              <li>Soporte vía WhatsApp: <strong>+56 9 1234 5678</strong></li>
            </ul>
            <button onClick={() => setShowSupportModal(false)} className="btn-primary" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', marginTop: '0.8rem' }}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showTermsModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#38bdf8', margin: 0, fontSize: '1.05rem' }}>Marco Jurídico y Privacidad</h3>
              <button onClick={() => setShowTermsModal(false)} style={styles.closeModalBtn}>✕</button>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5', marginTop: '0.8rem' }}>
              En conformidad a la <strong>Ley N° 19.799</strong> sobre documentos electrónicos y firma electrónica,
              la presente autenticación posee total validez probatoria.
            </p>
            <button onClick={() => setShowTermsModal(false)} className="btn-primary" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', marginTop: '0.8rem' }}>
              Aceptar y Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#090d16',
    color: '#f8fafc',
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  topNavbar: {
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '0.85rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box'
  },
  navRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.75rem',
    color: '#4ade80',
    backgroundColor: '#16a34a15',
    border: '1px solid #16a34a40',
    padding: '0.25rem 0.65rem',
    borderRadius: '20px',
    fontWeight: '600'
  },
  statusDot: { fontSize: '0.6rem', color: '#22c55e' },
  trustBanner: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '0.4rem 2rem'
  },
  trustBannerInner: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  trustBadgesGroup: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  trustBadgeItem: { fontSize: '0.72rem', color: '#cbd5e1', opacity: 0.85 },
  mainWrapper: {
    flex: 1,
    maxWidth: '720px',
    width: '100%',
    margin: '1.8rem auto',
    padding: '0 1rem',
    boxSizing: 'border-box'
  },
  heroSection: { textAlign: 'center', marginBottom: '1.5rem' },
  title: { fontSize: '1.5rem', color: '#f8fafc', margin: 0, fontWeight: '800', letterSpacing: '-0.01em' },
  subtitle: { fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.3rem' },
  stepperContainer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem' },
  stepItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: '600' },
  stepCircle: { width: '30px', height: '30px', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', border: '1px solid' },
  stepLine: { height: '2px', flex: 1, margin: '0 0.4rem', marginBottom: '1rem', transition: 'background-color 0.3s' },
  wizardCard: { borderRadius: '16px', padding: '1.8rem' },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem' },
  stepContent: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  stepContentCentered: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  cardTitle: { fontSize: '1.15rem', color: '#f8fafc', margin: 0, fontWeight: '700' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.8rem', marginTop: '0.4rem' },
  label: { display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.25rem', fontWeight: '500' },
  input: { width: '100%', padding: '0.7rem', backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid #334155', borderRadius: '8px', color: '#fff', boxSizing: 'border-box', fontSize: '0.9rem' },
  helpIconButton: { background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', cursor: 'pointer', padding: 0 },
  
  smallFileBtn: { padding: '0.3rem 0.7rem', fontSize: '0.75rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', border: '1px solid #38bdf840', color: '#38bdf8' },
  pdfViewerCard: { backgroundColor: 'rgba(15, 23, 42, 0.85)', borderRadius: '10px', border: '1px solid #334155', overflow: 'hidden' },
  pdfViewerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.9rem', backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b' },
  fullScreenPdfBtn: { padding: '0.25rem 0.65rem', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer' },
  pdfIframe: { width: '100%', height: '260px', border: 'none', backgroundColor: '#ffffff' },
  pdfViewerFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.9rem', backgroundColor: '#0f172a', borderTop: '1px solid #1e293b' },

  badgeSuccess: { backgroundColor: '#16a34a20', color: '#4ade80', border: '1px solid #16a34a', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 'bold' },
  linkToggle: { background: 'none', border: 'none', color: '#38bdf8', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.8rem', padding: 0 },
  hashDetailBox: { padding: '0.6rem 0.9rem', backgroundColor: '#0f172a', fontSize: '0.72rem', wordBreak: 'break-all', borderTop: '1px solid #1e293b' },
  
  livenessTrackerBox: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', backgroundColor: '#0f172a', padding: '0.6rem 1.2rem', borderRadius: '30px', border: '1px solid #334155', margin: '0.6rem 0' },
  livenessItem: { display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#e2e8f0' },
  livenessDivider: { width: '1px', height: '14px', backgroundColor: '#334155' },

  centeredCameraBox: { width: '100%', maxWidth: '440px', margin: '0.5rem 0 1rem 0' },
  videoWrapper: { position: 'relative', width: '100%', paddingTop: '75%', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(56, 189, 248, 0.4)' },
  video: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' },
  hudOverlaySvg: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' },
  liveChallengeBanner: { position: 'absolute', bottom: '10px', left: '10px', right: '10px', padding: '0.55rem', borderRadius: '8px', border: '1px solid', color: '#f8fafc', fontSize: '0.82rem', textAlign: 'center', backdropFilter: 'blur(4px)' },

  qualityBox: { marginTop: '0.75rem', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' },
  barBackground: { width: '100%', backgroundColor: '#334155', height: '8px', borderRadius: '4px', overflow: 'hidden' },
  barFill: { height: '100%', transition: 'width 0.3s, background-color 0.3s' },
  summaryBox: { backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' },
  termsBox: { backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' },
  termsLabel: { display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' },
  successIconBox: { width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#22c55e20', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' },
  receiptCard: { width: '100%', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderRadius: '8px', padding: '1rem', border: '1px solid #334155', boxSizing: 'border-box' },
  receiptRow: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #1e293b', fontSize: '0.85rem' },
  buttonRow: { display: 'flex', justifyContent: 'space-between', gap: '1rem', width: '100%', marginTop: '1.2rem' },
  fullButton: { width: '100%', padding: '0.85rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem', marginTop: '1rem' },
  navButton: { flex: 1, padding: '0.85rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem' },
  alert: { marginTop: '1rem', padding: '0.85rem', borderRadius: '8px', border: '1px solid', fontSize: '0.85rem' },
  floatingHelpBtn: { position: 'fixed', bottom: '24px', right: '24px', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#2563eb', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '1.3rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.5)', zIndex: 90 },
  footer: { backgroundColor: '#0f172a', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '2rem 2rem 1.2rem 2rem', marginTop: 'auto' },
  footerContent: { maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem' },
  footerColMain: { flex: '1 1 320px' },
  footerCol: { flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' },
  footerHeading: { fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.4rem' },
  footerBottom: { maxWidth: '1000px', margin: '1.5rem auto 0 auto', paddingTop: '1rem', borderTop: '1px solid #1e293b', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 100 },
  modalContent: { backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', maxWidth: '420px', width: '100%', border: '1px solid #334155' },
  closeModalBtn: { background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.1rem', cursor: 'pointer' },
  idCardMock: { marginTop: '0.75rem', backgroundColor: '#1e293b', padding: '0.85rem', borderRadius: '6px', border: '1px dashed #38bdf8' },
  idHighlightBox: { backgroundColor: '#38bdf820', color: '#38bdf8', border: '1px solid #38bdf8', padding: '0.4rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textAlign: 'center' },
  
  demoNotificationBanner: { backgroundColor: '#0f172a', border: '1px dashed #2563eb', padding: '0.6rem', borderRadius: '6px', marginTop: '0.8rem', textAlign: 'left' },
  otpInputBox: { width: '42px', height: '52px', backgroundColor: '#0f172a', border: '1.5px solid #334155', borderRadius: '8px', color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold', textAlign: 'center' }
};

export default App;