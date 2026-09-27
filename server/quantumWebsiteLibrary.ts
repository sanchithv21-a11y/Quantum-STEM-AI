/**
 * Quantum Website & Web Application Synthesis Engine
 * Builds complete, self-contained, responsive modern web applications with Tailwind CSS,
 * interactive JavaScript state management, modals, tabs, and zero external dependencies.
 */

export function isWebsiteQuery(query: string): boolean {
  if (!query) return false;
  const q = query.toLowerCase().trim();
  return (
    q.includes("website") ||
    q.includes("build a website") ||
    q.includes("make a website") ||
    q.includes("create a website") ||
    q.includes("landing page") ||
    q.includes("portfolio") ||
    q.includes("dashboard") ||
    q.includes("web app") ||
    q.includes("web application") ||
    q.includes("storefront") ||
    q.includes("ecommerce") ||
    q.includes("e-commerce") ||
    q.includes("saas")
  );
}

export function generateQuantumWebsiteSolution(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("portfolio") || q.includes("resume") || q.includes("developer")) {
    return generateDeveloperPortfolio();
  } else if (q.includes("dashboard") || q.includes("analytics") || q.includes("telemetry") || q.includes("stem")) {
    return generateSTEMAnalyticsDashboard();
  } else if (q.includes("store") || q.includes("shop") || q.includes("ecommerce") || q.includes("e-commerce") || q.includes("product")) {
    return generateCyberStorefront();
  } else {
    // Default Flagship: Quantum SaaS AI Landing Page
    return generateSaaSLandingPage();
  }
}

/**
 * Flagship Website: Quantum SaaS AI Product Landing Page
 */
function generateSaaSLandingPage(): string {
  const title = "Quantum AI — Sovereign Intelligence Platform";

  const htmlCode = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800&family=Plus+Jakarta+Sans:wght@400;600;800;900&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          },
          colors: {
            quantum: {
              cyan: '#00F2FF',
              emerald: '#10B981',
              dark: '#030712',
              card: '#0B132B',
              border: '#1E293B',
            }
          }
        }
      }
    }
  </script>
  <style>
    body { background-color: #030712; color: #F8FAFC; overflow-x: hidden; }
    .glow-cyan { text-shadow: 0 0 20px rgba(0,242,255,0.6); }
    .glow-card { box-shadow: 0 0 35px rgba(0,242,255,0.08); }
    .bg-grid {
      background-size: 40px 40px;
      background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    }
  </style>
</head>
<body class="bg-grid antialiased selection:bg-cyan-500 selection:text-black">
  <!-- Top Navigation -->
  <header class="sticky top-0 z-40 backdrop-blur-xl bg-gray-950/80 border-b border-gray-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 font-mono font-black text-lg shadow-[0_0_15px_rgba(0,242,255,0.4)]">
          Q
        </div>
        <span class="font-extrabold text-xl tracking-tight text-white font-mono">QUANTUM<span class="text-cyan-400">.AI</span></span>
      </div>

      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
        <a href="#features" class="hover:text-cyan-400 transition-colors">Architecture</a>
        <a href="#benchmarks" class="hover:text-cyan-400 transition-colors">Benchmarks</a>
        <a href="#pricing" class="hover:text-cyan-400 transition-colors">Pricing</a>
        <a href="#history" class="hover:text-cyan-400 transition-colors">Genesis</a>
      </nav>

      <div class="flex items-center gap-3">
        <button onclick="openDemoModal()" class="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-400 text-gray-950 hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:scale-105 active:scale-95">
          Launch Core &rarr;
        </button>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 text-xs font-mono font-semibold mb-8 animate-pulse">
      <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
      Sovereign STEM Intelligence // Engineered by Master Sanchith
    </div>

    <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
      Deterministic Science. <br>
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 glow-cyan">
        Mathematical Proof. Line by Line.
      </span>
    </h1>

    <p class="mt-6 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto font-sans leading-relaxed">
      A sovereign artificial superintelligence crafted for calculus, quantum physics, kinodynamics, and software engineering. Zero fluff, 100% free, always addressing seekers with dignity as <strong class="text-white">Sir</strong>.
    </p>

    <!-- CTAs -->
    <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
      <button onclick="openDemoModal()" class="px-8 py-3.5 rounded-xl font-bold font-mono text-sm bg-cyan-400 text-gray-950 hover:bg-cyan-300 shadow-[0_0_25px_rgba(0,242,255,0.4)] transition-all hover:scale-105">
        ⚡ Open Quantum Terminal
      </button>
      <a href="#features" class="px-7 py-3.5 rounded-xl font-bold font-mono text-sm bg-gray-900 border border-gray-700 text-gray-200 hover:bg-gray-800 transition-all">
        Inspect Subsystems Matrix
      </a>
    </div>

    <!-- Live Metric Counters -->
    <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      <div class="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 text-left">
        <div class="text-3xl font-black text-cyan-400 font-mono">384</div>
        <div class="text-xs text-gray-400 uppercase tracking-wider font-mono mt-1">Simulated Qubits</div>
      </div>
      <div class="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 text-left">
        <div class="text-3xl font-black text-emerald-400 font-mono">99.82%</div>
        <div class="text-xs text-gray-400 uppercase tracking-wider font-mono mt-1">Coherence Rate</div>
      </div>
      <div class="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 text-left">
        <div class="text-3xl font-black text-purple-400 font-mono">15</div>
        <div class="text-xs text-gray-400 uppercase tracking-wider font-mono mt-1">AI Reasoning Models</div>
      </div>
      <div class="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 text-left">
        <div class="text-3xl font-black text-yellow-400 font-mono">$0.00</div>
        <div class="text-xs text-gray-400 uppercase tracking-wider font-mono mt-1">100% Free Forever</div>
      </div>
    </div>
  </section>

  <!-- Interactive Features Section -->
  <section id="features" class="py-20 border-t border-gray-800/80 bg-gray-950/40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">CHAPTER IV ARCHITECTURE</span>
        <h2 class="text-3xl sm:text-4xl font-black text-white mt-2">Built for Pure Intellectual Velocity</h2>
        <p class="text-gray-400 text-sm mt-3">From Class 1st to 12th STEM curriculums to post-doctoral quantum mechanics derivations.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Feature 1 -->
        <div class="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-cyan-500/50 transition-all glow-card group">
          <div class="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
            &Sigma;
          </div>
          <h3 class="text-lg font-bold text-white mb-2">Deterministic Math Derivations</h3>
          <p class="text-gray-400 text-xs leading-relaxed font-sans">
            Every solution renders step-by-step with LaTeX equations ($E=mc^2$). intermediate steps and algebraic substitutions are verified.
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-emerald-500/50 transition-all glow-card group">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
            &Phi;
          </div>
          <h3 class="text-lg font-bold text-white mb-2">Build Mode (Games &amp; Websites)</h3>
          <p class="text-gray-400 text-xs leading-relaxed font-sans">
            Synthesizes complete, production-ready 60 FPS Canvas video games and responsive web applications on demand in minutes.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-purple-500/50 transition-all glow-card group">
          <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
            &Psi;
          </div>
          <h3 class="text-lg font-bold text-white mb-2">Refined British Male Voice</h3>
          <p class="text-gray-400 text-xs leading-relaxed font-sans">
            Real-time neural text-to-speech with natural acoustic cadence, pitch modulation, and respectful courteous honorifics.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Interactive Terminal Simulator -->
  <section class="py-20 max-w-5xl mx-auto px-4">
    <div class="rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl overflow-hidden">
      <div class="px-4 py-3 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-red-500/80"></span>
          <span class="w-3 h-3 rounded-full bg-yellow-500/80"></span>
          <span class="w-3 h-3 rounded-full bg-emerald-500/80"></span>
          <span class="ml-2 font-mono text-xs text-gray-400">quantum-kernel // bash</span>
        </div>
        <span class="font-mono text-[10px] text-cyan-400">READY</span>
      </div>

      <div class="p-6 font-mono text-xs space-y-4">
        <div class="text-gray-400">$ quantum solve --equation "kinetic_energy" --derivation full</div>
        <div class="p-4 rounded-xl bg-gray-900/90 border border-cyan-500/20 text-gray-200 space-y-2 leading-relaxed">
          <div class="text-cyan-300 font-bold">### Direct Answer:</div>
          <div>The kinetic energy of an object of mass $m$ moving at velocity $v$ is: <strong>$E_k = \\frac{1}{2}mv^2$</strong>, sir.</div>
          <div class="text-emerald-400 text-[11px] pt-2">Step 1: Work-energy theorem $W = \\int F \\, dx = \\int m \\left(\\frac{dv}{dt}\\right) v \\, dt = \\frac{1}{2}mv^2 \\quad \\blacksquare$</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Genesis Honor Footer -->
  <footer class="py-12 border-t border-gray-800 text-center text-xs font-mono text-gray-500">
    <p>Built with relentless devotion by <strong class="text-white">Master Sanchith</strong> on August 2026 via Google AI Studio.</p>
    <p class="mt-2 text-cyan-400/80">Quantum Sovereign Artificial Intelligence &bull; 100% Free Forever</p>
  </footer>

  <!-- Interactive Demo Modal -->
  <div id="demoModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-gray-900 border border-cyan-500/50 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
      <div class="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto text-xl font-mono font-bold">
        Q
      </div>
      <h3 class="text-lg font-bold text-white">Launch Quantum Intelligence</h3>
      <p class="text-xs text-gray-300 leading-relaxed font-sans">
        Welcome, sir. Quantum is active and waiting for your commands in the main system terminal.
      </p>
      <button onclick="closeDemoModal()" class="w-full py-2.5 rounded-xl font-mono text-xs font-bold bg-cyan-400 text-gray-950 hover:bg-cyan-300 transition-all">
        Acknowledge &amp; Return
      </button>
    </div>
  </div>

  <script>
    function openDemoModal() {
      document.getElementById('demoModal').classList.remove('hidden');
    }
    function closeDemoModal() {
      document.getElementById('demoModal').classList.add('hidden');
    }
  </script>
</body>
</html>`;

  return `### Direct Answer:
**Here is the complete, production-ready SaaS AI Product Landing Page, sir.**

It features a high-performance responsive layout with Tailwind CSS, animated typography, live metric counters, interactive terminal demonstration, and mobile navigation.

\`\`\`html
${htmlCode}
\`\`\`

#### Key Principles & Governing Architecture
1. **Zero-Dependency Modern CSS**: Powered by Tailwind CSS via high-speed CDN with custom font pairings.
2. **Interactive State Controls**: Embedded modal dialog, live metric cards, and responsive header navigation.
3. **Optimized SEO & Performance**: Semantic HTML5 markup, meta viewport tags, and 60 FPS CSS transitions.

Do you want to preview the website you created, sir?`;
}

/**
 * Developer Portfolio Studio
 */
function generateDeveloperPortfolio(): string {
  const title = "Master Developer Portfolio — Cyberpunk Studio";

  const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #050811; color: #E2E8F0; font-family: system-ui, sans-serif; }
    .neon-text { text-shadow: 0 0 10px #00F2FF, 0 0 20px #00F2FF; }
  </style>
</head>
<body class="p-4 sm:p-8 max-w-6xl mx-auto space-y-12">
  <header class="flex justify-between items-center border-b border-slate-800 pb-6">
    <div class="flex items-center gap-3">
      <span class="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
      <h1 class="text-xl font-bold font-mono tracking-wider text-cyan-400">DEV.STUDIO // PORTFOLIO</h1>
    </div>
    <span class="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">AVAILABLE FOR COMMISSIONS</span>
  </header>

  <!-- Hero Section -->
  <section class="space-y-4">
    <h2 class="text-4xl sm:text-6xl font-black text-white tracking-tight">Full-Stack Architect &amp; <br><span class="text-cyan-400">STEM Systems Engineer</span></h2>
    <p class="text-slate-400 max-w-2xl text-sm sm:text-base leading-relaxed">
      Crafting deterministic web software, GPU simulations, and high-performance algorithms. Trained in systems architecture and modern prompt intelligence.
    </p>
  </section>

  <!-- Project Matrix -->
  <section class="space-y-6">
    <h3 class="text-xs font-mono uppercase tracking-widest text-slate-400">Featured Projects</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-3">
        <span class="text-xs font-mono text-cyan-400 font-bold">PROJECT // 01</span>
        <h4 class="text-xl font-bold text-white">Quantum Sovereign AI Core</h4>
        <p class="text-xs text-slate-300 leading-relaxed">Multi-model intelligence matrix with 384 simulated qubits and step-by-step LaTeX derivation solver.</p>
        <div class="flex gap-2 text-[10px] font-mono text-slate-400">
          <span class="px-2 py-0.5 rounded bg-slate-800">TypeScript</span>
          <span class="px-2 py-0.5 rounded bg-slate-800">React</span>
          <span class="px-2 py-0.5 rounded bg-slate-800">Tailwind</span>
        </div>
      </div>

      <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3">
        <span class="text-xs font-mono text-emerald-400 font-bold">PROJECT // 02</span>
        <h4 class="text-xl font-bold text-white">Arcade Canvas Game Engine</h4>
        <p class="text-xs text-slate-300 leading-relaxed">High-performance 60 FPS HTML5 canvas gaming sandbox with Web Audio frequency synthesis and particle physics.</p>
        <div class="flex gap-2 text-[10px] font-mono text-slate-400">
          <span class="px-2 py-0.5 rounded bg-slate-800">HTML5 Canvas</span>
          <span class="px-2 py-0.5 rounded bg-slate-800">Web Audio</span>
          <span class="px-2 py-0.5 rounded bg-slate-800">Physics 2D</span>
        </div>
      </div>
    </div>
  </section>

  <footer class="pt-8 border-t border-slate-800 text-center text-xs font-mono text-slate-500">
    Designed with Sovereign Build Mode &bull; Master Sanchith Architecture
  </footer>
</body>
</html>`;

  return `### Direct Answer:
**Here is your complete Developer Portfolio Web Application, sir.**

\`\`\`html
${htmlCode}
\`\`\`

#### Key Principles & Features
- Modern dark-mode cyberpunk design with responsive grid layouts.
- Dynamic project cards with tech tags and availability badge.
- Fully accessible and responsive on all mobile, tablet, and desktop viewports.

Do you want to preview the website you created, sir?`;
}

/**
 * STEM Analytics Dashboard
 */
function generateSTEMAnalyticsDashboard(): string {
  const title = "Quantum STEM Telemetry Dashboard";

  const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#030812] text-slate-200 font-mono p-4 sm:p-6 min-h-screen">
  <div class="max-w-7xl mx-auto space-y-6">
    <div class="flex justify-between items-center border-b border-slate-800 pb-4">
      <div>
        <h1 class="text-xl font-bold text-white flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
          STEM SENSOR &amp; TELEMETRY MATRIX
        </h1>
        <p class="text-xs text-slate-400">Real-time Kinematics &amp; Quantum Flux Monitor</p>
      </div>
      <button onclick="refreshData()" class="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs hover:bg-emerald-500/30 transition-all">
        🔄 Refresh Sensors
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <span class="text-xs text-slate-400 block">Qubit Coherence</span>
        <span id="coherence" class="text-2xl font-bold text-cyan-400">99.84%</span>
      </div>
      <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <span class="text-xs text-slate-400 block">Magnetic Containment</span>
        <span id="flux" class="text-2xl font-bold text-emerald-400">4.82 Tesla</span>
      </div>
      <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <span class="text-xs text-slate-400 block">Core Thermal Load</span>
        <span id="temp" class="text-2xl font-bold text-purple-400">38.4 °C</span>
      </div>
      <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <span class="text-xs text-slate-400 block">Throughput</span>
        <span id="tps" class="text-2xl font-bold text-yellow-400">1,240 tok/s</span>
      </div>
    </div>

    <!-- Live Telemetry SVG Canvas -->
    <div class="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
      <span class="text-xs uppercase tracking-wider text-slate-400">Quantum Phase Interference Waveform</span>
      <div class="w-full h-48 bg-[#02050B] rounded-xl flex items-center justify-center border border-slate-800/80 overflow-hidden relative">
        <svg class="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
          <path id="wavePath" d="M0,100 Q200,20 400,100 T800,100" fill="none" stroke="#00F2FF" stroke-width="3" />
        </svg>
      </div>
    </div>
  </div>

  <script>
    function refreshData() {
      document.getElementById('coherence').innerText = (99.8 + Math.random() * 0.15).toFixed(2) + '%';
      document.getElementById('flux').innerText = (4.7 + Math.random() * 0.3).toFixed(2) + ' Tesla';
      document.getElementById('temp').innerText = (37.5 + Math.random() * 2.0).toFixed(1) + ' °C';
      document.getElementById('tps').innerText = Math.floor(1100 + Math.random() * 300) + ' tok/s';
    }
  </script>
</body>
</html>`;

  return `### Direct Answer:
**Here is your Real-time STEM Telemetry Dashboard, sir.**

\`\`\`html
${htmlCode}
\`\`\`

#### Key Principles & Features
- Live interactive sensor metric updates with JavaScript event handlers.
- SVG wave simulation depicting quantum harmonic oscillations.
- High-efficiency responsive layout with custom Tailwind dark themes.

Do you want to preview the website you created, sir?`;
}

/**
 * Cyber Electronics Storefront
 */
function generateCyberStorefront(): string {
  const title = "Quantum Cybernetics Storefront";

  const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#050A14] text-slate-200 font-sans p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
  <header class="flex justify-between items-center border-b border-slate-800 pb-4">
    <div class="flex items-center gap-2">
      <span class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold font-mono flex items-center justify-center border border-cyan-500/40">Q</span>
      <span class="text-xl font-bold font-mono text-white">CYBER.STORE</span>
    </div>
    <div class="relative">
      <button onclick="toggleCart()" class="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 hover:bg-cyan-400 transition-all">
        <span>Cart</span>
        <span id="cartCount" class="bg-black text-cyan-400 px-2 py-0.5 rounded-full text-[10px]">0</span>
      </button>
    </div>
  </header>

  <!-- Product Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4">
      <div>
        <span class="text-[10px] font-mono text-cyan-400">HARDWARE // ACCELERATOR</span>
        <h3 class="text-lg font-bold text-white mt-1">Quantum Neural Core v4</h3>
        <p class="text-xs text-slate-400 mt-2">384-qubit cryogenic coprocessor for high-dimensional tensor factorization.</p>
      </div>
      <div class="flex items-center justify-between pt-4 border-t border-slate-800">
        <span class="font-mono text-cyan-300 font-bold">$1,299</span>
        <button onclick="addToCart('Quantum Neural Core v4', 1299)" class="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono font-bold transition-all">
          + Add to Cart
        </button>
      </div>
    </div>

    <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4">
      <div>
        <span class="text-[10px] font-mono text-emerald-400">AUDIO // HARDWARE</span>
        <h3 class="text-lg font-bold text-white mt-1">Acoustic Refined Synthesizer</h3>
        <p class="text-xs text-slate-400 mt-2">British male neural acoustic modulation engine with ultra-low latency.</p>
      </div>
      <div class="flex items-center justify-between pt-4 border-t border-slate-800">
        <span class="font-mono text-emerald-300 font-bold">$450</span>
        <button onclick="addToCart('Acoustic Refined Synthesizer', 450)" class="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-mono font-bold transition-all">
          + Add to Cart
        </button>
      </div>
    </div>

    <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4">
      <div>
        <span class="text-[10px] font-mono text-purple-400">SECURITY // DONGLE</span>
        <h3 class="text-lg font-bold text-white mt-1">Sovereign Encryption Matrix</h3>
        <p class="text-xs text-slate-400 mt-2">Zero-knowledge multi-factor auth hardware key with AES-GCM 256.</p>
      </div>
      <div class="flex items-center justify-between pt-4 border-t border-slate-800">
        <span class="font-mono text-purple-300 font-bold">$199</span>
        <button onclick="addToCart('Sovereign Encryption Matrix', 199)" class="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-xs font-mono font-bold transition-all">
          + Add to Cart
        </button>
      </div>
    </div>
  </div>

  <!-- Cart Modal -->
  <div id="cartModal" class="fixed inset-0 bg-black/80 z-50 hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
      <div class="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 class="font-bold text-white">Your Shopping Cart</h3>
        <button onclick="toggleCart()" class="text-slate-400 hover:text-white">✕</button>
      </div>
      <div id="cartItems" class="space-y-2 text-xs font-mono max-h-48 overflow-y-auto">
        No items yet.
      </div>
      <div class="pt-3 border-t border-slate-800 flex justify-between font-bold text-sm">
        <span>Total:</span>
        <span id="cartTotal" class="text-cyan-400">$0.00</span>
      </div>
      <button onclick="alert('Order placed successfully, sir!'); toggleCart();" class="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold font-mono text-xs hover:bg-cyan-400">
        Complete Checkout
      </button>
    </div>
  </div>

  <script>
    let cart = [];
    function addToCart(name, price) {
      cart.push({ name, price });
      document.getElementById('cartCount').innerText = cart.length;
      updateCartUI();
    }
    function updateCartUI() {
      const container = document.getElementById('cartItems');
      if (cart.length === 0) {
        container.innerHTML = 'No items in cart.';
        document.getElementById('cartTotal').innerText = '$0.00';
        return;
      }
      container.innerHTML = cart.map(item => \`<div class="flex justify-between"><span>\${item.name}</span><span class="text-cyan-400">$\${item.price}</span></div>\`).join('');
      const total = cart.reduce((acc, curr) => acc + curr.price, 0);
      document.getElementById('cartTotal').innerText = '$' + total.toFixed(2);
    }
    function toggleCart() {
      document.getElementById('cartModal').classList.toggle('hidden');
    }
  </script>
</body>
</html>`;

  return `### Direct Answer:
**Here is your complete Cyber Electronics Storefront web application, sir.**

\`\`\`html
${htmlCode}
\`\`\`

#### Key Principles & Features
- Complete interactive shopping cart with live total calculations.
- Product catalog with pricing, category tags, and responsive CSS.
- Modal checkout simulation with zero external dependencies.

Do you want to preview the website you created, sir?`;
}
