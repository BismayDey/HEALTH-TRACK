"use client";

import { useEffect, useRef, useState } from "react";

export default function DrGroq() {
  const recordBtnRef = useRef<HTMLButtonElement>(null);
  const statusTextRef = useRef<HTMLParagraphElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const btnWaveRef = useRef<HTMLDivElement>(null);
  const audioVisualizerRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [responseContainer, setResponseContainer] =
    useState<HTMLDivElement | null>(null);
  const [responseTextElement, setResponseTextElement] =
    useState<HTMLDivElement | null>(null);
  const [currentTextResponse, setCurrentTextResponse] = useState("");
  const [textStreamBuffer, setTextStreamBuffer] = useState("");
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [recordingState, setRecordingState] = useState<
    "ready" | "recording" | "sending" | "listening"
  >("ready");

  // Create floating particles with different colors
  function createParticles() {
    if (!particlesRef.current) return;

    const count = Math.floor(window.innerWidth / 15);
    particlesRef.current.innerHTML = ""; // Clear existing particles

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");

      // Randomize particle properties
      const size = Math.random() * 6 + 1;
      const posX = Math.random() * window.innerWidth;
      const duration = Math.random() * 40 + 20;
      const delay = Math.random() * 15;

      // Randomize colors between primary, accent and accent-secondary
      const colors = ["bg-violet-500", "bg-fuchsia-500", "bg-cyan-400"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.classList.add(color);
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}px`;
      particle.style.bottom = `-10px`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.boxShadow = `0 0 ${size * 2}px ${
        color === "bg-violet-500"
          ? "#8b5cf6"
          : color === "bg-fuchsia-500"
          ? "#d946ef"
          : "#22d3ee"
      }`;

      particlesRef.current.appendChild(particle);
    }
  }

  // Show notification
  function showNotification(message: string, duration = 3000) {
    if (!notificationRef.current) return;

    notificationRef.current.textContent = message;
    notificationRef.current.classList.add("opacity-100", "translate-y-0");

    setTimeout(() => {
      if (notificationRef.current) {
        notificationRef.current.classList.remove(
          "opacity-100",
          "translate-y-0"
        );
      }
    }, duration);
  }

  // Button wave animation
  function triggerButtonWave() {
    if (!btnWaveRef.current) return;

    btnWaveRef.current.classList.remove("animate-btn-wave");
    void btnWaveRef.current.offsetWidth; // Force reflow
    btnWaveRef.current.classList.add("animate-btn-wave");
  }

  // Initialize WebSocket connection
  function connectWebSocket() {
    const ws = new WebSocket(
      "wss://embarrassing-viviana-yugamax-b8b4e309.koyeb.app/groqspeaks"
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
      if (statusTextRef.current) {
        statusTextRef.current.textContent = "Ready";
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      if (statusTextRef.current) {
        statusTextRef.current.textContent = "Reconnecting...";
      }
      setTimeout(connectWebSocket, 1000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      if (statusTextRef.current) {
        statusTextRef.current.textContent = "Connection error";
      }
    };

    ws.onmessage = async (event) => {
      if (event.data instanceof Blob) {
        // Handle audio response
        const audioBlob = new Blob([event.data], { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = new Audio(audioUrl);
        setAudio(audioElement);

        // AI Speaking state
        setAISpeakingState();

        // Play audio
        await audioElement.play();

        // When audio finishes
        audioElement.onended = () => {
          audioFinished();
        };
      } else {
        // Handle text response
        try {
          const data = JSON.parse(event.data);

          if (data.type === "text_stream") {
            // Streaming text response
            handleStreamingText(data);
          } else if (data.type === "audio_processing") {
            // Status update
            if (statusTextRef.current) {
              statusTextRef.current.innerHTML = `<span class="thinking">${data.message}</span>`;
            }
          } else if (data.type === "full_text") {
            // Complete text response
            showTextResponse(data.text);
          }
        } catch (e) {
          // Fallback for plain text messages
          showTextResponse(event.data);
        }
      }
    };

    setSocket(ws);
  }

  function setAISpeakingState() {
    setRecordingState("listening");
    setIsSpeaking(true);

    if (statusTextRef.current) {
      statusTextRef.current.innerHTML =
        '<span class="groq">Groq AI Speaking</span>';
    }

    if (audioVisualizerRef.current) {
      audioVisualizerRef.current.style.display = "flex";
    }

    // Ripple effect
    if (rippleRef.current) {
      rippleRef.current.innerHTML = "";
      for (let i = 0; i < 3; i++) {
        const rippleElement = document.createElement("span");
        rippleElement.style.animationDelay = `${i * 0.5}s`;
        rippleRef.current.appendChild(rippleElement);
      }
    }
  }

  // Remove auto-recording functionality by modifying the audioFinished function
  function audioFinished() {
    setIsSpeaking(false);

    if (audioVisualizerRef.current) {
      audioVisualizerRef.current.style.display = "none";
    }

    // Remove auto-recording logic and just reset the UI
    resetUI();
  }

  // Remove the startAutoRecording function entirely and replace it with this empty function
  // to avoid any references to it causing errors
  function startAutoRecording() {
    // Auto-recording disabled as requested
    resetUI();
  }

  function handleStreamingText(data: { text: string }) {
    if (!responseContainer) {
      createResponseContainer();
    }

    if (data.text === "[DONE]") {
      // Streaming complete
      const typingIndicator = document.querySelector(".typing-indicator");
      if (typingIndicator) {
        typingIndicator.remove();
      }

      // AI Speaking state
      setAISpeakingState();

      return;
    }

    // Append text to buffer
    const newBuffer = textStreamBuffer + data.text;
    setTextStreamBuffer(newBuffer);

    // Update display with smooth typing effect
    if (!responseTextElement) return;

    setCurrentTextResponse(newBuffer);

    if (responseContainer) {
      responseContainer.scrollTop = responseContainer.scrollHeight;
    }
  }

  function createResponseContainer() {
    if (responseContainer) {
      responseContainer.remove();
    }

    const container = document.createElement("div");
    container.className =
      "fixed bottom-[100px] left-1/2 -translate-x-1/2 bg-[rgba(18,18,18,0.85)] border border-violet-500 rounded-2xl p-6 max-w-[85%] w-[550px] shadow-[0_10px_40px_rgba(138,43,226,0.4)] z-[100] backdrop-blur-[15px] animate-fade-in max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-track-custom";

    const header = document.createElement("div");
    header.className =
      "flex justify-between items-center mb-4 border-b border-violet-500 pb-4 relative";

    const title = document.createElement("div");
    title.className =
      "font-orbitron text-violet-500 text-xl shadow-[0_0_10px_rgba(138,43,226,0.3)] relative pl-6";
    title.textContent = "Dr. Groq Response";

    // Add the dot before the title
    const dot = document.createElement("div");
    dot.className =
      "absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-violet-500 rounded-full shadow-[0_0_10px_var(--primary-light)] animate-pulse";
    title.prepend(dot);

    header.appendChild(title);

    const closeBtn = document.createElement("button");
    closeBtn.className =
      "bg-transparent border-none text-white text-2xl cursor-pointer opacity-70 transition-all duration-200 w-8 h-8 flex items-center justify-center rounded-full hover:opacity-100 hover:scale-110 hover:bg-white/10";
    closeBtn.innerHTML = "&times;";
    closeBtn.onclick = () => {
      document.body.removeChild(container);
      resetUI();
      setResponseContainer(null);
      setResponseTextElement(null);
      setCurrentTextResponse("");
      setTextStreamBuffer("");
    };
    header.appendChild(closeBtn);

    container.appendChild(header);

    // Add typing indicator
    const typingIndicator = document.createElement("div");
    typingIndicator.className =
      "typing-indicator flex items-center gap-1 mb-4 p-2.5 bg-violet-500/10 rounded-[10px] w-fit";
    typingIndicator.innerHTML = `
      <div class="typing-dot w-2 h-2 bg-violet-500 rounded-full opacity-40 animate-typing-animation"></div>
      <div class="typing-dot w-2 h-2 bg-violet-500 rounded-full opacity-40 animate-typing-animation delay-200"></div>
      <div class="typing-dot w-2 h-2 bg-violet-500 rounded-full opacity-40 animate-typing-animation delay-400"></div>
      <span class="ml-2.5 text-violet-500">Dr. Groq is typing...</span>
    `;
    container.appendChild(typingIndicator);

    const textElement = document.createElement("div");
    textElement.className =
      "text-white text-lg leading-relaxed mb-4 whitespace-pre-wrap relative py-1.5";
    container.appendChild(textElement);

    document.body.appendChild(container);

    setResponseContainer(container);
    setResponseTextElement(textElement);
  }

  function showTextResponse(text: string) {
    createResponseContainer();
    setCurrentTextResponse(text);

    if (responseTextElement) {
      responseTextElement.textContent = text;
    }

    // AI Speaking state
    setAISpeakingState();
  }

  function resetUI() {
    setRecordingState("ready");
    setIsSpeaking(false);

    if (statusTextRef.current) {
      statusTextRef.current.textContent = "Ready";
    }

    if (rippleRef.current) {
      rippleRef.current.innerHTML = "";
    }

    if (audioVisualizerRef.current) {
      audioVisualizerRef.current.style.display = "none";
    }
  }

  // Start recording
  async function startRecording() {
    try {
      // Clear any previous response
      setTextStreamBuffer("");
      setCurrentTextResponse("");

      setAudioChunks([]);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      };

      recorder.onstop = async () => {
        const chunks = audioChunks;
        const audioBlob = new Blob(chunks, { type: "audio/m4a" });

        // Sending state
        setRecordingState("sending");

        if (statusTextRef.current) {
          statusTextRef.current.innerHTML =
            '<span class="thinking">Processing</span>';
        }

        // Send audio
        const arrayBuffer = await audioBlob.arrayBuffer();
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(arrayBuffer);
        } else {
          // Simulate response for demo purposes
          setTimeout(() => {
            showTextResponse(
              "I'm sorry, but I couldn't connect to the server. Please check your connection and try again."
            );
          }, 1500);
        }
      };

      recorder.start(100);

      setRecordingState("recording");

      if (statusTextRef.current) {
        statusTextRef.current.textContent = "Listening";
      }

      if (audioVisualizerRef.current) {
        audioVisualizerRef.current.style.display = "flex";
      }
    } catch (error) {
      console.error("Error starting recording:", error);

      if (statusTextRef.current) {
        statusTextRef.current.textContent = `Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
      }

      setRecordingState("ready");

      if (audioVisualizerRef.current) {
        audioVisualizerRef.current.style.display = "none";
      }
    }
  }

  // Stop recording
  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  }

  // Stop auto recording mode
  function stopAutoRecording() {
    // Auto-recording disabled as requested
    resetUI();
  }

  // Stop AI from speaking
  function stopSpeaking() {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setIsSpeaking(false);
    resetUI();
  }

  // Modify the handleButtonClick function to simplify the flow
  function handleButtonClick() {
    triggerButtonWave();

    if (isSpeaking) {
      // Stop AI from speaking
      stopSpeaking();
      return;
    }

    if (recordingState === "recording") {
      stopRecording();
    } else {
      startRecording();
    }
  }

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
      const particleElements = document.querySelectorAll(".particle");
      particleElements.forEach((particle, index) => {
        if (index % 5 === 0) {
          // Only affect some particles
          const rect = particle.getBoundingClientRect();
          const particleX = rect.left + rect.width / 2;
          const particleY = rect.top + rect.height / 2;

          const deltaX = (mouseX - particleX) * 0.01;
          const deltaY = (mouseY - particleY) * 0.01;

          particle.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleMouseMove);

      if (socket) {
        socket.close();
      }
    };
  }, []);

  // Update responseTextElement content when currentTextResponse changes
  useEffect(() => {
    if (responseTextElement) {
      responseTextElement.textContent = currentTextResponse;
    }
  }, [currentTextResponse, responseTextElement]);

  // Update button text based on recording state
  const getButtonText = () => {
    switch (recordingState) {
      case "recording":
        return "Send";
      case "sending":
        return "Sending";
      case "listening":
        return "Stop";
      default:
        return "Speak";
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#121212] text-white overflow-hidden relative p-5">
      <div className="fixed top-0 left-0 w-full h-full z-0 opacity-20 bg-[radial-gradient(circle_at_center,#8A2BE2,transparent_70%)] animate-pulse-bg"></div>
      <div className="fixed top-0 left-0 w-full h-full z-0 opacity-10 bg-hexagon"></div>
      <div
        ref={particlesRef}
        className="particles fixed top-0 left-0 w-full h-full z-0 overflow-hidden"
      ></div>

      <div
        className="glow-effect absolute w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,#8A2BE2_0%,transparent_70%)] opacity-30 blur-xl animate-move-around-1 z-[-1]"
        style={{ top: "20%", left: "20%" }}
      ></div>
      <div
        className="glow-effect absolute w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,#8A2BE2_0%,transparent_70%)] opacity-30 blur-xl animate-move-around-2 z-[-1]"
        style={{ top: "60%", left: "70%" }}
      ></div>

      <div
        ref={notificationRef}
        className="notification fixed top-5 left-1/2 -translate-x-1/2 bg-[rgba(18,18,18,0.9)] border border-violet-500 rounded-lg py-3 px-5 text-white text-sm shadow-lg z-[1000] opacity-0 transition-all duration-300 pointer-events-none"
      >
        Auto-recording mode activated
      </div>

      <div className="text-center max-w-[500px] w-full relative z-10 backdrop-blur-md p-5 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] bg-[rgba(18,18,18,0.4)] border border-[rgba(138,43,226,0.2)] animate-fade-in">
        <h1 className="font-orbitron text-5xl mb-2 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent shadow-[0_0_15px_rgba(138,43,226,0.4)] animate-gradient-shift">
          Dr. Groq
        </h1>
        <p className="text-lg mb-8 opacity-80 shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          Your Talking AI medical assistant
        </p>

        <div className="relative my-10 flex justify-center">
          <button
            ref={recordBtnRef}
            onClick={handleButtonClick}
            className={`w-40 h-40 rounded-full border-none text-white font-orbitron text-xl font-bold cursor-pointer shadow-[0_8px_16px_rgba(0,0,0,0.3),0_0_0_2px_rgba(138,43,226,0.3),inset_0_0_20px_rgba(138,43,226,0.2)] transition-all duration-300 outline-none relative z-[1] uppercase tracking-wider overflow-hidden
              ${
                recordingState === "ready"
                  ? "bg-gradient-to-br from-indigo-900 to-violet-600"
                  : ""
              }
              ${
                recordingState === "recording"
                  ? "bg-gradient-to-br from-purple-900 to-purple-600 animate-pulse"
                  : ""
              }
              ${
                recordingState === "sending"
                  ? "bg-gradient-to-br from-amber-900 to-amber-600"
                  : ""
              }
              ${
                recordingState === "listening"
                  ? "bg-gradient-to-br from-blue-900 to-blue-600"
                  : ""
              }
              hover:scale-105 hover:shadow-[0_12px_24px_rgba(0,0,0,0.4),0_0_0_4px_rgba(138,43,226,0.4),inset_0_0_30px_rgba(138,43,226,0.3)]
            `}
          >
            <span className="relative z-[2]">{getButtonText()}</span>
            <div
              ref={btnWaveRef}
              className="btn-wave absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full bg-white/10 opacity-0"
            ></div>
          </button>
          <div
            ref={rippleRef}
            className="ripple absolute top-0 left-0 right-0 bottom-0 rounded-full pointer-events-none z-0 opacity-70"
          ></div>
        </div>

        <p
          ref={statusTextRef}
          className="status mt-8 text-xl font-semibold text-white h-6 font-orbitron tracking-wider uppercase shadow-[0_0_10px_rgba(255,255,255,0.3)] relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-[50px] after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-violet-500 after:to-transparent"
        >
          Ready
        </p>

        <div
          ref={audioVisualizerRef}
          className="audio-visualizer flex items-center justify-center gap-[3px] h-5 mt-2.5"
          style={{ display: "none" }}
        >
          <div className="audio-bar w-[3px] h-full bg-violet-500 rounded-[3px] animate-audio-visualize-1"></div>
          <div className="audio-bar w-[3px] h-full bg-violet-500 rounded-[3px] animate-audio-visualize-2"></div>
          <div className="audio-bar w-[3px] h-full bg-violet-500 rounded-[3px] animate-audio-visualize-3"></div>
          <div className="audio-bar w-[3px] h-full bg-violet-500 rounded-[3px] animate-audio-visualize-4"></div>
          <div className="audio-bar w-[3px] h-full bg-violet-500 rounded-[3px] animate-audio-visualize-5"></div>
        </div>
      </div>
    </div>
  );
}
