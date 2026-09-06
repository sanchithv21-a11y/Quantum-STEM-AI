export type QuantumThemeMode = "normal" | "build" | "fast" | "ultra_instinct" | "relax";

export type QuantumEdition = "basic" | "ultra" | "codingz" | "matrix";

export type SubscriptionTier = "free" | "pro" | "max";

export type QuantumCoreVariant = "normal" | "astrolabe" | "tokamak" | "singularity";

export type STEMDomain =
  | "physics"
  | "calculus"
  | "quantum"
  | "engineering"
  | "chemistry"
  | "biology"
  | "earth_science"
  | "orbital"
  | "ai_neural";

export type AIModelId =
  | "quantum-prime"
  | "gemini-3.7-flash"
  | "gemini-3.5-flash"
  | "gpt-5.6-luna"
  | "gpt-5.5"
  | "claude-sonnet-5"
  | "claude-opus-4.8"
  | "claude-fable-5"
  | "deepseek-v4"
  | "qwen-3.7"
  | "grok-4.6"
  | "grok-4.5"
  | "fable-5"
  | "llama-4-hyperion"
  | "mistral-large-3";

export interface AIModel {
  id: AIModelId;
  name: string;
  provider:
    | "Quantum AI Labs"
    | "Google DeepMind"
    | "OpenAI"
    | "Anthropic"
    | "DeepSeek"
    | "Alibaba Cloud"
    | "xAI"
    | "Fable AI"
    | "Meta AI"
    | "Mistral AI";
  providerFamily:
    | "quantum"
    | "google"
    | "openai"
    | "anthropic"
    | "deepseek"
    | "qwen"
    | "xai"
    | "fable"
    | "open_weights";
  tagline: string;
  description: string;
  contextWindow: string;
  maxOutputTokens: string;
  architecture: string;
  latencyMs: number;
  throughputTokSec: number;
  accentColor: string;
  bgGlow: string;
  specialization: string;
  benchmarks: {
    quantumPhysics: number;
    advancedMath: number;
    codeSynthesis: number;
    logicalReasoning: number;
    multimodalVision: number;
  };
  strengths: string[];
  recommendedUseCases: string[];
  systemPersonaSummary: string;
  isFrontier: boolean;
  tierRequired?: SubscriptionTier;
  status: "ACTIVE" | "ONLINE" | "QUANTUM READY" | "SOVEREIGN PRIME (DEFAULT)";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  domain?: STEMDomain;
  model?: AIModelId | string;
  modelName?: string;
  isVoiceInput?: boolean;
  isVoiceOutput?: boolean;
  imagePreview?: string;
  executedTools?: {
    toolName: string;
    result: string;
    duration?: string;
  }[];
  suggestedFollowups?: string[];
}

export interface VoiceConfig {
  voiceTone: string; // e.g. "British Refined (QUANTUM)", "American Tech", "Neural Synthetic"
  rate: number;
  pitch: number;
  continuousListening: boolean;
  autoSpeakResponse: boolean;
  wakeWordEnabled: boolean;
}

export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  audioLevel: number;
  transcript: string;
  lastCommand: string | null;
  mode: "STANDBY" | "LISTENING" | "PROCESSING" | "SPEAKING" | "EXECUTING";
}

export interface ResearchPaper {
  title: string;
  authors: string;
  year: string;
  arxivId: string;
  abstractSummary: string;
  stemImpact: string;
  url: string;
}

export interface WorkspaceFile {
  id: string;
  name: string;
  extension: "tex" | "py" | "md" | "json" | "csv" | "ipynb";
  content: string;
  size: string;
  updatedAt: string;
}

export interface FormulaPreset {
  id: string;
  name: string;
  domain: STEMDomain;
  description: string;
  latex: string;
  variables: { [key: string]: { label: string; unit: string; min: number; max: number; step: number; defaultValue: number } };
  evaluate: (vars: { [key: string]: number }) => { result: number; unit: string; steps: string[] };
}

export interface SystemTelemetry {
  quantumCoherence: string;
  qubitState: string;
  cpuLoad: string;
  memoryUsage: string;
  thermalRate: string;
  stemEngines: { name: string; status: string; latency: string }[];
  uptimeSeconds: number;
}

export interface STEMNewsArticle {
  id: string;
  title: string;
  summary: string;
  category: "Quantum & Physics" | "Astrophysics & Space" | "AI & Mathematics" | "Biotechnology" | "Energy & Materials";
  source: string;
  sourceUrl?: string;
  publishedDate: string;
  readTime: string;
  keyTakeaway: string;
  paperDoiOrArxiv?: string;
  impactScore: string;
  promptToAnalyze: string;
}

export type AuthProviderType = "google" | "apple" | "github" | "microsoft" | "email";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: AuthProviderType;
  avatarUrl?: string;
  createdAt: string;
  tier: SubscriptionTier;
  quantumId: string;
}

export interface UserReview {
  id: string;
  userName: string;
  userEmail: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  category: string;
  timestamp: string;
  verified: boolean;
  status: "approved" | "pending";
}

export interface UserActivityLog {
  id: string;
  userName: string;
  userEmail: string;
  quantumId?: string;
  role?: string;
  action: string;
  category: "auth" | "stem" | "support" | "review" | "navigation" | "system" | string;
  details?: string;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}

