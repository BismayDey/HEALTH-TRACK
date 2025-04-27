"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useCallback } from "react";

// Define TypeScript types
type AudioVisualizerProps = {
  isVisible: boolean;
};

type ResponseContainerProps = {
  text: string;
  onClose: () => void;
  isTyping: boolean;
};

type NotificationProps = {
  message: string;
  isVisible: boolean;
};

type ButtonState =
  | "ready"
  | "recording"
  | "sending"
  | "listening"
  | "auto-recording";

export default function Home() {
  // State management
  const [buttonState, setButtonState] = useState<ButtonState>("ready");
  const [status, setStatus] = useState("Ready");
  const [responseText, setResponseText] = useState("");
  const [isResponseVisible, setIsResponseVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    isVisible: false,
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAutoRecording, setIsAutoRecording] = useState(false);
  const [hasSpokenOnce, setHasSpokenOnce] = useState(false);
  const [autoRecordingEnabled, setAutoRecordingEnabled] = useState(false);
  const [isAudioVisualizerVisible, setIsAudioVisualizerVisible] =
    useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const btnWaveRef = useRef<HTMLDivElement>(null);

  // Create particles
  const createParticles = useCallback(() => {
    if (!particlesRef.current) return;

    const count = Math.floor(window.innerWidth / 15);
    particlesRef.current.innerHTML = ""; // Clear existing particles

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");

      // Randomize particle properties
      const size = Math.random() * 6 + 1;
      const posX = Math.random() * window.innerWidth;
      const duration = Math.random() * 40 + 20;
      const delay = Math.random() * 15;

      // Randomize colors
      const colors = ["#9932CC", "#FF00FF", "#00FFFF"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      // Apply styles
      particle.className = "absolute rounded-full opacity-30";
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}px`;
      particle.style.bottom = `-10px`;
      particle.style.background = color;
      particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
      particle.style.animation = `float ${duration}s linear infinite`;
      particle.style.animationDelay = `${delay}s`;

      particlesRef.current.appendChild(particle);
    }
  }, []);

  // Show notification
  const showNotification = useCallback((message: string, duration = 3000) => {
    setNotification({ message, isVisible: true });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isVisible: false }));
    }, duration);
  }, []);

  // Trigger button wave animation
  const triggerButtonWave = useCallback(() => {
    if (!btnWaveRef.current) return;

    btnWaveRef.current.classList.remove("animate-btn-wave");
    void btnWaveRef.current.offsetWidth; // Force reflow
    btnWaveRef.current.classList.add("animate-btn-wave");
  }, []);

  // Connect WebSocket
  const connectWebSocket = useCallback(() => {
    // In a real app, you would use environment variables for the WebSocket URL
    // For demo purposes, we'll simulate the connection
    const simulateWebSocket = () => {
      const mockSocket = {
        send: (data: any) => {
          console.log("Sending data:", data);

          // Simulate response after a delay
          setTimeout(() => {
            setIsTyping(true);
            setIsResponseVisible(true);

            // Simulate streaming text
            const response =
              "I'm Dr. Groq, your AI medical assistant. I notice you're interested in discussing your health. While I can provide general information, remember that I'm not a replacement for professional medical advice. How can I assist you today?";
            let currentIndex = 0;

            const textInterval = setInterval(() => {
              if (currentIndex < response.length) {
                setResponseText(response.substring(0, currentIndex + 1));
                currentIndex++;
              } else {
                clearInterval(textInterval);
                setIsTyping(false);

                // Simulate AI speaking
                setAISpeakingState();

                // Create audio element
                const audio = new Audio("/placeholder-audio.mp3");
                audioRef.current = audio;

                // Simulate audio playing and ending
                setTimeout(() => {
                  audioFinished();
                }, 3000);
              }
            }, 30);
          }, 1500);
        },
        close: () => console.log("WebSocket closed"),
      };

      return mockSocket as unknown as WebSocket;
    };

    // In a real app, you would use a real WebSocket connection
    // socketRef.current = new WebSocket('ws://127.0.0.1:8000/groqspeaks');
    socketRef.current = simulateWebSocket();

    setStatus("Ready");
  }, []);

  // Set AI speaking state
  const setAISpeakingState = useCallback(() => {
    setButtonState("listening");
    setIsSpeaking(true);
    setStatus("Groq AI Speaking");
    setIsAudioVisualizerVisible(true);

    // Ripple effect
    if (rippleRef.current) {
      rippleRef.current.innerHTML = "";
      for (let i = 0; i < 3; i++) {
        const rippleElement = document.createElement("span");
        rippleElement.className =
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-2 border-purple-400 opacity-0";
        rippleElement.style.animation = `ripple 2s infinite ease-out ${
          i * 0.5
        }s`;
        rippleRef.current.appendChild(rippleElement);
      }
    }
  }, []);

  // Audio finished playing
  const audioFinished = useCallback(() => {
    setIsSpeaking(false);
    setIsAudioVisualizerVisible(false);

    // If this is the first time AI has spoken, enable auto-recording
    if (!hasSpokenOnce) {
      setHasSpokenOnce(true);
      setAutoRecordingEnabled(true);
      startAutoRecording();
    } else if (autoRecordingEnabled) {
      startAutoRecording();
    } else {
      resetUI();
    }
  }, [hasSpokenOnce, autoRecordingEnabled]);

  // Start auto recording
  const startAutoRecording = useCallback(() => {
    setIsAutoRecording(true);
    setButtonState("auto-recording");
    setStatus("Auto Recording");
    showNotification("Auto-recording activated. Click Stop to disable.");

    // Start recording after a short delay
    setTimeout(() => {
      if (isAutoRecording) {
        startRecording();
      }
    }, 1000);
  }, [isAutoRecording, showNotification]);

  // Reset UI
  const resetUI = useCallback(() => {
    setButtonState("ready");
    setIsSpeaking(false);
    setIsAutoRecording(false);
    setStatus("Ready");
    setIsAudioVisualizerVisible(false);
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      // Clear any previous response
      setResponseText("");

      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/m4a",
        });

        // Sending state
        setButtonState("sending");
        setStatus("Processing");

        // Send audio
        const arrayBuffer = await audioBlob.arrayBuffer();
        if (socketRef.current) {
          socketRef.current.send(arrayBuffer);
        }
      };

      mediaRecorder.start(100);

      if (isAutoRecording) {
        setButtonState("auto-recording");
      } else {
        setButtonState("recording");
      }

      setStatus(isAutoRecording ? "Auto Recording" : "Listening");
      setIsAudioVisualizerVisible(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      setStatus(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      setButtonState("ready");
      setIsAutoRecording(false);
      setIsAudioVisualizerVisible(false);
    }
  }, [isAutoRecording]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  }, []);

  // Stop auto recording mode
  const stopAutoRecording = useCallback(() => {
    setAutoRecordingEnabled(false);
    setIsAutoRecording(false);
    showNotification("Auto-recording disabled");

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      stopRecording();
    }

    resetUI();
  }, [resetUI, showNotification, stopRecording]);

  // Stop AI from speaking
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsSpeaking(false);
    resetUI();
  }, [resetUI]);

  // Handle button click
  const handleButtonClick = useCallback(() => {
    triggerButtonWave();

    if (isSpeaking) {
      // Stop AI from speaking
      stopSpeaking();
      return;
    }

    if (isAutoRecording) {
      // Stop auto recording mode
      stopAutoRecording();
      return;
    }

    if (buttonState === "recording") {
      stopRecording();
    } else {
      startRecording();
    }
  }, [
    buttonState,
    isAutoRecording,
    isSpeaking,
    startRecording,
    stopAutoRecording,
    stopRecording,
    stopSpeaking,
    triggerButtonWave,
  ]);

  // Close response
  const handleCloseResponse = useCallback(() => {
    setIsResponseVisible(false);
    resetUI();
  }, [resetUI]);

  // Initialize
  useEffect(() => {
    createParticles();
    connectWebSocket();

    // Recreate particles on window resize
    const handleResize = () => {
      createParticles();
    };

    window.addEventListener("resize", handleResize);

    // Add mousemove effect for particles
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Move some particles slightly towards mouse
      const particleElements = document.querySelectorAll("[data-particle]");
      particleElements.forEach((particle, index) => {
        if (index % 5 === 0) {
          // Only affect some particles
          const rect = particle.getBoundingClientRect();
          const particleX = rect.left + rect.width / 2;
          const particleY = rect.top + rect.height / 2;

          const deltaX = (mouseX - particleX) * 0.01;
          const deltaY = (mouseY - particleY) * 0.01;
          (
            particle as HTMLElement
          ).style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleMouseMove);

      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connectWebSocket, createParticles]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed top-0 left-0 w-full h-full bg-gray-900 z-0 opacity-20 bg-[radial-gradient(circle_at_center,_#8A2BE2,_transparent_70%)] animate-pulse-bg"></div>

      {/* Hexagon background */}
      <div className="fixed top-0 left-0 w-full h-full z-[-1] opacity-10 bg-hexagon-pattern"></div>

      {/* Particles */}
      <div
        ref={particlesRef}
        className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden"
      ></div>

      {/* Glow effects */}
      <div className="fixed top-[20%] left-[20%] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,_#8A2BE2_0%,_transparent_70%)] opacity-30 blur-xl animate-move-around z-[-1]"></div>
      <div className="fixed top-[60%] left-[70%] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,_#8A2BE2_0%,_transparent_70%)] opacity-30 blur-xl animate-move-around-alt z-[-1]"></div>

      {/* Notification */}
      <Notification
        message={notification.message}
        isVisible={notification.isVisible}
      />

      {/* Main container */}
      <div className="text-center max-w-[500px] w-full relative z-10 backdrop-blur-md p-5 rounded-3xl shadow-lg bg-gray-900/40 border border-purple-600/20 animate-fade-in">
        <h1 className="font-['Orbitron',_sans-serif] text-5xl mb-2 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent shadow-text animate-gradient-shift">
          Dr. Groq
        </h1>
        <p className="text-lg mb-8 opacity-80 shadow-text">
          Your Talking AI medical assistant
        </p>

        {/* Button container */}
        <div className="relative my-10 flex justify-center">
          <button
            onClick={handleButtonClick}
            className={`w-40 h-40 rounded-full border-none text-white font-['Orbitron',_sans-serif] text-xl font-bold cursor-pointer shadow-lg outline-none relative z-10 uppercase tracking-wider overflow-hidden transition-all duration-300 ease-out transform hover:scale-105 ${
              buttonState === "ready"
                ? "bg-gradient-to-br from-indigo-900 to-purple-600 shadow-[0_8px_16px_rgba(0,0,0,0.3),0_0_0_2px_rgba(138,43,226,0.3),inset_0_0_20px_rgba(138,43,226,0.2)]"
                : buttonState === "recording"
                ? "bg-gradient-to-br from-[#6A1B9A] to-[#9C27B0] shadow-[0_8px_16px_rgba(0,0,0,0.3),0_0_0_4px_rgba(255,0,0,0.3),inset_0_0_30px_rgba(255,0,0,0.2)] animate-pulse"
                : buttonState === "sending"
                ? "bg-gradient-to-br from-[#FF6D00] to-[#FFAB00] shadow-[0_8px_16px_rgba(0,0,0,0.3),0_0_0_4px_rgba(255,171,0,0.3),inset_0_0_30px_rgba(255,171,0,0.2)]"
                : buttonState === "listening"
                ? "bg-gradient-to-br from-[#0D47A1] to-[#1976D2] shadow-[0_8px_16px_rgba(0,0,0,0.3),0_0_0_4px_rgba(25,118,210,0.3),inset_0_0_30px_rgba(25,118,210,0.2)]"
                : "bg-gradient-to-br from-[#2E7D32] to-[#43A047] shadow-[0_8px_16px_rgba(0,0,0,0.3),0_0_0_4px_rgba(51,255,153,0.3),inset_0_0_30px_rgba(51,255,153,0.2)] animate-pulse"
            }`}
          >
            <span className="relative z-20">
              {buttonState === "ready"
                ? "Speak"
                : buttonState === "recording"
                ? "Send"
                : buttonState === "sending"
                ? "Sending"
                : "Stop"}
            </span>
            <div
              ref={btnWaveRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full bg-white/10 opacity-0"
            ></div>
          </button>
          <div
            ref={rippleRef}
            className="absolute top-0 left-0 right-0 bottom-0 rounded-full pointer-events-none z-0 opacity-70"
          ></div>
        </div>

        {/* Status text */}
        <p
          className={`mt-8 text-xl font-semibold text-white h-6 font-['Orbitron',_sans-serif] tracking-wider uppercase shadow-text relative ${
            status === "Processing" ? "thinking" : ""
          }`}
        >
          {status}
        </p>

        {/* Audio visualizer */}
        <AudioVisualizer isVisible={isAudioVisualizerVisible} />
      </div>

      {/* Response container */}
      {isResponseVisible && (
        <ResponseContainer
          text={responseText}
          onClose={handleCloseResponse}
          isTyping={isTyping}
        />
      )}
    </div>
  );
}

// Audio Visualizer Component
function AudioVisualizer({ isVisible }: AudioVisualizerProps) {
  if (!isVisible) return null;

  return (
    <div className="flex items-center justify-center gap-1 h-5 mt-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-[3px] h-full bg-purple-400 rounded-sm animate-audio-visualize"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

// Response Container Component
function ResponseContainer({
  text,
  onClose,
  isTyping,
}: ResponseContainerProps) {
  return (
    <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2 bg-gray-900/85 border border-purple-600 rounded-2xl p-6 max-w-[85%] w-[550px] shadow-[0_10px_40px_rgba(138,43,226,0.4)] z-[100] backdrop-blur-md animate-fade-in max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-gray-800/50">
      <div className="flex justify-between items-center mb-4 border-b border-purple-400 pb-4 relative">
        <h3 className="font-['Orbitron',_sans-serif] text-purple-400 text-xl shadow-text relative pl-6">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_10px_#9932CC] animate-pulse"></span>
          Dr. Groq Response
        </h3>
        <button
          onClick={onClose}
          className="bg-transparent border-none text-white text-2xl cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100 hover:scale-110 hover:bg-white/10 w-8 h-8 flex items-center justify-center rounded-full"
        >
          <X size={18} />
        </button>
      </div>

      {isTyping && (
        <div className="flex items-center gap-1 mb-4 p-3 bg-purple-600/10 rounded-lg w-fit">
          <div
            className="w-2 h-2 bg-purple-400 rounded-full opacity-40 animate-typing-dot"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2 h-2 bg-purple-400 rounded-full opacity-40 animate-typing-dot"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-purple-400 rounded-full opacity-40 animate-typing-dot"
            style={{ animationDelay: "0.4s" }}
          ></div>
          <span className="ml-3 text-purple-400">Dr. Groq is typing...</span>
        </div>
      )}

      <div className="text-white text-lg leading-relaxed mb-4 whitespace-pre-wrap relative p-1">
        {text}
      </div>
    </div>
  );
}

// Notification Component
function Notification({ message, isVisible }: NotificationProps) {
  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 bg-gray-900/90 border border-purple-600 rounded-lg py-3 px-5 text-white text-sm shadow-[0_5px_15px_rgba(0,0,0,0.3)] z-[1000] transition-all duration-300 pointer-events-none ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      {message}
    </div>
  );
}
