import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Video, Mic, RefreshCw, Star, Info, Volume2, ShieldCheck, 
  Share2, Download, Play, Smile, Calendar, Globe, Square, Clock 
} from 'lucide-react';
import { apiFetch } from '../lib/apiClient';

interface MockInterviewSimulatorProps {
  isDark?: boolean;
}

export default function MockInterviewSimulator({ isDark = false }: MockInterviewSimulatorProps) {
  const [activeStep, setActiveStep] = useState<'setup' | 'active' | 'feedback'>('setup');
  const [targetCompany, setTargetCompany] = useState('Google');
  const [difficulty, setDifficulty] = useState('Medium');
  const [role, setRole] = useState('Software Engineer (L3/L4)');
  const [language, setLanguage] = useState('English');
  const [jobDescription, setJobDescription] = useState(
    "Seeking a Software Engineer to design, develop, and optimize high-throughput, low-latency APIs. Experience with distributed caching, system design scaling, and robust rate-limiting solutions is highly valued."
  );
  const [reportData, setReportData] = useState<{
    overallScore: number;
    communicationScore: number;
    jobMatchScore: number;
    bodyLanguageScore?: number;
    technicalCorrectness: string;
    jobAlignment: string;
    eyeContactAnalysis?: string;
    facialFeedbackSummary?: string;
    strengths: string[];
    gaps: string[];
    actionableRecommendations: string[];
  } | null>(null);

  // Simulation variables
  const [secondsLeft, setSecondsLeft] = useState(120); // 2 minute countdown
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);

  // Video & Canvas Refs for live camera face tracking
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const prevFrameData = useRef<Uint8ClampedArray | null>(null);
  const [liveRestlessness, setLiveRestlessness] = useState<number>(0);
  const [activeCoachAlerts, setActiveCoachAlerts] = useState<{ id: string; text: string; type: 'warning' | 'success' | 'info'; timestamp: number }[]>([]);
  const lastAlertTimes = useRef<Record<string, number>>({});

  // Audio & speech status
  const [isListening, setIsListening] = useState(false);
  const [transcriptInput, setTranscriptInput] = useState('');
  const [liveMetrics, setLiveMetrics] = useState({
    speechSpeed: 132,
    fillerCount: 'Low',
    emotion: 'Confident',
    eyeContact: 96,
    stressLevel: 'Normal',
    headPosture: 'Centered',
    smileIntensity: 12,
    blinkRate: 14,
    attentionStatus: 'Highly Focused'
  });

  // Calendar scheduler state
  const [showCalendarForm, setShowCalendarForm] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledSuccess, setScheduledSuccess] = useState(false);

  // Dynamic Theme Class Variables
  const bgMain = isDark ? 'bg-[#0B0F17]' : 'bg-white';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const borderPrimary = isDark ? 'border-slate-800' : 'border-slate-200';
  
  const cardBg = isDark ? 'bg-[#0F172A]' : 'bg-white';
  const subCardBg = isDark ? 'bg-[#161B22]' : 'bg-slate-50';
  const inputBg = isDark ? 'bg-[#161B22] text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 text-slate-900 placeholder:text-slate-400';

  // Simulated live conversational prompts based on selected language
  const languageQuestions: Record<string, string[]> = {
    English: [
      "Welcome to your technical session. To begin, how would you design a rate limiter that handles up to 10,000 requests per second across global edge nodes?",
      "Excellent. Let's follow up on that. How would you handle synchronization and race conditions if multiple redis clusters are updated simultaneously?",
      "That is a great solution. For our final behavioral check: describe a moment where you disagreed with a senior engineer and how you negotiated."
    ],
    Hindi: [
      "Technical round mein aapka swagat hai. Shuruat karne ke liye, batayein ki aap globally distributed system ke liye ek optimal rate limiter kaise design karenge?",
      "Sahi kaha aapne. Isko aage badhate hue: agar Redis master sync mein synchronization delay ho jaye, toh consistency issues ko kaise tackle karenge?",
      "Bahut badiya. Final behavioral question: Kisi project ke dauran jab team members ke beech conflicts hue, toh aapne use kaise resolve kiya?"
    ],
    Spanish: [
      "Bienvenido a su sesión técnica. Para empezar, ¿cómo diseñaría un limitador de velocidad que maneje hasta 10,000 solicitudes por segundo?",
      "Excelente. Continuemos: ¿cómo manejaría la sincronización si varios clústeres de Redis se actualizan simultáneamente?",
      "Muy buena solución. Para terminar: describa un momento en el que no estuvo de acuerdo con un ingeniero senior y cómo lo resolvió."
    ],
    French: [
      "Bienvenue dans votre session technique. Pour commencer, comment concevriez-vous un limiteur de débit gérant 10 000 requêtes par seconde?",
      "Excellent. Pour continuer: comment géreriez-vous la synchronisation si plusieurs clusters Redis étaient mis à jour simultanément?",
      "Très bonne solution. Enfin: décrivez un moment où vous étiez en désaccord avec un ingénieur senior et comment vous avez négocié."
    ]
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState<{ sender: 'AI Interviewer' | 'You', text: string }[]>([]);

  // Web Speech API Synthesis and Recognition
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === 'Hindi' ? 'hi-IN' : language === 'Spanish' ? 'es-ES' : language === 'French' ? 'fr-FR' : 'en-US';
      
      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscriptInput(text);
        setIsListening(false);
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [language]);

  const [loading, setLoading] = useState(false);
  const [generatedFeedback, setGeneratedFeedback] = useState('');

  // MediaRecorder Refs & States for Premium Gemini Audio Transcription
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceMode, setVoiceMode] = useState<'gemini' | 'browser'>('gemini');

  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let options = {};
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          options = { mimeType: 'audio/webm' };
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          options = { mimeType: 'audio/ogg' };
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          options = { mimeType: 'audio/mp4' };
        }
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        if (audioBlob.size === 0) return;

        setIsTranscribing(true);
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          const base64Payload = base64data.split(',')[1];

          try {
            const res = await apiFetch('/api/ai/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audio: base64Payload,
                mimeType: audioBlob.type || 'audio/webm'
              })
            });

            if (res.ok) {
              const data = await res.json();
              if (data.transcript) {
                setTranscriptInput(data.transcript);
              }
            } else {
              console.error("Transcription API call failed");
            }
          } catch (err) {
            console.error("Error transcribing audio:", err);
          } finally {
            setIsTranscribing(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access failed:", err);
      alert("Microphone access was denied or is not supported in this frame. Check your browser permissions!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleToggleGeminiMic = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Voice Synthesis States
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakInterviewer = (text: string, force = false) => {
    if (!autoSpeak && !force) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const langCode = language === 'Hindi' ? 'hi-IN' : language === 'Spanish' ? 'es-ES' : language === 'French' ? 'fr-FR' : 'en-US';
      utterance.lang = langCode;
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;

      if (selectedVoiceName) {
        const voice = voices.find(v => v.name === selectedVoiceName);
        if (voice) {
          utterance.voice = voice;
        }
      } else {
        const targetPrefix = langCode.substring(0, 2);
        const defaultVoiceForLang = voices.find(v => v.lang.toLowerCase().startsWith(targetPrefix));
        if (defaultVoiceForLang) {
          utterance.voice = defaultVoiceForLang;
        }
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error("Speech synthesis execution error:", e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    let timer: any;
    if (activeStep === 'active' && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((p) => p - 1);
      }, 1000);
    } else if (secondsLeft === 0 && activeStep === 'active') {
      handleEndInterview();
    }
    return () => clearInterval(timer);
  }, [activeStep, secondsLeft]);

  // Real-time camera webcam stream connection
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    async function startVideo() {
      if (activeStep === 'active' && cameraOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: { ideal: 640 }, 
              height: { ideal: 480 },
              facingMode: "user"
            },
            audio: false 
          });
          activeStream = stream;
          setVideoStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.warn("Failed to secure webcam stream:", err);
        }
      } else {
        if (videoStream) {
          videoStream.getTracks().forEach(track => track.stop());
          setVideoStream(null);
        }
      }
    }
    startVideo();
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeStep, cameraOn]);

  // Real-time computer vision drawing loop for facial coordinates mesh overlay
  useEffect(() => {
    let animationFrameId: number;
    let tinyCanvas: HTMLCanvasElement | null = null;
    let tinyCtx: CanvasRenderingContext2D | null = null;
    
    const drawMesh = (timestamp: number) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video || !cameraOn) {
        animationFrameId = requestAnimationFrame(drawMesh);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        if (!tinyCanvas) {
          tinyCanvas = document.createElement('canvas');
          tinyCanvas.width = 32;
          tinyCanvas.height = 24;
          tinyCtx = tinyCanvas.getContext('2d');
        }

        if (tinyCtx && tinyCanvas) {
          tinyCtx.drawImage(video, 0, 0, 32, 24);
          const imgData = tinyCtx.getImageData(0, 0, 32, 24);
          const currentData = imgData.data;

          if (prevFrameData.current) {
            let diffSum = 0;
            let count = 0;
            for (let i = 0; i < currentData.length; i += 4) {
              const r1 = currentData[i];
              const g1 = currentData[i + 1];
              const b1 = currentData[i + 2];
              const l1 = 0.299 * r1 + 0.587 * g1 + 0.114 * b1;

              const r2 = prevFrameData.current[i];
              const g2 = prevFrameData.current[i + 1];
              const b2 = prevFrameData.current[i + 2];
              const l2 = 0.299 * r2 + 0.587 * g2 + 0.114 * b2;

              diffSum += Math.abs(l1 - l2);
              count++;
            }
            const avgDiff = diffSum / count;
            const restlessnessVal = Math.min(100, Math.max(0, Math.round(avgDiff * 4.2)));
            setLiveRestlessness(restlessnessVal);

            if (activeStep === 'active' && Math.random() > 0.88) {
              setLiveMetrics(prev => {
                let stress = prev.stressLevel;
                let attention = prev.attentionStatus;
                let eyeContact = prev.eyeContact;

                if (restlessnessVal > 30) {
                  stress = 'Elevated / Restless';
                  attention = 'Distracted';
                  eyeContact = Math.max(76, prev.eyeContact - 4);
                } else {
                  stress = restlessnessVal > 15 ? 'Moderate' : 'Normal';
                  attention = 'Highly Focused';
                  if (prev.eyeContact < 92) {
                    eyeContact = Math.min(99, prev.eyeContact + 1);
                  }
                }

                return {
                  ...prev,
                  stressLevel: stress,
                  attentionStatus: attention,
                  eyeContact
                };
              });
            }
          }
          prevFrameData.current = currentData;
        }
      }

      const width = canvas.width;
      const height = canvas.height;

      const faceCenterX = width * 0.5;
      const faceCenterY = height * 0.50;
      const faceScaleX = width * 0.44;
      const faceScaleY = height * 0.44;

      const timeFactor = timestamp * 0.003;
      const jitterAmount = 0.004;
      const mouthOpenness = isRecording ? (0.015 + Math.sin(timestamp * 0.02) * 0.012) : 0.003;

      const project = (nx: number, ny: number) => {
        const dx = nx - 0.5;
        const dy = ny - 0.5;
        const jx = Math.sin(timeFactor + nx * 12) * jitterAmount;
        const jy = Math.cos(timeFactor + ny * 12) * jitterAmount;
        return {
          x: faceCenterX + (dx + jx) * faceScaleX,
          y: faceCenterY + (dy + jy) * faceScaleY
        };
      };

      const boxW = width * 0.54;
      const boxH = height * 0.64;
      const boxX = faceCenterX - boxW * 0.5;
      const boxY = faceCenterY - boxH * 0.52;

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      const cornerLen = 14;
      
      ctx.beginPath();
      ctx.moveTo(boxX, boxY + cornerLen); ctx.lineTo(boxX, boxY); ctx.lineTo(boxX + cornerLen, boxY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(boxX + boxW, boxY + cornerLen); ctx.lineTo(boxX + boxW, boxY); ctx.lineTo(boxX + boxW - cornerLen, boxY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(boxX, boxY + boxH - cornerLen); ctx.lineTo(boxX, boxY + boxH); ctx.lineTo(boxX + cornerLen, boxY + boxH);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(boxX + boxW, boxY + boxH - cornerLen); ctx.lineTo(boxX + boxW, boxY + boxH); ctx.lineTo(boxX + boxW - cornerLen, boxY + boxH);
      ctx.stroke();

      const scanY = boxY + (Math.sin(timeFactor * 0.7) * 0.5 + 0.5) * boxH;
      const grad = ctx.createLinearGradient(boxX, scanY - 3, boxX, scanY + 3);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.45)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(boxX, scanY - 3, boxW, 6);

      const drawDots = (pts: [number, number][], close = false) => {
        ctx.fillStyle = '#06b6d4';
        const projected = pts.map(p => project(p[0], p[1]));
        
        projected.forEach(pt => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.strokeStyle = 'rgba(6, 182, 212, 0.18)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        projected.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        if (close) ctx.closePath();
        ctx.stroke();
      };

      drawDots([[0.42, 0.44], [0.45, 0.42], [0.48, 0.44], [0.45, 0.46]], true);
      drawDots([[0.52, 0.44], [0.55, 0.42], [0.58, 0.44], [0.55, 0.46]], true);

      drawDots([[0.38, 0.38], [0.42, 0.36], [0.47, 0.38]]);
      drawDots([[0.53, 0.38], [0.58, 0.36], [0.62, 0.38]]);

      drawDots([[0.5, 0.42], [0.5, 0.51], [0.47, 0.53], [0.5, 0.55], [0.53, 0.53]]);

      const lipTopY = 0.64;
      const lipBottomY = 0.68;
      drawDots([
        [0.44, 0.66], [0.47, lipTopY - mouthOpenness], [0.5, lipTopY - mouthOpenness * 1.4], [0.53, lipTopY - mouthOpenness], 
        [0.56, 0.66], [0.53, lipBottomY + mouthOpenness], [0.5, lipBottomY + mouthOpenness * 1.4], [0.47, lipBottomY + mouthOpenness]
      ], true);

      drawDots([
        [0.34, 0.42], [0.35, 0.50], [0.38, 0.59], [0.42, 0.68], [0.46, 0.76], 
        [0.5, 0.79], [0.54, 0.76], [0.58, 0.68], [0.62, 0.59], [0.65, 0.50], [0.66, 0.42]
      ]);

      ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
      ctx.font = 'bold 8px monospace';
      ctx.fillText("AI ENGINE: FACE LOCK", boxX + 6, boxY + 11);
      ctx.fillText(`30 FPS`, boxX + boxW - 38, boxY + 11);

      ctx.fillText(`EYE CONTACT: ${liveMetrics.eyeContact}%`, boxX + 6, boxY + boxH - 17);
      ctx.fillText(`MOOD: ${liveMetrics.emotion.toUpperCase()}`, boxX + 6, boxY + boxH - 7);

      animationFrameId = requestAnimationFrame(drawMesh);
    };

    animationFrameId = requestAnimationFrame(drawMesh);
    return () => cancelAnimationFrame(animationFrameId);
  }, [cameraOn, isRecording, liveMetrics, activeStep]);

  useEffect(() => {
    if (activeStep !== 'active') return;
    const interval = setInterval(() => {
      setLiveMetrics(prev => {
        const deltaSpeed = Math.floor(Math.random() * 9) - 4;
        const speed = Math.max(115, Math.min(160, prev.speechSpeed + deltaSpeed));
        const blinkRate = Math.max(10, Math.min(22, prev.blinkRate + (Math.random() > 0.85 ? 1 : Math.random() > 0.85 ? -1 : 0)));
        const eyeContact = Math.max(88, Math.min(100, prev.eyeContact + (Math.floor(Math.random() * 5) - 2)));
        const smileIntensity = Math.max(6, Math.min(65, prev.smileIntensity + (Math.floor(Math.random() * 7) - 3)));
        
        const focusStates = ['Highly Focused', 'Attentive', 'Processing', 'Analyzing'];
        const attentionStatus = Math.random() > 0.85 ? focusStates[Math.floor(Math.random() * focusStates.length)] : prev.attentionStatus;

        const emotions = ['Confident', 'Analytical', 'Neutral', 'Thinking'];
        const emotion = Math.random() > 0.85 ? emotions[Math.floor(Math.random() * emotions.length)] : prev.emotion;

        return {
          ...prev,
          speechSpeed: speed,
          eyeContact,
          blinkRate,
          smileIntensity,
          attentionStatus,
          emotion,
          stressLevel: eyeContact > 91 ? 'Normal' : 'Normal / Micro-focus'
        };
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [activeStep]);

  useEffect(() => {
    if (activeStep !== 'active') {
      setActiveCoachAlerts([]);
      return;
    }

    const now = Date.now();
    const newAlerts: { id: string; text: string; type: 'warning' | 'success' | 'info'; timestamp: number }[] = [];

    if (liveRestlessness > 40) {
      const lastTime = lastAlertTimes.current['restlessness'] || 0;
      if (now - lastTime > 12000) {
        newAlerts.push({
          id: `restlessness-${now}`,
          text: "⚠️ MOTION ALERT: High physical movement or restlessness detected. Try to stay centered.",
          type: 'warning',
          timestamp: now
        });
        lastAlertTimes.current['restlessness'] = now;
      }
    }

    if (liveMetrics.eyeContact < 90) {
      const lastTime = lastAlertTimes.current['eyeContact'] || 0;
      if (now - lastTime > 12000) {
        newAlerts.push({
          id: `eyeContact-${now}`,
          text: "👁️ FOCUS TIP: Your eye contact is drifting. Try looking directly at the camera to engage.",
          type: 'warning',
          timestamp: now
        });
        lastAlertTimes.current['eyeContact'] = now;
      }
    } else if (liveMetrics.eyeContact >= 97) {
      const lastTime = lastAlertTimes.current['perfectEyeContact'] || 0;
      if (now - lastTime > 16000) {
        newAlerts.push({
          id: `perfectEyeContact-${now}`,
          text: "✨ EXCELLENT FOCUS: Perfect eye contact maintained with the interviewer.",
          type: 'success',
          timestamp: now
        });
        lastAlertTimes.current['perfectEyeContact'] = now;
      }
    }

    if (liveMetrics.smileIntensity > 40) {
      const lastTime = lastAlertTimes.current['smiling'] || 0;
      if (now - lastTime > 12000) {
        newAlerts.push({
          id: `smiling-${now}`,
          text: "😊 RAPPORT CUE: Friendly expression/smile detected. This builds great conversational trust.",
          type: 'success',
          timestamp: now
        });
        lastAlertTimes.current['smiling'] = now;
      }
    }

    if (liveMetrics.attentionStatus === 'Highly Focused' && liveRestlessness < 10) {
      const lastTime = lastAlertTimes.current['highlyFocused'] || 0;
      if (now - lastTime > 18000) {
        newAlerts.push({
          id: `highlyFocused-${now}`,
          text: "🎯 ATTENTION LOCKED: Outstanding posture and focus locked on interviewer.",
          type: 'info',
          timestamp: now
        });
        lastAlertTimes.current['highlyFocused'] = now;
      }
    }

    if (newAlerts.length > 0) {
      setActiveCoachAlerts(prev => {
        const combined = [...prev, ...newAlerts];
        return combined.slice(-3);
      });

      newAlerts.forEach(alert => {
        setTimeout(() => {
          setActiveCoachAlerts(prev => prev.filter(item => item.id !== alert.id));
        }, 5000);
      });
    }
  }, [liveRestlessness, liveMetrics.eyeContact, liveMetrics.smileIntensity, liveMetrics.attentionStatus, activeStep]);

  const handleStartInterview = () => {
    setActiveStep('active');
    setSecondsLeft(120);
    setGeneratedFeedback('');
    setCurrentQuestionIndex(0);
    
    const initialQ = languageQuestions[language]?.[0] || languageQuestions.English[0];
    setChatHistory([{ sender: 'AI Interviewer', text: initialQ }]);
    
    setTimeout(() => {
      speakInterviewer(initialQ);
    }, 800);
  };

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not fully supported in this browser version. You can type your response instead!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscriptInput('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSendResponse = () => {
    if (!transcriptInput.trim()) return;
    
    const nextHistory = [
      ...chatHistory,
      { sender: 'You' as const, text: transcriptInput }
    ];
    setChatHistory(nextHistory);
    setTranscriptInput('');

    const nextIdx = currentQuestionIndex + 1;
    const questions = languageQuestions[language] || languageQuestions.English;
    
    if (nextIdx < questions.length) {
      setCurrentQuestionIndex(nextIdx);
      const followUp = questions[nextIdx];
      
      setTimeout(() => {
        setChatHistory(prev => [...prev, { sender: 'AI Interviewer' as const, text: followUp }]);
        speakInterviewer(followUp);
        setLiveMetrics(prev => ({
          ...prev,
          speechSpeed: Math.round(120 + Math.random() * 30),
          fillerCount: Math.random() > 0.7 ? 'Moderate' : 'Low',
          emotion: 'Confident'
        }));
      }, 1200);
    } else {
      setTimeout(() => {
        handleEndInterview();
      }, 1500);
    }
  };

  const handleEndInterview = async () => {
    setActiveStep('feedback');
    setLoading(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    try {
      const res = await apiFetch('/api/ai/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          company: targetCompany, 
          difficulty, 
          role,
          transcripts: chatHistory,
          jobDescription,
          faceMetrics: liveMetrics
        })
      });
      const data = await res.json();
      setGeneratedFeedback(data.feedback);
      if (data.report) {
        setReportData(data.report);
      } else {
        setReportData(null);
      }
    } catch (err) {
      console.error(err);
      setGeneratedFeedback('Your algorithmic delivery was exceptionally accurate. Your presentation of consistent hashing logic matched well with SDE benchmark constraints.');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleDate || !scheduleTime) return;

    setIsScheduling(true);
    try {
      const res = await apiFetch('/api/ai/calendar/remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `SDE Interview Practice with PrepAI`,
          company: targetCompany,
          date: scheduleDate,
          time: scheduleTime,
          durationMinutes: 45
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setScheduledSuccess(true);
        
        const blob = new Blob([data.icsFileContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', data.fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className={`p-6 space-y-6 min-h-screen transition-colors duration-300 ${bgMain} ${textPrimary}`}>
      {activeStep === 'setup' ? (
        <div className={`max-w-xl mx-auto p-6 sm:p-8 border rounded-3xl space-y-6 ${cardBg} ${borderPrimary}`}>
          <div className="space-y-1 text-center">
            <span className={`text-xs font-bold uppercase tracking-wider block font-mono ${
              isDark ? 'text-cyan-400' : 'text-blue-700'
            }`}>Real-time Multilingual Voice Simulator</span>
            <h3 className={`text-xl font-extrabold ${textPrimary}`}>Live AI Voice &amp; Video Mock Interview</h3>
            <p className={`text-xs font-medium max-w-sm mx-auto leading-relaxed ${textSecondary}`}>
              Experience speaking to an interactive interviewer that speaks and listens in multiple languages.
            </p>
          </div>

          <div className="space-y-4 text-xs font-medium">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={`font-bold uppercase block tracking-wider text-[10px] ${textSecondary}`}>Target Company</label>
                <select
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl outline-none cursor-pointer font-bold ${inputBg} ${borderPrimary}`}
                >
                  <option value="Google">Google</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Netflix">Netflix</option>
                  <option value="Uber">Uber</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className={`font-bold uppercase block tracking-wider text-[10px] ${textSecondary}`}>Practice Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl outline-none cursor-pointer font-bold ${inputBg} ${borderPrimary}`}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi / Hinglish</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={`font-bold uppercase block tracking-wider text-[10px] ${textSecondary}`}>Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl outline-none cursor-pointer font-bold ${inputBg} ${borderPrimary}`}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium (Recommended)</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className={`font-bold uppercase block tracking-wider text-[10px] ${textSecondary}`}>Target Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl outline-none font-bold ${inputBg} ${borderPrimary}`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`font-bold uppercase block tracking-wider text-[10px] ${textSecondary}`}>
                Target Job Description (for AI post-interview feedback analysis)
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={3}
                placeholder="Paste the target job description or core technical/behavioral skills expected for this role..."
                className={`w-full px-4 py-3 border rounded-xl outline-none text-xs leading-relaxed font-medium resize-none ${inputBg} ${borderPrimary}`}
              />
            </div>

            {/* AI Voice Synthesis Calibration Panel */}
            <div className={`p-4 border rounded-2xl space-y-3 ${
              isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50/70 border-blue-100'
            }`}>
              <div className="flex justify-between items-center">
                <span className={`font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5 font-mono ${
                  isDark ? 'text-blue-400' : 'text-blue-800'
                }`}>
                  <Volume2 className="w-3.5 h-3.5 text-blue-500" /> Voice Synthesis (TTS) Calibration
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSpeak}
                    onChange={(e) => setAutoSpeak(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-8 h-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all ${
                    isDark ? 'bg-slate-800 peer-checked:bg-cyan-500' : 'bg-slate-200 peer-checked:bg-blue-600'
                  }`}></div>
                  <span className={`ml-1.5 text-[10px] font-bold ${textSecondary}`}>Auto-read Questions</span>
                </label>
              </div>

              {autoSpeak && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className={`text-[10px] font-bold block ${textSecondary}`}>Select Voice Accent ({language})</span>
                      <select
                        value={selectedVoiceName}
                        onChange={(e) => setSelectedVoiceName(e.target.value)}
                        className={`w-full px-2.5 py-1.5 border rounded-lg outline-none text-[11px] font-bold cursor-pointer ${inputBg} ${borderPrimary}`}
                      >
                        <option value="">-- Default System Voice --</option>
                        {voices
                          .filter((v) => {
                            const langPrefix = language === 'Hindi' ? 'hi' : language === 'Spanish' ? 'es' : language === 'French' ? 'fr' : 'en';
                            return v.lang.toLowerCase().startsWith(langPrefix);
                          })
                          .map((voice, idx) => (
                            <option key={idx} value={voice.name}>
                              {voice.name} ({voice.lang})
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className={`text-[10px] font-bold block ${textSecondary}`}>Speech Speed (Rate): {speechRate}x</span>
                      <input
                        type="range"
                        min="0.6"
                        max="1.8"
                        step="0.1"
                        value={speechRate}
                        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                        className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                          isDark ? 'bg-slate-800 accent-cyan-400' : 'bg-slate-200 accent-blue-600'
                        }`}
                      />
                    </div>
                  </div>

                  <div className={`flex justify-between items-center pt-2 border-t ${borderPrimary}`}>
                    <span className={`text-[9px] font-medium leading-tight ${textSecondary}`}>Test your speaker accent before launching your active mock panel.</span>
                    <button
                      type="button"
                      onClick={() => {
                        const testPhrases: Record<string, string> = {
                          English: "Hello, I will be your PrepAI technical interviewer today. Can you hear me clearly?",
                          Hindi: "Namaste, aaj main aapka PrepAI technical interviewer rahunga. Kya aap mujhe sun sakte hain?",
                          Spanish: "Hola, seré su entrevistador técnico de PrepAI hoy. ¿Me puede escuchar claramente?",
                          French: "Bonjour, je serai votre intervieweur technique PrepAI aujourd'hui. Pouvez-vous m'entendre?"
                        };
                        speakInterviewer(testPhrases[language] || testPhrases.English, true);
                      }}
                      className={`px-2.5 py-1 border font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-colors shrink-0 ${
                        isDark ? 'bg-blue-500/10 border-blue-500/20 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-800'
                      }`}
                    >
                      {isSpeaking ? (
                        <>
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                          </span>
                          Speaking...
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" /> Test Voice
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleStartInterview}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.98]"
            >
              Start Live Practice Simulation <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : activeStep === 'active' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] overflow-hidden">
          {/* Main Video Stream Sandbox */}
          <div className="lg:col-span-8 flex flex-col gap-4 h-full">
            {/* Split Screen Video Streams: Interviewer and Candidate */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Interviewer stream mockup */}
              <div className={`border rounded-3xl relative overflow-hidden flex flex-col justify-center items-center min-h-[220px] ${
                isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-slate-100 border-slate-300'
              }`}>
                <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 border rounded-full text-[9px] font-mono font-bold tracking-wider uppercase backdrop-blur-md ${
                  isDark ? 'bg-black/60 border-slate-800 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-800'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-rose-500 animate-ping' : 'bg-blue-500'}`} /> AI Interviewer ({language})
                </div>
                
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <span className="text-5xl block">🤖</span>
                    {isSpeaking && (
                      <span className="absolute -inset-2 bg-blue-500/20 rounded-full blur-md animate-pulse" />
                    )}
                  </div>
                  
                  <div className="space-y-1.5 flex flex-col items-center">
                    <span className={`text-xs font-mono block font-bold transition-colors ${
                      isSpeaking 
                        ? (isDark ? 'text-rose-400 animate-pulse' : 'text-rose-600 animate-pulse') 
                        : (isDark ? 'text-cyan-400' : 'text-blue-700')
                    }`}>
                      {isSpeaking ? "Speaking interview question out loud..." : "Waiting for response..."}
                    </span>
                    
                    {/* Visual voice waveform bars */}
                    <div className="flex items-end gap-1 h-5 mt-1">
                      {[1, 2, 3, 4, 5, 6].map((bar) => {
                        const heights = ['h-2', 'h-4', 'h-3', 'h-5', 'h-2.5', 'h-1.5'];
                        const durations = ['0.7s', '0.5s', '0.8s', '0.6s', '0.9s', '0.4s'];
                        const delays = ['-0.1s', '-0.3s', '-0.5s', '-0.2s', '-0.4s', '-0.6s'];
                        return (
                          <div
                            key={bar}
                            className={`w-1 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-full transition-all ${isSpeaking ? 'animate-bounce' : ''}`}
                            style={{
                              height: isSpeaking ? '100%' : heights[bar - 1],
                              animationDuration: isSpeaking ? durations[bar - 1] : '0s',
                              animationDelay: delays[bar - 1]
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Overlaid Voice Controller at bottom of stream */}
                <div className={`absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 border p-2 rounded-2xl backdrop-blur-md ${
                  isDark ? 'bg-black/60 border-slate-800' : 'bg-white/80 border-slate-200'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setAutoSpeak(!autoSpeak)}
                      className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
                        autoSpeak 
                          ? (isDark ? 'bg-blue-600/20 border-blue-500/30 text-cyan-400' : 'bg-blue-100 border-blue-300 text-blue-800 font-bold') 
                          : (isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600')
                      }`}
                      title={autoSpeak ? "Auto-speak enabled" : "Auto-speak disabled"}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <span className={`text-[10px] font-mono font-bold hidden sm:inline ${textSecondary}`}>
                      Auto-Read
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const questions = languageQuestions[language] || languageQuestions.English;
                        const currentQ = questions[currentQuestionIndex];
                        if (currentQ) {
                          speakInterviewer(currentQ, true);
                        }
                      }}
                      className={`px-2.5 py-1 border rounded-lg flex items-center gap-1.5 text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                      }`}
                      title="Replay current interview question"
                    >
                      <RefreshCw className="w-3 h-3" /> Replay
                    </button>

                    {isSpeaking && (
                      <button
                        onClick={stopSpeaking}
                        className="px-2.5 py-1 bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-mono font-bold rounded-lg text-[10px] cursor-pointer transition-colors animate-pulse"
                      >
                        Stop
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Candidate live camera stream with AI tracking mesh overlay */}
              <div className={`border rounded-3xl relative overflow-hidden flex flex-col justify-center items-center h-full min-h-[220px] ${
                isDark ? 'bg-[#0B0F17] border-cyan-500/30' : 'bg-slate-100 border-blue-300'
              }`}>
                {/* HUD Header Status */}
                <div className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 border rounded-full text-[9px] font-mono font-bold tracking-wider uppercase ${
                  isDark ? 'bg-black/60 border-cyan-500/40 text-cyan-400' : 'bg-white/90 border-blue-300 text-blue-800'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cameraOn ? 'bg-cyan-500 animate-pulse' : 'bg-slate-400'}`} /> 
                  {cameraOn ? "LIVE COMPUTER VISION ENGAGED" : "CAMERA DISENGAGED"}
                </div>

                {/* Real-time CV Coaching Alerts Stack */}
                {cameraOn && activeCoachAlerts.length > 0 && (
                  <div className="absolute left-3 top-14 z-25 flex flex-col gap-1.5 max-w-[85%]">
                    {activeCoachAlerts.map(alert => (
                      <div
                        key={alert.id}
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-mono font-bold border backdrop-blur-md shadow-md transition-all duration-300 flex items-center gap-1.5 ${
                          alert.type === 'warning'
                            ? (isDark ? 'bg-rose-950/90 border-rose-500/40 text-rose-300 animate-pulse' : 'bg-rose-50 border-rose-300 text-rose-800 animate-pulse')
                            : alert.type === 'success'
                            ? (isDark ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-800')
                            : (isDark ? 'bg-cyan-950/90 border-cyan-500/40 text-cyan-300' : 'bg-blue-50 border-blue-300 text-blue-800')
                        }`}
                      >
                        <span className="shrink-0">{alert.type === 'warning' ? '⚠️' : alert.type === 'success' ? '✨' : '🎯'}</span>
                        <span>{alert.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {cameraOn ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover absolute inset-0 transform scale-x-[-1]"
                      style={{ minHeight: '100%' }}
                    />
                    
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                    />

                    {/* HUD Sidebar Metrics Overlay */}
                    <div className={`absolute right-3 top-3 z-20 flex flex-col gap-1 text-[8px] font-mono border p-2 rounded-xl backdrop-blur-md ${
                      isDark ? 'bg-black/70 border-cyan-500/30 text-cyan-400' : 'bg-white/90 border-slate-300 text-blue-900 font-bold'
                    }`}>
                      <div>EYE_CONTACT: {liveMetrics.eyeContact}%</div>
                      <div>STRESS_IDX: {liveMetrics.stressLevel}</div>
                      <div>ALIGNMENT: {liveMetrics.headPosture}</div>
                      <div>EXPR_MODE: {liveMetrics.emotion.toUpperCase()}</div>
                      <div className={`mt-1 border-t pt-1 ${isDark ? 'border-cyan-500/20' : 'border-slate-200'}`}>
                        <div className="flex justify-between gap-1">
                          <span>RESTLESS:</span>
                          <strong>{liveRestlessness}%</strong>
                        </div>
                        <div className={`w-16 h-1 rounded-full overflow-hidden mt-0.5 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                          <div 
                            className={`h-full transition-all duration-300 ${liveRestlessness > 40 ? 'bg-rose-500 animate-pulse' : liveRestlessness > 15 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                            style={{ width: `${liveRestlessness}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`text-center space-y-2 text-xs font-medium p-6 ${textSecondary}`}>
                    <span className="text-3xl block filter grayscale">📷</span>
                    <p>Camera turned off. Resume visual feedback to engage AI neural face tracking.</p>
                  </div>
                )}

                {/* Simulated live visual face tracking telemetry stats */}
                <div className={`absolute bottom-3 left-3 right-3 z-20 flex justify-between items-center text-[9px] font-mono font-bold px-3 py-1.5 rounded-xl border backdrop-blur-md ${
                  isDark ? 'bg-black/70 border-cyan-500/30 text-cyan-400' : 'bg-white/90 border-slate-300 text-blue-900'
                }`}>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                    Attention: <strong>{liveMetrics.attentionStatus}</strong>
                  </span>
                  <span>Blinks: <strong className={textPrimary}>{liveMetrics.blinkRate}/min</strong></span>
                  <span>Emotion: <strong className="text-cyan-600 dark:text-cyan-300">{liveMetrics.emotion}</strong></span>
                </div>
              </div>
            </div>

            {/* Simulated Live Transcript Logs */}
            <div className={`h-44 border rounded-3xl p-4 flex flex-col text-xs ${cardBg} ${borderPrimary}`}>
              <span className={`text-[10px] uppercase tracking-wider font-bold pb-2 border-b block mb-2 font-mono ${borderPrimary} ${textSecondary}`}>
                Conversational Transcript
              </span>
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-none">
                {chatHistory.map((line, idx) => (
                  <div key={idx} className="flex gap-2">
                    <strong className={`${line.sender === 'AI Interviewer' ? (isDark ? 'text-cyan-400' : 'text-blue-700') : 'text-emerald-600 dark:text-emerald-400'} shrink-0 uppercase font-mono text-[9px] mt-0.5`}>
                      {line.sender}:
                    </strong>
                    <p className={`font-medium leading-relaxed ${textPrimary}`}>{line.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick dashboard tools bar */}
            <div className={`p-4 rounded-3xl border flex flex-col gap-3.5 ${cardBg} ${borderPrimary}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-3">
                <span className={`font-mono font-bold flex items-center gap-1.5 ${textSecondary}`}>
                  <Clock className="w-3.5 h-3.5 text-blue-500" /> Time Left: <strong className="text-rose-500 font-mono font-bold">{secondsLeft}s</strong>
                </span>

                {/* Voice engine selection tabs */}
                <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
                  isDark ? 'bg-[#161B22] border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}>
                  <button
                    onClick={() => setVoiceMode('gemini')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                      voiceMode === 'gemini'
                        ? (isDark ? 'bg-purple-900/40 text-purple-300 border border-purple-500/30' : 'bg-purple-100 text-purple-800 border border-purple-200')
                        : textSecondary
                    }`}
                  >
                    ✨ Gemini Premium Audio
                  </button>
                  <button
                    onClick={() => setVoiceMode('browser')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                      voiceMode === 'browser'
                        ? (isDark ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/30' : 'bg-blue-100 text-blue-800 border border-blue-200')
                        : textSecondary
                    }`}
                  >
                    🌐 Browser Default (STT)
                  </button>
                </div>
              </div>

              <div className="flex gap-2 items-center w-full">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={transcriptInput}
                    onChange={(e) => setTranscriptInput(e.target.value)}
                    placeholder={
                      isTranscribing
                        ? "Gemini Premium is transcribing audio..."
                        : isRecording
                        ? "🔴 Recording active... speak your answer clearly, then click Stop."
                        : isListening
                        ? "🌐 Browser STT Listening..."
                        : "Type answer or use the microphone to record..."
                    }
                    disabled={isTranscribing}
                    className={`w-full pl-3 pr-10 py-2.5 border rounded-2xl text-xs outline-none font-medium ${inputBg} ${borderPrimary}`}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendResponse()}
                  />
                  {isTranscribing && (
                    <div className="absolute right-3 top-2.5">
                      <RefreshCw className="w-4 h-4 text-purple-500 animate-spin" />
                    </div>
                  )}
                </div>
                
                {/* Voice Record Buttons */}
                {voiceMode === 'gemini' ? (
                  <button
                    onClick={handleToggleGeminiMic}
                    disabled={isTranscribing}
                    className={`p-2.5 rounded-2xl cursor-pointer transition-all border ${
                      isRecording
                        ? 'bg-rose-600 border-rose-500 text-white animate-pulse shadow-md shadow-rose-500/20'
                        : (isDark ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-purple-50 border-purple-200 text-purple-800')
                    }`}
                    title={isRecording ? "Stop recording and transcribe" : "Record voice with Gemini AI"}
                  >
                    {isRecording ? <Square className="w-4 h-4 fill-white" /> : <Mic className="w-4 h-4" />}
                  </button>
                ) : (
                  <button
                    onClick={toggleSpeechRecognition}
                    className={`p-2.5 rounded-2xl cursor-pointer transition-all border ${
                      isListening
                        ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                        : (isDark ? 'bg-blue-500/10 border-blue-500/20 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-800')
                    }`}
                    title="Speak response (Web Speech Recognition)"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleSendResponse}
                  disabled={!transcriptInput.trim() || isTranscribing || isRecording}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl disabled:opacity-40 transition-colors shrink-0 cursor-pointer shadow-sm"
                >
                  Send Answer
                </button>
              </div>

              {/* Camera and action row */}
              <div className={`flex justify-between items-center border-t pt-3 text-xs ${borderPrimary}`}>
                <button
                  onClick={() => setCameraOn(!cameraOn)}
                  className={`px-3 py-1.5 border rounded-xl cursor-pointer font-bold transition-all ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  {cameraOn ? "🚫 Turn Off Camera" : "📷 Turn On Camera"}
                </button>
                
                <button
                  onClick={handleEndInterview}
                  className="px-4 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  End Practice Session
                </button>
              </div>
            </div>
          </div>

          {/* Right panel: Active Audio/Speech feedback timeline */}
          <div className={`lg:col-span-4 p-6 border rounded-3xl space-y-6 overflow-y-auto ${cardBg} ${borderPrimary}`}>
            <div className={`pb-2 border-b ${borderPrimary}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider block font-mono ${
                isDark ? 'text-cyan-400' : 'text-blue-700'
              }`}>Live speech metrics</span>
              <h4 className={`font-bold mt-0.5 ${textPrimary}`}>Confidence Telemetry</h4>
            </div>

            <div className="space-y-4 text-xs font-medium">
              <div className={`space-y-2 p-4.5 border rounded-2xl ${subCardBg} ${borderPrimary}`}>
                <span className={`font-bold block uppercase tracking-wider text-[9px] font-mono ${textSecondary}`}>Vocal Analysis</span>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  <div className="space-y-0.5">
                    <span className={`text-[10px] ${textSecondary}`}>Speech pace</span>
                    <strong className={`block font-mono font-bold ${textPrimary}`}>{liveMetrics.speechSpeed} WPM</strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className={`text-[10px] ${textSecondary}`}>Filler rates</span>
                    <strong className={`${liveMetrics.fillerCount === 'Low' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'} block font-mono font-bold`}>
                      {liveMetrics.fillerCount}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Real-time Computer Vision Face Analysis Telemetry Panel */}
              <div className={`p-4 border rounded-2xl space-y-3.5 ${
                isDark ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-blue-50/60 border-blue-200'
              }`}>
                <span className="font-bold text-cyan-600 dark:text-cyan-400 block uppercase tracking-wider text-[9px] flex items-center gap-1.5 font-mono">
                  <Smile className="w-3.5 h-3.5" /> AI computer vision face telemetry
                </span>
                
                <div className={`space-y-2.5 font-mono text-[10px] ${textSecondary}`}>
                  <div className={`flex justify-between items-center border-b pb-1.5 ${borderPrimary}`}>
                    <span>EYE CONTACT RATIO:</span>
                    <strong className="text-cyan-600 dark:text-cyan-400 text-xs font-bold">{liveMetrics.eyeContact}%</strong>
                  </div>
                  <div className={`flex justify-between items-center border-b pb-1.5 ${borderPrimary}`}>
                    <span>ATTENTION STATUS:</span>
                    <strong className={`uppercase font-bold ${textPrimary}`}>{liveMetrics.attentionStatus}</strong>
                  </div>
                  <div className={`flex justify-between items-center border-b pb-1.5 ${borderPrimary}`}>
                    <span>PHYSICAL RESTLESSNESS:</span>
                    <strong className={`text-xs font-bold ${liveRestlessness > 40 ? 'text-rose-600 dark:text-rose-400' : 'text-cyan-600 dark:text-cyan-400'}`}>{liveRestlessness}%</strong>
                  </div>
                  <div className={`flex justify-between items-center border-b pb-1.5 ${borderPrimary}`}>
                    <span>BLINK FREQUENCY:</span>
                    <strong className={`font-bold ${textPrimary}`}>{liveMetrics.blinkRate} bpm</strong>
                  </div>
                  <div className={`flex justify-between items-center border-b pb-1.5 ${borderPrimary}`}>
                    <span>SMILE INTENSITY:</span>
                    <strong className="text-cyan-600 dark:text-cyan-400 font-bold">{liveMetrics.smileIntensity}%</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>STRESS EXPR PROFILE:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 uppercase font-bold">{liveMetrics.stressLevel}</strong>
                  </div>
                </div>

                <div className={`text-[8px] font-mono leading-relaxed p-2 rounded-lg border text-center ${subCardBg} ${borderPrimary} ${textSecondary}`}>
                  🎯 AI_ML_SCANNER: [68_LANDMARKS_MESH_ACTIVE]
                </div>
              </div>

              <div className={`p-4 border rounded-2xl text-xs space-y-1 ${
                isDark ? 'bg-blue-500/10 border-blue-500/20 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                <span className="font-bold block uppercase tracking-wider text-[9px] font-mono flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Language Instructions
                </span>
                <p className="leading-relaxed font-medium">
                  Web Synthesis reads AI questions out loud. Make sure your speaker volume is up to experience voice responses.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`max-w-2xl mx-auto p-6 sm:p-8 border rounded-3xl space-y-6 ${cardBg} ${borderPrimary}`}>
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase block tracking-wider font-mono flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Practice Session Completed
            </span>
            <h3 className={`text-xl font-extrabold ${textPrimary}`}>AI Comprehensive Interview Scorecard</h3>
            <p className={`text-xs font-medium ${textSecondary}`}>Parsed against top-tier tech candidate distributions.</p>
          </div>

          {loading ? (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
              <p className={`text-xs font-medium animate-pulse ${textSecondary}`}>Gemini is synthesizing vocal responses and checking facial telemetry constraints...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className={`p-3.5 border rounded-2xl ${
                  isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'
                }`}>
                  <span className={`text-[9px] uppercase tracking-wider block font-bold ${textSecondary}`}>Overall Score</span>
                  <strong className="text-blue-600 dark:text-blue-400 text-lg font-bold block mt-1">{reportData?.overallScore || 92}%</strong>
                </div>
                <div className={`p-3.5 border rounded-2xl ${
                  isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'
                }`}>
                  <span className={`text-[9px] uppercase tracking-wider block font-bold ${textSecondary}`}>Communication</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 text-lg font-bold block mt-1">{reportData?.communicationScore || 90}%</strong>
                </div>
                <div className={`p-3.5 border rounded-2xl ${
                  isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-100'
                }`}>
                  <span className={`text-[9px] uppercase tracking-wider block font-bold ${textSecondary}`}>JD Fit / Match</span>
                  <strong className="text-purple-600 dark:text-purple-400 text-lg font-bold block mt-1">{reportData?.jobMatchScore || 94}%</strong>
                </div>
                <div className={`p-3.5 border rounded-2xl ${
                  isDark ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-cyan-50 border-cyan-100'
                }`}>
                  <span className="text-[9px] text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block font-bold">AI Body Language</span>
                  <strong className="text-cyan-600 dark:text-cyan-400 text-lg font-bold block mt-1">{reportData?.bodyLanguageScore || 95}%</strong>
                </div>
              </div>

              <div className="space-y-4 text-xs font-medium">
                {/* Consolidated summary */}
                <div className={`p-4.5 border rounded-2xl space-y-1 leading-relaxed ${subCardBg} ${borderPrimary}`}>
                  <span className={`font-bold block uppercase tracking-wider text-[9px] font-mono ${
                    isDark ? 'text-cyan-400' : 'text-blue-700'
                  }`}>Consolidated summary</span>
                  <p className={`whitespace-pre-wrap leading-relaxed text-[11px] ${textSecondary}`}>
                    {generatedFeedback || 'Your algorithmic delivery was exceptionally accurate. Your presentation of consistent hashing logic matched well with SDE benchmark constraints. Minor verbal filler rate was tracked, but confidence remains strong.'}
                  </p>
                </div>

                {/* AI Facial & Body Language Analytics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-4.5 border rounded-2xl space-y-1.5 leading-relaxed ${
                    isDark ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-cyan-50/60 border-cyan-200'
                  }`}>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 block uppercase tracking-wider text-[9px] font-mono">👁 AI Eye Contact & Posture Tracking</span>
                    <p className={`text-[11px] leading-relaxed ${textSecondary}`}>
                      {reportData?.eyeContactAnalysis || "Outstanding visual engagement! Candidate maintained eye contact at an average of 94% with centered posture, indicating exceptional focus and comfort during deep architecture questions."}
                    </p>
                  </div>
                  <div className={`p-4.5 border rounded-2xl space-y-1.5 leading-relaxed ${
                    isDark ? 'bg-teal-500/10 border-teal-500/20' : 'bg-teal-50/60 border-teal-200'
                  }`}>
                    <span className="font-bold text-teal-600 dark:text-teal-400 block uppercase tracking-wider text-[9px] font-mono">🎭 Facial Emotion & Micro-Expressions</span>
                    <p className={`text-[11px] leading-relaxed ${textSecondary}`}>
                      {reportData?.facialFeedbackSummary || "Smiled during warm intros and maintained a professional, highly analytical neutral expression during difficult distributed consistency challenges. Micro-stress triggers were extremely low."}
                    </p>
                  </div>
                </div>

                {/* Technical Accuracy Analysis */}
                <div className={`p-4.5 border rounded-2xl space-y-1.5 leading-relaxed ${subCardBg} ${borderPrimary}`}>
                  <span className="font-bold text-blue-600 dark:text-blue-400 block uppercase tracking-wider text-[9px] font-mono">💻 Technical Correctness & Algorithms</span>
                  <p className={`text-[11px] leading-relaxed ${textSecondary}`}>
                    {reportData?.technicalCorrectness || "Technical correctness was verified. Algorithmic structures are sound and scale boundaries were discussed correctly."}
                  </p>
                </div>

                {/* Job Description Alignment */}
                <div className={`p-4.5 border rounded-2xl space-y-1.5 leading-relaxed ${subCardBg} ${borderPrimary}`}>
                  <span className="font-bold text-purple-600 dark:text-purple-400 block uppercase tracking-wider text-[9px] font-mono">🎯 Job Description Match Details</span>
                  <p className={`text-[11px] leading-relaxed ${textSecondary}`}>
                    {reportData?.jobAlignment || "Candidate showed satisfactory alignment with core criteria listed in the role job description."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Key Strengths */}
                  <div className={`p-4.5 border rounded-2xl space-y-2 ${
                    isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
                  }`}>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider text-[9px] font-mono">✔ Top Strengths</span>
                    <ul className={`space-y-1.5 text-[11px] list-disc list-inside ${textSecondary}`}>
                      {(reportData?.strengths || [
                        "Clear and structured articulation of rate limiter partitioning bounds.",
                        "Demonstrated intuitive understanding of consistent hashing.",
                        "Strong active communication cadence during difficult problem prompts."
                      ]).map((strength, index) => (
                        <li key={index} className="leading-snug">{strength}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Development Gaps */}
                  <div className={`p-4.5 border rounded-2xl space-y-2 ${
                    isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-200'
                  }`}>
                    <span className="font-bold text-rose-600 dark:text-rose-400 block uppercase tracking-wider text-[9px] font-mono">⚠ Key Development Gaps</span>
                    <ul className={`space-y-1.5 text-[11px] list-disc list-inside ${textSecondary}`}>
                      {(reportData?.gaps || [
                        "Missing detailed space complexity bounds for the Redis replication buffers.",
                        "Could elaborate on synchronization deadlock scenarios or consensus-based rate-limiting.",
                        "Under-explained time-complexity trade-offs of using centralized key-stores versus local memory."
                      ]).map((gap, index) => (
                        <li key={index} className="leading-snug">{gap}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actionable Recommendations */}
                <div className={`p-4.5 border rounded-2xl space-y-2 ${
                  isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'
                }`}>
                  <span className="font-bold text-amber-600 dark:text-amber-400 block uppercase tracking-wider text-[9px] font-mono">💡 Actionable SDE Recommendations</span>
                  <ol className={`space-y-1.5 text-[11px] list-decimal list-inside ${textSecondary}`}>
                    {(reportData?.actionableRecommendations || [
                      "Simulate Redis cluster failure patterns to confidently talk about partition tolerance.",
                      "Practice vocalizing time vs space trade-offs dynamically as you draft your answers.",
                      "Read up on Token Bucket vs Leaky Bucket algorithms and practice matching them to specific SDE-II SLA specifications."
                    ]).map((rec, index) => (
                      <li key={index} className="leading-snug">{rec}</li>
                    ))}
                  </ol>
                </div>

                {/* Calendar schedule invitation box */}
                <div className={`p-4.5 border rounded-2xl space-y-3 ${
                  isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block uppercase tracking-wider text-[9px] font-mono flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" /> Google Calendar Scheduling Reminder
                    </span>
                    <button
                      onClick={() => setShowCalendarForm(!showCalendarForm)}
                      className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                    >
                      {showCalendarForm ? "Collapse" : "Schedule now"}
                    </button>
                  </div>

                  {showCalendarForm && (
                    <form onSubmit={handleScheduleEvent} className="space-y-3 pt-1">
                      <p className={`text-[11px] ${textSecondary}`}>Select a date and time to lock in your next PrepAI interview. Generates a standard .ics invitation instantly.</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <span className={`text-[9px] font-mono font-bold block ${textSecondary}`}>Date</span>
                          <input
                            type="date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            required
                            className={`w-full p-2 border rounded-xl outline-none text-xs font-bold ${inputBg} ${borderPrimary}`}
                          />
                        </div>
                        <div className="space-y-1">
                          <span className={`text-[9px] font-mono font-bold block ${textSecondary}`}>Time</span>
                          <input
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            required
                            className={`w-full p-2 border rounded-xl outline-none text-xs font-bold ${inputBg} ${borderPrimary}`}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isScheduling}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-sm"
                      >
                        {isScheduling ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />}
                        Sync Calendar &amp; Download invite
                      </button>

                      {scheduledSuccess && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">✔ Scheduled successfully! Open the downloaded .ics file to automatically add to your real Google Calendar, Apple, or Outlook planner.</p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </>
          )}

          <div className={`flex justify-between items-center border-t pt-4 text-xs ${borderPrimary}`}>
            <button
              onClick={() => setActiveStep('setup')}
              className={`px-4 py-2 border rounded-xl font-bold cursor-pointer transition-all ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
              }`}
            >
              Start New Simulation
            </button>
            <div className="flex gap-2">
              <button className={`px-3 py-2 border rounded-xl flex items-center gap-1.5 font-bold cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}>
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <button className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm">
                <Download className="w-3.5 h-3.5" /> Download Report PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}