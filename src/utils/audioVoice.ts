import { VoiceConfig, VoiceState } from "../types";
import { cleanTextForSpeech } from "./speechUtils";

// Check browser SpeechRecognition support
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export class QuantumVoiceEngine {
  private recognition: any = null;
  private synth: SpeechSynthesis | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private onStateChange: (state: Partial<VoiceState>) => void;
  private onCommandReceived: (command: string) => void;

  public config: VoiceConfig = {
    voiceTone: "British Refined (Quantum)",
    rate: 1.05,
    pitch: 0.95,
    continuousListening: false,
    autoSpeakResponse: true,
    wakeWordEnabled: true,
  };

  constructor(
    onStateChange: (state: Partial<VoiceState>) => void,
    onCommandReceived: (command: string) => void
  ) {
    this.onStateChange = onStateChange;
    this.onCommandReceived = onCommandReceived;

    if (typeof window !== "undefined") {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth && this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize natural English voices (e.g. UK English Male, Google UK English, Daniel, Oliver, Alex)
    const quantumVoice = voices.find(
      (v) =>
        v.name.includes("UK English Male") ||
        v.name.includes("Daniel") ||
        v.name.includes("Oliver") ||
        v.name.includes("George") ||
        (v.lang.startsWith("en-GB") && !v.name.includes("Female")) ||
        v.name.includes("Google UK English Male")
    ) || voices.find((v) => v.lang.startsWith("en-GB")) || voices.find((v) => v.lang.startsWith("en"));

    if (quantumVoice) {
      this.selectedVoice = quantumVoice;
    }
  }

  public async startListening() {
    if (!SpeechRecognition) {
      if (this.synth) {
        this.speak("Voice input is not supported in this browser window. Please type your query in the prompt bar, sir.");
      }
      this.onStateChange({ isListening: false, mode: "STANDBY" });
      return;
    }

    try {
      // Connect Web Audio microphone analyzer for holographic visualizer
      await this.initAudioAnalyser();

      if (this.recognition) {
        try {
          this.recognition.abort();
        } catch {
          // ignore
        }
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";

      this.recognition.onstart = () => {
        this.onStateChange({
          isListening: true,
          mode: "LISTENING",
          transcript: "",
        });
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const currentText = (finalTranscript || interimTranscript).trim();
        this.onStateChange({ transcript: currentText });

        if (finalTranscript.trim()) {
          this.processVoiceCommand(finalTranscript.trim());
        }
      };

      this.recognition.onerror = (event: any) => {
        if (event.error !== "no-speech") {
          this.stopListening();
        }
      };

      this.recognition.onend = () => {
        if (this.config.continuousListening) {
          try {
            this.recognition.start();
          } catch {
            this.onStateChange({ isListening: false, mode: "STANDBY" });
          }
        } else {
          this.onStateChange({ isListening: false, mode: "STANDBY" });
        }
      };

      this.recognition.start();
    } catch (err) {
      console.error("Failed to start voice recognition:", err);
      this.onStateChange({ isListening: false, mode: "STANDBY" });
    }
  }

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
    this.stopAudioAnalyser();
    this.onStateChange({ isListening: false, mode: "STANDBY", audioLevel: 0 });
  }

  private processVoiceCommand(rawText: string) {
    let cleanCommand = rawText;
    
    // Check for Wake word triggers: "Quantum", "Hey Quantum"
    const wakeMatch = rawText.match(/^(?:hey\s+)?quantum[,\s]*(.*)$/i);
    if (wakeMatch) {
      cleanCommand = wakeMatch[1] || rawText;
    }

    if (cleanCommand.trim()) {
      this.onStateChange({
        lastCommand: cleanCommand.trim(),
        mode: "PROCESSING",
        isProcessing: true,
      });
      this.onCommandReceived(cleanCommand.trim());
    }
  }

  public speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        resolve();
        return;
      }

      this.synth.cancel(); // cancel prior speech

      if (!this.selectedVoice) {
        this.initVoices();
      }

      // Temporarily abort recognition while speaking to prevent microphone acoustic feedback loops
      const wasListening = this.recognition !== null;
      if (this.recognition) {
        try {
          this.recognition.abort();
        } catch {
          // ignore
        }
      }

      // Clean LaTeX & markdown tags for natural conversational human speech synthesis
      const spokenText = cleanTextForSpeech(text);

      if (!spokenText) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(spokenText);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.rate = this.config.rate;
      utterance.pitch = this.config.pitch;

      utterance.onstart = () => {
        this.onStateChange({ isSpeaking: true, mode: "SPEAKING" });
        this.simulateSpeakingAudioSpectrum();
      };

      utterance.onend = () => {
        this.onStateChange({ isSpeaking: false, mode: "STANDBY", audioLevel: 0 });
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        if (wasListening && this.config.continuousListening) {
          try {
            this.startListening();
          } catch {
            // ignore
          }
        }
        resolve();
      };

      utterance.onerror = () => {
        this.onStateChange({ isSpeaking: false, mode: "STANDBY", audioLevel: 0 });
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        if (wasListening && this.config.continuousListening) {
          try {
            this.startListening();
          } catch {
            // ignore
          }
        }
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    this.onStateChange({ isSpeaking: false, mode: "STANDBY", audioLevel: 0 });
  }

  private async initAudioAnalyser() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioMeter = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(1, avg / 128);

        this.onStateChange({ audioLevel: normalized });
        this.animFrameId = requestAnimationFrame(updateAudioMeter);
      };

      updateAudioMeter();
    } catch (e) {
      console.warn("Microphone audio analyzer unavailable:", e);
    }
  }

  private simulateSpeakingAudioSpectrum() {
    const updateSpeakingMeter = () => {
      const simulatedLevel = 0.35 + Math.random() * 0.55;
      this.onStateChange({ audioLevel: simulatedLevel });
      this.animFrameId = requestAnimationFrame(updateSpeakingMeter);
    };
    updateSpeakingMeter();
  }

  private stopAudioAnalyser() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
