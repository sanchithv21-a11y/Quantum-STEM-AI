import React, { useState } from "react";
import {
  BookOpen,
  Sparkles,
  Search,
  Atom,
  FlaskConical,
  Dna,
  Globe2,
  Orbit,
  Calculator,
  Lightbulb,
  ArrowRight,
  Send,
  HelpCircle,
  Flame,
  Zap,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  Compass,
  Layers,
  Volume2,
  VolumeX,
  X,
  ChevronRight,
  Loader2,
  Bot
} from "lucide-react";
import { QuantumThemeMode, STEMDomain, ChatMessage } from "../types";
import { KaTeXRenderer } from "../utils/katexRenderer";

interface QuantumBasicDeskProps {
  onSendQuery: (prompt: string, domain?: STEMDomain) => void;
  messages?: ChatMessage[];
  isProcessing?: boolean;
  onSpeakMessage?: (text: string) => void;
  themeMode?: QuantumThemeMode;
}

interface ScienceTopic {
  id: string;
  category: "physics" | "chemistry" | "biology" | "space" | "math" | "earth";
  categoryLabel: string;
  categoryIcon: any;
  title: string;
  simpleExplanation: string;
  coreFormulaOrConcept: string;
  everydayExample: string;
  quickQuestions: string[];
  keywords?: string[];
}

const SCIENCE_TOPICS: ScienceTopic[] = [
  // Physics: Light & Optics
  {
    id: "nature-of-light",
    category: "physics",
    categoryLabel: "Physics (Class 6-12)",
    categoryIcon: Atom,
    title: "Light: Nature, Reflection, Refraction & Photons",
    simpleExplanation: "Light is a form of electromagnetic energy that travels in straight lines at 300,000 km/s. It behaves both as a wave (reflecting and refracting) and as particle packets called photons.",
    coreFormulaOrConcept: "Speed of Light c ≈ 3 × 10⁸ m/s  |  Photon Energy E = hν = hc/λ  |  ∠i = ∠r",
    everydayExample: "Why straws appear bent in a glass of water (refraction) and how mirrors reflect your image perfectly.",
    quickQuestions: [
      "What is light and what is its speed?",
      "Why is the sky blue and sunsets red?",
      "How does refraction and Snell's law work with lenses?"
    ],
    keywords: ["light", "optics", "reflection", "refraction", "photon", "speed of light", "snell", "mirror", "lens", "ray", "beam", "electromagnetic"]
  },
  {
    id: "why-sky-is-blue",
    category: "physics",
    categoryLabel: "Physics & Atmosphere",
    categoryIcon: Atom,
    title: "Why is the Sky Blue & Rayleigh Scattering",
    simpleExplanation: "Sunlight looks white but contains all rainbow colors. Nitrogen and oxygen gas molecules in Earth's atmosphere scatter short blue wavelengths far more than red wavelengths.",
    coreFormulaOrConcept: "Scattering Intensity ∝ 1 / λ⁴  (Blue scatters ~10× more than red)",
    everydayExample: "Why sunsets look crimson red (sunlight passes through thick atmosphere, scattering away the blues).",
    quickQuestions: [
      "Why is the sky blue during daytime?",
      "Why are sunsets red, orange, and pink?",
      "Why is the sky completely black on the Moon?"
    ],
    keywords: ["sky", "blue", "sunsets", "rayleigh", "scattering", "atmosphere", "color", "rainbow"]
  },
  {
    id: "sound-waves",
    category: "physics",
    categoryLabel: "Physics (Class 8-12)",
    categoryIcon: Zap,
    title: "Sound: Waves, Pitch, Echo & Speed of Sound",
    simpleExplanation: "Sound is a mechanical longitudinal wave made of vibrating air compressions. It travels at ~343 m/s in air, faster in water and steel, but cannot travel through a vacuum.",
    coreFormulaOrConcept: "v = f · λ  |  Speed in air ≈ 343 m/s  |  Audible: 20 Hz to 20,000 Hz",
    everydayExample: "Why you see lightning instantly but hear the thunder rumble a few seconds later.",
    quickQuestions: [
      "What is sound and how does it travel?",
      "What is the minimum distance required to hear an echo?",
      "Why can't sound travel in space?"
    ],
    keywords: ["sound", "wave", "pitch", "echo", "frequency", "acoustics", "ultrasound", "decibel", "vibration", "loudness"]
  },
  {
    id: "electricity-circuits",
    category: "physics",
    categoryLabel: "Physics (Class 8-12)",
    categoryIcon: Zap,
    title: "Electricity, Voltage, Current & Ohm's Law",
    simpleExplanation: "Voltage (V) is the push, Current (I) is the flow of electrons, and Resistance (R) is the opposition. Governed universally by Ohm's Law: V = I × R.",
    coreFormulaOrConcept: "V = I · R  |  Power P = V · I = I²R  |  Current I = Q / t",
    everydayExample: "Think of a garden hose: water pressure is Voltage, water flow rate is Current, and squeezing the hose is Resistance.",
    quickQuestions: [
      "Explain Ohm's Law and calculate V = IR",
      "What is the difference between AC and DC electricity?",
      "Why don't birds get shocked when sitting on power lines?"
    ],
    keywords: ["electricity", "voltage", "current", "resistance", "ohm", "circuit", "amperes", "volts", "power", "battery", "ac", "dc"]
  },
  {
    id: "magnetism-electromagnet",
    category: "physics",
    categoryLabel: "Physics (Class 6-12)",
    categoryIcon: Zap,
    title: "Magnetism, Magnetic Fields & Electromagnets",
    simpleExplanation: "Magnets have North and South poles where opposites attract and likes repel. Electric currents create magnetic fields, which power electric motors and generators.",
    coreFormulaOrConcept: "Magnetic Force F = q(v × B)  |  Right Hand Thumb Rule",
    everydayExample: "How compass needles align with Earth's magnetic core and how maglev bullet trains float on magnetic tracks.",
    quickQuestions: [
      "How does an electromagnet work?",
      "Why does the Earth have a magnetic field?",
      "How do electric motors turn electrical energy into rotation?"
    ],
    keywords: ["magnet", "magnetism", "magnetic", "poles", "electromagnet", "motor", "compass", "solenoid"]
  },
  {
    id: "heat-temperature",
    category: "physics",
    categoryLabel: "Physics (Class 7-11)",
    categoryIcon: Flame,
    title: "Heat, Temperature & 3 Modes of Heat Transfer",
    simpleExplanation: "Heat is thermal energy flowing from hot to cold. Conduction transfers heat through solids, Convection circulates fluids, and Radiation transfers infrared heat across empty space.",
    coreFormulaOrConcept: "Q = m · c · ΔT  |  °F = (°C × 9/5) + 32  |  K = °C + 273.15",
    everydayExample: "Holding a metal spoon in hot soup (conduction), boiling water circulating in a pot (convection), and feeling the Sun's warmth (radiation).",
    quickQuestions: [
      "What is the difference between heat and temperature?",
      "Explain conduction, convection, and radiation with examples",
      "Why does ice float on water instead of sinking?"
    ],
    keywords: ["heat", "temperature", "conduction", "convection", "radiation", "thermal", "celsius", "kelvin", "fahrenheit", "thermodynamics"]
  },
  {
    id: "newtons-laws",
    category: "physics",
    categoryLabel: "Physics (Class 9-11)",
    categoryIcon: Atom,
    title: "Newton's 3 Laws of Motion & Inertia",
    simpleExplanation: "Objects keep their motion (Inertia), net force causes acceleration (F = ma), and every action has an equal and opposite reaction.",
    coreFormulaOrConcept: "F = m · a  |  Action = -Reaction  |  p = m · v",
    everydayExample: "Why seatbelts save lives when a car brakes (inertia) and how rocket exhaust pushing downward launches the rocket upward.",
    quickQuestions: [
      "Explain Newton's three laws of motion step by step",
      "Why does a rocket move forward in space vacuum?",
      "What is inertia and how does it depend on mass?"
    ],
    keywords: ["newton", "force", "inertia", "acceleration", "f=ma", "action", "reaction", "momentum", "motion", "laws of motion"]
  },
  {
    id: "gravity-free-fall",
    category: "physics",
    categoryLabel: "Physics (Class 9-11)",
    categoryIcon: Atom,
    title: "Gravity, Free Fall & Universal Gravitation",
    simpleExplanation: "All masses attract each other. Earth pulls objects toward its center with gravitational acceleration g = 9.8 m/s², while mass remains constant anywhere.",
    coreFormulaOrConcept: "F = G · (m₁m₂) / r²  |  g = 9.8 m/s²  |  Weight W = m · g",
    everydayExample: "Why an apple falls from a tree and why you weigh 6 times less on the Moon even though your mass is identical.",
    quickQuestions: [
      "What is gravity and why do all objects fall at 9.8 m/s² in vacuum?",
      "What is the exact difference between mass and weight?",
      "Why do astronauts float inside the International Space Station?"
    ],
    keywords: ["gravity", "gravitation", "weight", "mass", "free fall", "acceleration", "g=9.8", "newton", "falling"]
  },
  {
    id: "kinematics-equations",
    category: "physics",
    categoryLabel: "Physics (Class 9-11)",
    categoryIcon: Atom,
    title: "Kinematics & 3 Equations of Motion",
    simpleExplanation: "The mathematical relationships between initial speed (u), final speed (v), acceleration (a), time (t), and distance (s) under constant acceleration.",
    coreFormulaOrConcept: "v = u + at  |  s = ut + ½at²  |  v² = u² + 2as",
    everydayExample: "Calculating a car's emergency braking stopping distance or how high a thrown cricket ball reaches.",
    quickQuestions: [
      "Derive the 3 equations of motion step by step",
      "How to calculate the time taken for a dropped stone to hit the ground?",
      "What is the trajectory and range of a projectile?"
    ],
    keywords: ["kinematics", "equations of motion", "speed", "velocity", "acceleration", "v=u+at", "distance", "displacement", "derivation"]
  },
  {
    id: "work-energy-theorem",
    category: "physics",
    categoryLabel: "Physics (Class 9-11)",
    categoryIcon: Zap,
    title: "Work, Kinetic Energy & Conservation of Energy",
    simpleExplanation: "Energy cannot be created or destroyed, only transformed. Work done equals force times distance, which converts into kinetic or potential energy.",
    coreFormulaOrConcept: "Work W = F · d  |  K.E. = ½mv²  |  P.E. = mgh",
    everydayExample: "A rollercoaster trading potential energy at the hilltop for maximum kinetic speed at the bottom.",
    quickQuestions: [
      "Derive the formula for Kinetic Energy (Ek = 1/2 mv²)",
      "Explain the Law of Conservation of Energy with a pendulum",
      "What is the difference between Work, Energy, and Power?"
    ],
    keywords: ["work", "energy", "kinetic", "potential", "conservation of energy", "power", "joules", "ke", "pe"]
  },
  {
    id: "pressure-buoyancy",
    category: "physics",
    categoryLabel: "Physics (Class 8-11)",
    categoryIcon: Atom,
    title: "Pressure, Atmospheric Pressure & Archimedes' Principle",
    simpleExplanation: "Pressure is force per unit area. Fluids exert an upward buoyant force equal to the weight of displaced fluid, determining whether objects float or sink.",
    coreFormulaOrConcept: "Pressure P = Force / Area = ρgh  |  Buoyant Force F_b = ρ · V · g",
    everydayExample: "Why huge steel ships float on the ocean while a small solid pebble sinks to the bottom.",
    quickQuestions: [
      "State and explain Archimedes' Principle with floating ships",
      "Why do sharp knives cut easier than blunt knives? (P = F/A)",
      "How does atmospheric pressure change with altitude?"
    ],
    keywords: ["pressure", "buoyancy", "archimedes", "float", "sink", "fluid", "density", "pascal", "atmosphere", "hydraulic"]
  },
  {
    id: "quantum-wave-particle",
    category: "physics",
    categoryLabel: "Physics (Class 11-12 & College)",
    categoryIcon: Atom,
    title: "Quantum Mechanics: Wave-Particle Duality & Uncertainty",
    simpleExplanation: "Matter and light exhibit both wave-like and particle-like behaviors (de Broglie hypothesis λ = h/p). Heisenberg's uncertainty principle proves one cannot simultaneously measure exact position and momentum with arbitrary precision.",
    coreFormulaOrConcept: "de Broglie: λ = h / p  |  Uncertainty: Δx · Δp ≥ ℏ / 2  |  Photon Energy: E = hν",
    everydayExample: "Electron microscopes utilize electron matter waves instead of light to image viruses 1,000× smaller than optical microscopes can resolve.",
    quickQuestions: [
      "Explain wave-particle duality and the double-slit experiment",
      "Derive de Broglie's matter wavelength formula",
      "What is Heisenberg's uncertainty principle and why does it occur?"
    ],
    keywords: ["quantum", "wave particle duality", "heisenberg", "uncertainty principle", "de broglie", "planck", "double slit", "matter waves", "electron microscope"]
  },
  {
    id: "thermodynamics-entropy",
    category: "physics",
    categoryLabel: "Physics (Class 11-12)",
    categoryIcon: Flame,
    title: "Thermodynamics: Heat Engines, Carnot Efficiency & Entropy",
    simpleExplanation: "Thermodynamics governs heat and work. The First Law states energy conservation; the Second Law states the total entropy (disorder) of an isolated system always increases over time.",
    coreFormulaOrConcept: "First Law: ΔU = Q - W  |  Entropy: ΔS ≥ 0  |  Carnot Efficiency: η = 1 - (T_C / T_H)",
    everydayExample: "Why ice cubes melt into warm water spontaneously, but lukewarm water never spontaneously separates into boiling water and ice cubes.",
    quickQuestions: [
      "What is entropy and the Second Law of Thermodynamics?",
      "Derive the maximum efficiency of a Carnot heat engine",
      "Explain the Zeroth, First, and Second laws of thermodynamics with examples"
    ],
    keywords: ["thermodynamics", "entropy", "carnot", "heat engine", "efficiency", "second law", "first law", "internal energy", "kelvin", "absolute zero"]
  },
  {
    id: "bernoulli-fluid-dynamics",
    category: "physics",
    categoryLabel: "Physics (Class 11-12)",
    categoryIcon: Atom,
    title: "Fluid Dynamics: Bernoulli's Principle & Aerodynamic Lift",
    simpleExplanation: "As fluid velocity increases, static pressure decreases simultaneously. Airfoil airplane wings force air to travel faster over the curved top, creating lower pressure and generating upward aerodynamic lift.",
    coreFormulaOrConcept: "P + ½ρv² + ρgh = constant  |  Continuity: A₁v₁ = A₂v₂",
    everydayExample: "How 400-ton Boeing 747 aircraft achieve flight, and how baseball pitchers throw curveballs via the Magnus effect.",
    quickQuestions: [
      "State and derive Bernoulli's equation from the work-energy theorem",
      "How does an airplane wing generate aerodynamic lift?",
      "What is the Venturi effect and equation of continuity in flowing fluids?"
    ],
    keywords: ["bernoulli", "fluid dynamics", "aerodynamics", "lift", "venturi", "continuity", "viscosity", "airfoil", "magnus effect", "pressure"]
  },
  {
    id: "special-relativity",
    category: "physics",
    categoryLabel: "Physics & Modern Relativity",
    categoryIcon: Atom,
    title: "Special Relativity: Time Dilation & Mass-Energy Equivalence (E = mc²)",
    simpleExplanation: "Einstein proved that the speed of light (c) is identical for all observers. Clocks moving close to the speed of light tick slower (time dilation) and distances shorten (length contraction).",
    coreFormulaOrConcept: "E = mc²  |  Time Dilation: Δt' = γ · Δt  |  Lorentz Factor: γ = 1 / √(1 - v²/c²)",
    everydayExample: "GPS satellite atomic clocks must be mathematically adjusted every day for Einstein's time dilation; otherwise smartphone navigation would drift by 10 km daily.",
    quickQuestions: [
      "Explain Einstein's special theory of relativity and time dilation",
      "Derive E = mc² and mass-energy equivalence step by step",
      "Explain the twin paradox in relativistic physics"
    ],
    keywords: ["relativity", "special relativity", "einstein", "time dilation", "length contraction", "lorentz", "e=mc2", "speed of light", "twin paradox"]
  },
  {
    id: "electromagnetic-spectrum",
    category: "physics",
    categoryLabel: "Physics (Class 8-12)",
    categoryIcon: Zap,
    title: "Electromagnetic Spectrum: Radio Waves to Gamma Rays",
    simpleExplanation: "Electromagnetic radiation travels at 300,000 km/s in vacuum, spanning radio waves, microwaves, infrared, visible light, ultraviolet, X-rays, and gamma rays with increasing frequency and photon energy.",
    coreFormulaOrConcept: "Wave Equation: c = ν · λ  |  Photon Energy: E = hν = hc / λ  (c ≈ 3 × 10⁸ m/s)",
    everydayExample: "Microwave ovens heat water molecules at 2.45 GHz, Wi-Fi transmits at 5 GHz, and hospital dental X-rays pass through soft flesh to image teeth.",
    quickQuestions: [
      "List all 7 regions of the electromagnetic spectrum in order of wavelength and energy",
      "How do microwave ovens heat food without burning the bowl?",
      "Why are ultraviolet, X-rays, and gamma rays considered ionizing radiation?"
    ],
    keywords: ["electromagnetic", "em spectrum", "radio", "microwave", "infrared", "ultraviolet", "x-ray", "gamma ray", "wavelength", "frequency", "photon"]
  },

  // Chemistry
  {
    id: "atomic-structure",
    category: "chemistry",
    categoryLabel: "Chemistry (Class 8-12)",
    categoryIcon: FlaskConical,
    title: "Structure of the Atom: Protons, Neutrons & Electrons",
    simpleExplanation: "Atoms have a dense central nucleus of positive protons and neutral neutrons, surrounded by negative electrons orbiting in energy shells (2, 8, 18, 32).",
    coreFormulaOrConcept: "Atomic Number Z = Protons  |  Mass Number A = Protons + Neutrons",
    everydayExample: "Everything around you—air, water, your body, and computer screens—is made of bonded atoms.",
    quickQuestions: [
      "What is an atom made of and what are subatomic particles?",
      "What are valence electrons and the octet rule?",
      "What are isotopes with examples like Carbon-12 and Carbon-14?"
    ],
    keywords: ["atom", "atomic", "proton", "neutron", "electron", "nucleus", "bohr", "subatomic", "isotope", "valence"]
  },
  {
    id: "states-of-matter",
    category: "chemistry",
    categoryLabel: "Chemistry (Class 6-9)",
    categoryIcon: FlaskConical,
    title: "States of Matter: Solid, Liquid, Gas & Plasma",
    simpleExplanation: "Matter exists in states depending on particle kinetic energy and intermolecular forces: Solids (rigid), Liquids (flow), Gases (expand), and Plasma (ionized gas).",
    coreFormulaOrConcept: "Melting → Evaporation → Condensation → Freezing → Sublimation",
    everydayExample: "Dry ice (solid CO₂) turning directly into gas without melting (sublimation) and steam powering turbines.",
    quickQuestions: [
      "What are the differences between solid, liquid, gas, and plasma?",
      "What is sublimation and deposition with examples?",
      "What is Brownian motion and diffusion?"
    ],
    keywords: ["matter", "solid", "liquid", "gas", "plasma", "melting", "boiling", "evaporation", "sublimation", "phase"]
  },
  {
    id: "chemical-reactions",
    category: "chemistry",
    categoryLabel: "Chemistry (Class 9-12)",
    categoryIcon: FlaskConical,
    title: "Chemical Equations, Balancing & Mole Concept",
    simpleExplanation: "Mass is always conserved in chemical reactions. Chemists use moles (6.022 × 10²³ particles) to count reacting atoms and balance equations.",
    coreFormulaOrConcept: "1 Mole = 6.022 × 10²³ particles  |  Moles = Mass / Molar Mass",
    everydayExample: "Rusting of iron (4Fe + 3O₂ → 2Fe₂O₃) and baking soda reacting with vinegar to produce CO₂ gas bubbles.",
    quickQuestions: [
      "How to balance chemical equations step by step?",
      "What is the mole concept and Avogadro's number?",
      "What is the difference between exothermic and endothermic reactions?"
    ],
    keywords: ["chemical reaction", "equation", "balancing", "mole", "avogadro", "stoichiometry", "exothermic", "endothermic", "rusting"]
  },
  {
    id: "acids-bases-ph",
    category: "chemistry",
    categoryLabel: "Chemistry (Class 7-12)",
    categoryIcon: FlaskConical,
    title: "Acids, Bases, Salts & The pH Scale (0-14)",
    simpleExplanation: "Acids taste sour and release H⁺ ions (pH < 7). Bases taste bitter and release OH⁻ ions (pH > 7). Mixing them creates neutral water and salt.",
    coreFormulaOrConcept: "pH = -log[H⁺]  |  Acid + Base → Salt + Water (Neutralization)",
    everydayExample: "Taking antacid tablets (base) to neutralize stomach acid (HCl), and lemon juice / vinegar as natural acids.",
    quickQuestions: [
      "What is the pH scale and how does it measure acidity?",
      "What happens during a neutralization reaction?",
      "How do litmus paper and natural indicators work?"
    ],
    keywords: ["acid", "base", "ph", "salt", "neutralization", "litmus", "indicator", "alkali", "hydrogen ion"]
  },
  {
    id: "periodic-table-trends",
    category: "chemistry",
    categoryLabel: "Chemistry (Class 9-12)",
    categoryIcon: FlaskConical,
    title: "The Periodic Table: Groups, Periods & Trends",
    simpleExplanation: "Elements are arranged by atomic number into rows (periods) and columns (groups) that share similar valence electron properties, from reactive alkali metals to noble gases.",
    coreFormulaOrConcept: "Periodic Law: Properties are periodic functions of atomic numbers",
    everydayExample: "Why neon signs glow stably (noble gas) while pure sodium metal explodes in contact with water.",
    quickQuestions: [
      "How is the modern periodic table organized?",
      "What are periodic trends in atomic radius and electronegativity?",
      "What is the difference between metals, non-metals, and metalloids?"
    ],
    keywords: ["periodic table", "elements", "groups", "periods", "metals", "nonmetals", "noble gas", "mendeleev", "electronegativity"]
  },
  {
    id: "chemical-bonding",
    category: "chemistry",
    categoryLabel: "Chemistry (Class 9-12)",
    categoryIcon: FlaskConical,
    title: "Chemical Bonding: Ionic vs Covalent Bonds",
    simpleExplanation: "Atoms bond to achieve full outer shells (octet rule). Ionic bonds transfer electrons between metals and non-metals; Covalent bonds share electrons between non-metals.",
    coreFormulaOrConcept: "Ionic: Na⁺ + Cl⁻ → NaCl  |  Covalent: H· + ·H → H₂",
    everydayExample: "Table salt (NaCl crystals formed by ionic attraction) and water (H₂O molecules formed by covalent sharing).",
    quickQuestions: [
      "What is the difference between ionic and covalent bonding?",
      "Why does table salt have a high melting point?",
      "What are polar covalent molecules like water?"
    ],
    keywords: ["bonding", "ionic", "covalent", "molecule", "compound", "electron sharing", "salt", "octet"]
  },
  {
    id: "organic-chemistry-functional-groups",
    category: "chemistry",
    categoryLabel: "Chemistry (Class 10-12)",
    categoryIcon: FlaskConical,
    title: "Organic Chemistry: Hydrocarbons, Functional Groups & Isomerism",
    simpleExplanation: "Carbon's unique tetravalency allows it to form vast chains, rings, and branched polymers. Characteristic functional groups (-OH alcohols, -COOH carboxylic acids, -CHO aldehydes) determine chemical properties.",
    coreFormulaOrConcept: "Alkanes: C_n H_{2n+2}  |  Alkenes: C_n H_{2n}  |  Alkynes: C_n H_{2n-2}  |  Isomerism",
    everydayExample: "Ethanol (in hand sanitizers and beverages), acetic acid (in household vinegar), and polymer plastics like polyethylene.",
    quickQuestions: [
      "What are functional groups in organic chemistry with examples?",
      "What is the difference between structural isomers and stereoisomers?",
      "Explain IUPAC nomenclature rules for naming organic compounds"
    ],
    keywords: ["organic chemistry", "hydrocarbon", "alkane", "alkene", "alkyne", "functional group", "alcohol", "carboxylic acid", "isomer", "iupac", "carbon"]
  },
  {
    id: "electrochemistry-redox-batteries",
    category: "chemistry",
    categoryLabel: "Chemistry (Class 10-12)",
    categoryIcon: FlaskConical,
    title: "Electrochemistry: Redox Reactions, Galvanic Cells & Batteries",
    simpleExplanation: "Oxidation is loss of electrons (OIL) and Reduction is gain of electrons (RIG). Galvanic cells channel spontaneous electron transfers through external circuits to produce usable electric current.",
    coreFormulaOrConcept: "Cell EMF: E°_cell = E°_cathode - E°_anode  |  Free Energy: ΔG° = -nFE°  |  Nernst Equation",
    everydayExample: "Lithium-ion batteries in smartphones shuttling Li⁺ ions between cathode and anode during charging and discharging.",
    quickQuestions: [
      "How does a Daniell galvanic cell produce electric current?",
      "What is oxidation and reduction (OIL RIG) with balanced half-reactions?",
      "How does the Nernst equation calculate cell potential under non-standard conditions?"
    ],
    keywords: ["electrochemistry", "redox", "galvanic cell", "battery", "anode", "cathode", "oxidation", "reduction", "nernst", "emf", "lithium ion"]
  },
  {
    id: "chemical-equilibrium-le-chatelier",
    category: "chemistry",
    categoryLabel: "Chemistry (Class 11-12)",
    categoryIcon: FlaskConical,
    title: "Chemical Equilibrium & Le Chatelier's Principle",
    simpleExplanation: "When forward and reverse reaction rates balance, chemical equilibrium is reached. Le Chatelier's Principle states that if temperature, pressure, or concentration changes, the system shifts to counteract the stress.",
    coreFormulaOrConcept: "Equilibrium Constant: K_c = [C]^c [D]^d / ([A]^a [B]^b)  |  Reaction Quotient: Q vs K",
    everydayExample: "The industrial Haber process for ammonia synthesis (N₂ + 3H₂ ⇌ 2NH₃) operates under 200 atm high pressure to shift equilibrium toward ammonia product.",
    quickQuestions: [
      "State and explain Le Chatelier's Principle with examples",
      "How do changes in temperature and pressure shift equilibrium in gas reactions?",
      "What is the difference between reaction quotient Q and equilibrium constant K?"
    ],
    keywords: ["equilibrium", "le chatelier", "haber process", "reversible reaction", "reaction quotient", "kc", "kp", "dynamic equilibrium"]
  },
  {
    id: "solutions-colligative-properties",
    category: "chemistry",
    categoryLabel: "Chemistry (Class 9-12)",
    categoryIcon: FlaskConical,
    title: "Solutions, Molarity & Colligative Properties",
    simpleExplanation: "Colligative properties depend solely on the concentration of dissolved solute particles, not their identity: vapor pressure lowering, boiling point elevation, freezing point depression, and osmotic pressure.",
    coreFormulaOrConcept: "ΔT_f = i · K_f · m  |  ΔT_b = i · K_b · m  |  Osmotic Pressure: Π = iCRT",
    everydayExample: "Spreading salt on icy winter roads to lower the freezing point of water and melt treacherous road ice.",
    quickQuestions: [
      "What are colligative properties and the van 't Hoff factor (i)?",
      "Why does road salt melt ice in freezing sub-zero winter temperatures?",
      "What is osmotic pressure and how does reverse osmosis desalinate seawater?"
    ],
    keywords: ["solution", "molarity", "molality", "colligative", "freezing point depression", "boiling point elevation", "osmotic pressure", "van t hoff", "solute"]
  },

  // Biology & Life Sciences
  {
    id: "cell-structure",
    category: "biology",
    categoryLabel: "Biology (Class 6-12)",
    categoryIcon: Dna,
    title: "The Living Cell & Organelles (Mitochondria, Nucleus)",
    simpleExplanation: "The cell is the basic structural unit of life. The Nucleus stores DNA blueprints, Mitochondria generate ATP energy, and the Membrane controls transport.",
    coreFormulaOrConcept: "Cell Theory: All life is made of cells  |  Plant Cell (Wall + Chloroplast) vs Animal Cell",
    everydayExample: "Muscle cells contain thousands of mitochondria to supply energy for running and physical activity.",
    quickQuestions: [
      "What is a cell and what are its main organelles?",
      "Why is the mitochondrion called the powerhouse of the cell?",
      "What are the key differences between plant and animal cells?"
    ],
    keywords: ["cell", "mitochondria", "nucleus", "organelle", "membrane", "cytoplasm", "ribosome", "plant cell", "animal cell", "atp"]
  },
  {
    id: "photosynthesis",
    category: "biology",
    categoryLabel: "Biology (Class 7-12)",
    categoryIcon: Dna,
    title: "Photosynthesis: How Plants Make Food & Oxygen",
    simpleExplanation: "Plants use green chlorophyll to absorb sunlight, combining carbon dioxide from air and water from roots into glucose sugar, releasing oxygen for us to breathe.",
    coreFormulaOrConcept: "6 CO₂ + 6 H₂O + Sunlight → C₆H₁₂O₆ (Glucose) + 6 O₂",
    everydayExample: "Every breath you take contains oxygen generated by trees, phytoplankton in the oceans, and green plants!",
    quickQuestions: [
      "How does photosynthesis work step by step?",
      "What is chlorophyll and how do stomata regulate gas exchange?",
      "How does cellular respiration differ from photosynthesis?"
    ],
    keywords: ["photosynthesis", "chlorophyll", "plants", "glucose", "oxygen", "stomata", "carbon dioxide", "autotroph"]
  },
  {
    id: "cellular-respiration",
    category: "biology",
    categoryLabel: "Biology (Class 9-12)",
    categoryIcon: Dna,
    title: "Cellular Respiration & ATP Energy Production",
    simpleExplanation: "Cells break down glucose with oxygen to produce chemical energy packets called ATP, powering muscle contractions, brain thought, and cell repair.",
    coreFormulaOrConcept: "C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + 36-38 ATP Energy",
    everydayExample: "Why you breathe heavier during intense exercise to supply oxygen and prevent lactic acid cramps.",
    quickQuestions: [
      "What is cellular respiration and how is ATP produced?",
      "What is the difference between aerobic and anaerobic respiration?",
      "Why do muscles cramp during heavy sprinting (lactic acid)?"
    ],
    keywords: ["respiration", "atp", "aerobic", "anaerobic", "energy", "glucose", "glycolysis", "krebs", "lactic acid"]
  },
  {
    id: "human-circulatory",
    category: "biology",
    categoryLabel: "Biology (Class 7-12)",
    categoryIcon: Dna,
    title: "Human Body: Heart, Blood Circulation & Lungs",
    simpleExplanation: "The human heart has 4 chambers pumping oxygen-rich blood through arteries to body organs and pumping deoxygenated blood through veins to lungs for gas exchange.",
    coreFormulaOrConcept: "4 Chambers: Right/Left Atria & Ventricles  |  Double Circulation",
    everydayExample: "Why your pulse rate increases during exercise to pump extra oxygen and glucose to working muscle cells.",
    quickQuestions: [
      "How does double circulation work in the human heart?",
      "What are the roles of red blood cells, white blood cells, and platelets?",
      "How do alveoli in lungs exchange oxygen and carbon dioxide?"
    ],
    keywords: ["heart", "blood", "circulation", "artery", "vein", "lungs", "alveoli", "rbc", "wbc", "platelets", "pulse"]
  },
  {
    id: "dna-genetics",
    category: "biology",
    categoryLabel: "Biology (Class 9-12)",
    categoryIcon: Dna,
    title: "DNA, Genes & Mendel's Laws of Inheritance",
    simpleExplanation: "DNA is a double-helix code (A-T, C-G) carrying instructions for building all proteins. Gregor Mendel discovered how dominant and recessive traits pass from parents to offspring.",
    coreFormulaOrConcept: "Base Pairing: A=T | C≡G  |  Monohybrid Phenotypic Ratio = 3:1",
    everydayExample: "Why children share traits like eye color, height, blood group, and curly hair with biological parents.",
    quickQuestions: [
      "What is DNA and how does it code for biological traits?",
      "What are Mendel's laws of inheritance and Punnett squares?",
      "What is the difference between dominant and recessive alleles?"
    ],
    keywords: ["dna", "genetics", "gene", "chromosome", "heredity", "mendel", "allele", "dominant", "recessive", "punnett"]
  },
  {
    id: "ecosystems-food-web",
    category: "biology",
    categoryLabel: "Ecology & Biology",
    categoryIcon: Dna,
    title: "Ecosystems, Food Chains & The 10% Energy Rule",
    simpleExplanation: "Sunlight powers plant producers, which are eaten by herbivores (primary consumers), then carnivores. Only about 10% of energy transfers from one trophic level to the next.",
    coreFormulaOrConcept: "Producers → Herbivores → Carnivores → Decomposers (10% Energy Law)",
    everydayExample: "Why top predators like lions and eagles are few in number compared to vast herds of zebras and grass.",
    quickQuestions: [
      "What is the difference between a food chain and a food web?",
      "Explain the 10% energy transfer rule across trophic levels",
      "Why are decomposers like fungi and bacteria vital to ecosystems?"
    ],
    keywords: ["ecosystem", "food chain", "food web", "trophic", "energy pyramid", "producers", "consumers", "ecology"]
  },
  {
    id: "nervous-system-neurons",
    category: "biology",
    categoryLabel: "Biology & Neurobiology",
    categoryIcon: Dna,
    title: "Human Nervous System: Neurons, Action Potentials & Synapses",
    simpleExplanation: "Neurons transmit electrical nerve impulses across the body. Voltage-gated sodium/potassium ion channels trigger rapid action potentials (-70 mV resting to +40 mV peak), triggering neurotransmitter release across synaptic junctions.",
    coreFormulaOrConcept: "Resting: -70 mV  |  Threshold: -55 mV  |  Na⁺/K⁺ ATPase Pump (3 Na⁺ out / 2 K⁺ in)",
    everydayExample: "Pulling your hand away instantly within 20 milliseconds before you consciously feel pain after touching a hot iron stove (reflex arc).",
    quickQuestions: [
      "How do neurons generate and propagate action potentials?",
      "What are chemical synapses and how do neurotransmitters like dopamine and serotonin work?",
      "Explain the sensory-motor reflex arc mechanism"
    ],
    keywords: ["neuron", "nervous system", "action potential", "synapse", "brain", "neurotransmitter", "dopamine", "reflex", "axon", "dendrite"]
  },
  {
    id: "immune-system-vaccines",
    category: "biology",
    categoryLabel: "Biology & Immunology",
    categoryIcon: Dna,
    title: "The Immune System: Antibodies, T-Cells, B-Cells & Vaccines",
    simpleExplanation: "Innate immunity provides general physical/chemical defense, while adaptive immunity deploys B-lymphocytes (producing tailored Y-shaped antibodies) and cytotoxic T-cells. Vaccines train immunological memory cells safely.",
    coreFormulaOrConcept: "Antigen-Antibody Specificity  |  Humoral Immunity (B-cells) + Cell-Mediated (T-cells) + Memory Cells",
    everydayExample: "Vaccines against measles, polio, or mRNA vaccines teach your body's immune system to neutralize pathogens without ever experiencing the disease.",
    quickQuestions: [
      "What is the difference between innate and adaptive immunity?",
      "How do antibodies identify and neutralize foreign viruses and bacteria?",
      "How do mRNA and traditional vaccines confer long-lasting immunity?"
    ],
    keywords: ["immune system", "antibodies", "vaccine", "white blood cells", "t cells", "b cells", "pathogen", "antigen", "lymphocyte", "immunity"]
  },
  {
    id: "evolution-natural-selection",
    category: "biology",
    categoryLabel: "Evolutionary Biology",
    categoryIcon: Dna,
    title: "Evolution by Natural Selection & Darwinian Adaptation",
    simpleExplanation: "Organisms with hereditary traits better suited to their survival reproduce more successfully. Over generations, this differential reproductive success drives adaptation, speciation, and biodiversity.",
    coreFormulaOrConcept: "Genetic Variation + Environmental Pressure + Differential Reproduction = Evolution",
    everydayExample: "Bacteria evolving antibiotic resistance against penicillin, and Darwin's finches developing specialized beaks to crack distinct island seeds.",
    quickQuestions: [
      "Explain Darwin's theory of evolution by natural selection step by step",
      "What are homologous, analogous, and vestigial structures?",
      "How do antibiotic-resistant superbug bacteria evolve so rapidly?"
    ],
    keywords: ["evolution", "darwin", "natural selection", "adaptation", "speciation", "fittest", "homologous", "mutation", "genetics", "finches"]
  },
  {
    id: "enzymes-biocatalysis",
    category: "biology",
    categoryLabel: "Biochemistry & Biology",
    categoryIcon: Dna,
    title: "Enzymes & Biochemical Catalysis (Lock-and-Key Model)",
    simpleExplanation: "Enzymes are specialized protein catalysts that accelerate metabolic reactions millions of times by dramatically lowering activation energy. Substrates bind tightly to active sites.",
    coreFormulaOrConcept: "E + S ⇌ [ES] → E + P  |  Michaelis-Menten: v = (V_max · [S]) / (K_m + [S])",
    everydayExample: "Salivary amylase immediately breaking down starchy bread into sweet maltose and glucose while you chew.",
    quickQuestions: [
      "How do enzymes lower activation energy for metabolic biochemical reactions?",
      "What is the lock-and-key model versus induced-fit model?",
      "How do temperature, pH, and competitive inhibitors regulate enzyme activity?"
    ],
    keywords: ["enzyme", "catalyst", "substrate", "active site", "activation energy", "michaelis menten", "lock and key", "protein", "denaturation"]
  },
  {
    id: "crispr-gene-editing",
    category: "biology",
    categoryLabel: "Genetics & Biotechnology",
    categoryIcon: Dna,
    title: "CRISPR-Cas9 & Precision Genetic Engineering",
    simpleExplanation: "Adapted from bacterial antiviral defenses, CRISPR-Cas9 uses a guide RNA (gRNA) to locate exact DNA sequences, where Cas9 molecular scissors cut and allow scientists to repair or rewrite genes.",
    coreFormulaOrConcept: "Target DNA Recognition: PAM (NGG) + Guide RNA (20 nt) → Cas9 Double-Strand Cut",
    everydayExample: "Using CRISPR to cure sickle cell anemia by editing patient bone marrow blood stem cells to produce healthy fetal hemoglobin.",
    quickQuestions: [
      "What is CRISPR-Cas9 and how was it discovered in bacteria?",
      "How does guide RNA direct the Cas9 endonuclease to target DNA?",
      "What are real-world therapeutic applications and ethical considerations of gene editing?"
    ],
    keywords: ["crispr", "cas9", "gene editing", "genetic engineering", "biotechnology", "guide rna", "dna repair", "sickle cell", "genome"]
  },

  // Space & Astronomy
  {
    id: "solar-system-planets",
    category: "space",
    categoryLabel: "Space & Astronomy",
    categoryIcon: Orbit,
    title: "The Solar System, Sun & 8 Orbiting Planets",
    simpleExplanation: "The Sun contains 99.86% of the solar system's mass. 4 rocky inner planets (Mercury, Venus, Earth, Mars) and 4 outer gas/ice giants (Jupiter, Saturn, Uranus, Neptune) orbit it.",
    coreFormulaOrConcept: "Gravitational Attraction F = G · (m₁m₂) / r²  |  1 AU ≈ 150 million km  |  Kepler: T² ∝ r³",
    everydayExample: "The Moon's gravitational pull on Earth causes the daily ocean tides rising and falling twice a day.",
    quickQuestions: [
      "What are the 8 planets in order from the Sun?",
      "Why is Venus the hottest planet even though Mercury is closer to the Sun?",
      "How do solar and lunar eclipses occur?"
    ],
    keywords: ["solar system", "planets", "sun", "moon", "earth", "mars", "jupiter", "venus", "orbit", "gravity", "eclipse", "mercury", "saturn", "uranus", "neptune"]
  },
  {
    id: "sun-fusion-solar-physics",
    category: "space",
    categoryLabel: "Space & Solar Physics",
    categoryIcon: Orbit,
    title: "The Sun: Solar Core, Corona & Nuclear Fusion",
    simpleExplanation: "The Sun fuses 600 million tons of hydrogen into helium every second at its 15 million Kelvin core, releasing radiant energy governed by Einstein's E = mc² that travels to Earth in 8 min 20 sec.",
    coreFormulaOrConcept: "4 ¹H + 2e⁻ → ⁴He + 2ν_e + 6γ + 26.7 MeV  |  E = Δm · c²",
    everydayExample: "Every ray of warmth and light on Earth was forged inside the Sun's core thousands of years ago.",
    quickQuestions: [
      "How does nuclear fusion generate energy in the Sun's core?",
      "What are sunspots, solar flares, and coronal mass ejections?",
      "Why is the Sun's outer corona millions of degrees hotter than its surface?"
    ],
    keywords: ["sun", "solar", "nuclear fusion", "proton proton chain", "photosphere", "corona", "sunspots", "solar flare", "solar wind"]
  },
  {
    id: "moon-phases-tides-eclipses",
    category: "space",
    categoryLabel: "Space & Lunar Science",
    categoryIcon: Orbit,
    title: "The Moon: Lunar Phases, Ocean Tides & Eclipses",
    simpleExplanation: "The Moon orbits Earth every 27.3 days and is tidally locked (always showing the same face). Its gravitational tidal pull raises ocean bulges twice a day.",
    coreFormulaOrConcept: "Tidal Force ∝ M / r³  (Moon tidal pull is 2.2× stronger than the Sun's)",
    everydayExample: "Why we see different shapes of the Moon throughout the month (from New Moon to Full Moon) and high/low ocean tides at the beach.",
    quickQuestions: [
      "Explain the 8 phases of the Moon with diagrams",
      "What is the exact difference between a Solar and a Lunar eclipse?",
      "Why is the Moon tidally locked to Earth?"
    ],
    keywords: ["moon", "lunar", "tides", "phases", "eclipse", "solar eclipse", "lunar eclipse", "spring tide", "neap tide", "gravity"]
  },
  {
    id: "stars-galaxies-universe",
    category: "space",
    categoryLabel: "Space & Cosmology",
    categoryIcon: Orbit,
    title: "Stars, Life Cycle of Stars & The Big Bang",
    simpleExplanation: "Stars generate light and heat by fusing hydrogen into helium in their cores. Massive stars end their lives in supernova explosions, leaving neutron stars or black holes.",
    coreFormulaOrConcept: "Nuclear Fusion: 4 ¹H → ⁴He + Energy  |  E = mc²  |  Age of Universe ≈ 13.8 Billion Yrs",
    everydayExample: "The heavy elements in your bones (calcium) and blood (iron) were forged inside dying stars billions of years ago!",
    quickQuestions: [
      "How does the Sun produce energy through nuclear fusion?",
      "What is a black hole and what happens at the event horizon?",
      "What is the Big Bang theory and how old is the universe?"
    ],
    keywords: ["stars", "fusion", "supernova", "black hole", "galaxy", "milky way", "big bang", "universe", "nebula"]
  },
  {
    id: "black-holes-neutron-stars",
    category: "space",
    categoryLabel: "Astrophysics & Space",
    categoryIcon: Orbit,
    title: "Black Holes, Event Horizons & Neutron Stars",
    simpleExplanation: "When massive dying stars collapse, gravity overcomes all atomic forces. If core mass exceeds 3 solar masses, it forms a black hole where escape velocity exceeds the speed of light.",
    coreFormulaOrConcept: "Schwarzschild Radius R_s = 2GM / c²  |  Event Horizon Escape v = c",
    everydayExample: "Supermassive black hole Sagittarius A* sits at the exact center of our Milky Way galaxy with 4.3 million times the Sun's mass.",
    quickQuestions: [
      "What is a black hole and how does the event horizon work?",
      "How is the Schwarzschild radius calculated (Rs = 2GM/c²)?",
      "What is a neutron star and pulsar?"
    ],
    keywords: ["black hole", "singularity", "event horizon", "neutron star", "pulsar", "supernova", "schwarzschild", "gravity", "astrophysics"]
  },
  {
    id: "galaxies-expanding-universe",
    category: "space",
    categoryLabel: "Cosmology & Space",
    categoryIcon: Orbit,
    title: "Galaxies, Milky Way & Hubble's Expanding Universe",
    simpleExplanation: "The universe contains over 2 trillion galaxies. Hubble discovered that distant galaxies are moving away from us faster and faster, proving that the fabric of space itself is expanding.",
    coreFormulaOrConcept: "Hubble's Law: v = H₀ · d  (H₀ ≈ 70 km/s/Mpc)  |  68% Dark Energy, 27% Dark Matter, 5% Matter",
    everydayExample: "Looking at distant galaxies through telescopes is like looking back in time because their light took millions of years to reach our eyes.",
    quickQuestions: [
      "What is Hubble's Law and how does it prove the universe is expanding?",
      "What is the difference between Dark Matter and Dark Energy?",
      "What is our Milky Way galaxy and where is our Solar System located?"
    ],
    keywords: ["galaxy", "milky way", "hubble", "expanding universe", "dark matter", "dark energy", "redshift", "cosmic microwave background", "cmb"]
  },
  {
    id: "telescopes-space-exploration",
    category: "space",
    categoryLabel: "Space Tech & Exploration",
    categoryIcon: Orbit,
    title: "Telescopes, Satellites & Space Exploration (James Webb, ISS)",
    simpleExplanation: "Astronomers use optical, radio, and infrared space telescopes (like Hubble and James Webb) above Earth's atmosphere to observe exoplanets and the earliest baby galaxies in deep cosmic time.",
    coreFormulaOrConcept: "Diffraction Limit θ ≈ 1.22 λ / D  |  Orbital Speed v = √(GM/r) ≈ 7.8 km/s for ISS",
    everydayExample: "GPS navigation on your phone relies on atomic clocks aboard 31 orbiting satellites accounting for Einstein's relativity!",
    quickQuestions: [
      "How does the James Webb Space Telescope (JWST) see infrared light from the early universe?",
      "How do satellites stay in orbit around Earth without falling?",
      "What is an exoplanet and how do we detect habitable worlds?"
    ],
    keywords: ["telescope", "jwst", "hubble", "satellite", "iss", "space station", "orbit", "exoplanet", "space exploration", "gps"]
  },
  {
    id: "exoplanets-goldilocks-zone",
    category: "space",
    categoryLabel: "Astrophysics & Exoplanets",
    categoryIcon: Orbit,
    title: "Exoplanets, Habitable Goldilocks Zones & Transit Detection",
    simpleExplanation: "Over 5,500 planets have been discovered orbiting other stars. The circumstellar Habitable Zone ('Goldilocks Zone') is where temperatures allow liquid water oceans to exist on a planet's surface.",
    coreFormulaOrConcept: "Transit Light Dip: ΔF / F = (R_p / R_*)²  |  Equilibrium Temp: T_eq = T_* · √(R_* / 2d) · (1 - A)^{1/4}",
    everydayExample: "NASA's Kepler and TESS space telescopes discover alien worlds by measuring minuscule 0.01% dips in starlight as planets cross in front of their host stars.",
    quickQuestions: [
      "What is an exoplanet and what is the circumstellar habitable zone?",
      "How does transit photometry detect alien worlds across interstellar distances?",
      "What are the atmospheric signatures of habitable worlds like TRAPPIST-1e?"
    ],
    keywords: ["exoplanet", "goldilocks zone", "habitable zone", "kepler", "tess", "transit", "trappist", "alien planet", "astronomy", "water"]
  },
  {
    id: "mars-exploration-olympus-mons",
    category: "space",
    categoryLabel: "Planetary Science & Mars",
    categoryIcon: Orbit,
    title: "Mars Exploration: Rovers, Olympus Mons & Ancient Water",
    simpleExplanation: "Mars is covered in reddish iron oxide dust. It hosts Olympus Mons (22 km tall—nearly 3× Mount Everest) and dry river deltas where NASA's Perseverance rover searches for ancient microbial biosignatures.",
    coreFormulaOrConcept: "Surface Gravity: g_Mars = 3.72 m/s² (0.38g)  |  Atmosphere: 95% CO₂, 0.006 bar  |  Olympus Mons = 22 km",
    everydayExample: "Dried river channels, layered sedimentary rocks, and rounded pebbles photographed by Curiosity prove vast oceans once flowed on Mars.",
    quickQuestions: [
      "What geologic evidence proves liquid oceans and rivers once existed on Mars?",
      "How does Olympus Mons compare in scale to Mount Everest and Mauna Kea?",
      "How does NASA's Perseverance rover and Ingenuity helicopter operate on Mars?"
    ],
    keywords: ["mars", "perseverance", "curiosity", "olympus mons", "red planet", "ancient water", "rover", "ingenuity", "crater", "biosignature"]
  },
  {
    id: "keplers-laws-orbital-mechanics",
    category: "space",
    categoryLabel: "Orbital Mechanics & Astronomy",
    categoryIcon: Orbit,
    title: "Kepler's 3 Laws of Planetary Motion & Orbital Mechanics",
    simpleExplanation: "Planets orbit in ellipses with the Sun at one focus; sweep equal orbital areas in equal times (moving fastest at perihelion); and orbital period squared is proportional to semi-major axis cubed (T² ∝ a³).",
    coreFormulaOrConcept: "1st: Ellipse (Sun at focus)  |  2nd: dA/dt = const (Conservation of Angular Momentum)  |  3rd: T² = (4π² / GM) · a³",
    everydayExample: "Earth orbits closest to the Sun in January (perihelion) and fastest, then moves slower when furthest in July (aphelion).",
    quickQuestions: [
      "State and explain Kepler's three laws of planetary motion",
      "Derive Kepler's Third Law (T² ∝ a³) from Newton's gravitational law",
      "What is a Hohmann transfer orbit and how do spacecraft travel to Mars?"
    ],
    keywords: ["kepler", "kepler's laws", "orbit", "planetary motion", "perihelion", "aphelion", "ellipse", "hohmann transfer", "orbital period"]
  },
  {
    id: "cosmic-microwave-background",
    category: "space",
    categoryLabel: "Cosmology & Early Universe",
    categoryIcon: Orbit,
    title: "Cosmic Microwave Background (CMB) & The Early Universe",
    simpleExplanation: "The CMB is the thermal relic radiation from the Big Bang emitted 380,000 years after creation when atoms first formed (recombination). It fills the universe as an almost perfectly uniform 2.725 Kelvin microwave glow.",
    coreFormulaOrConcept: "Peak Temperature: T_CMB = 2.7255 K  |  Wien's Law: λ_max · T = 2.898 × 10⁻³ m·K  |  Anisotropy: ΔT/T ~ 10⁻⁵",
    everydayExample: "About 1% of the static 'snow' hiss on old analog television antennas was actual radio photons from the Big Bang itself!",
    quickQuestions: [
      "What is the Cosmic Microwave Background (CMB) and how was it formed?",
      "How did Penzias and Wilson accidentally discover the CMB in 1964?",
      "What do tiny temperature ripples (1 part in 100,000) in the CMB reveal about galaxy formation?"
    ],
    keywords: ["cmb", "cosmic microwave background", "big bang", "recombination", "planck satellite", "penzias wilson", "redshift", "early universe", "cosmology"]
  },

  // Earth Science
  {
    id: "earth-layers-core",
    category: "earth",
    categoryLabel: "Earth Science & Geology",
    categoryIcon: Globe2,
    title: "Layers of the Earth: Crust, Mantle & Liquid Outer Core",
    simpleExplanation: "Earth has 4 concentric layers: solid rocky Crust (0-70 km), semi-fluid silicate Mantle (84% of volume), liquid iron Outer Core (generates Earth's magnetic shield), and solid iron Inner Core (6,000°C).",
    coreFormulaOrConcept: "Crust (0-70km) → Mantle (2900km) → Liquid Outer Core (5150km) → Solid Inner Core (6371km)",
    everydayExample: "Earth's liquid iron outer core creates our magnetic field, guiding compass needles and protecting all life from solar radiation.",
    quickQuestions: [
      "What are the 4 main layers of the Earth and their properties?",
      "Why is the inner core solid even though it is hotter than the Sun's surface?",
      "How do seismic P and S waves prove the outer core is liquid?"
    ],
    keywords: ["earth layers", "crust", "mantle", "outer core", "inner core", "geology", "magnetic field", "lithosphere", "asthenosphere", "seismic"]
  },
  {
    id: "atmosphere-layers-weather",
    category: "earth",
    categoryLabel: "Earth & Atmospheric Science",
    categoryIcon: Globe2,
    title: "Earth's Atmosphere: Troposphere, Stratosphere & Ozone",
    simpleExplanation: "Earth's atmosphere (78% Nitrogen, 21% Oxygen, 0.9% Argon) consists of 5 layers: Troposphere (where all weather occurs), Stratosphere (Ozone layer filters UV), Mesosphere (meteors burn), Thermosphere (ISS/Auroras), and Exosphere.",
    coreFormulaOrConcept: "Troposphere (0-12km) → Stratosphere (O₃, 50km) → Mesosphere (85km) → Thermosphere (600km)",
    everydayExample: "Commercial airplanes cruise in the lower stratosphere to fly above stormy troposphere clouds and turbulence.",
    quickQuestions: [
      "What are the 5 layers of Earth's atmosphere?",
      "What is the ozone layer (O₃) and why is it essential for life?",
      "What causes the Northern and Southern Lights (Auroras)?"
    ],
    keywords: ["atmosphere", "troposphere", "stratosphere", "ozone", "mesosphere", "thermosphere", "aurora", "weather", "air pressure", "climate"]
  },
  {
    id: "water-cycle-weather",
    category: "earth",
    categoryLabel: "Earth & Hydrosphere",
    categoryIcon: Globe2,
    title: "The Global Water Cycle, Oceans & Climate Regulation",
    simpleExplanation: "Water continuously evaporates from oceans (71% of Earth's surface), condenses into clouds, precipitates as rain/snow, and flows back through rivers to sustain all terrestrial ecosystems.",
    coreFormulaOrConcept: "Evaporation + Transpiration → Condensation → Precipitation → Runoff / Groundwater Recharge",
    everydayExample: "Morning dew on grass, cloud formation over mountains, and rainwater replenishing groundwater aquifers.",
    quickQuestions: [
      "How does the water cycle sustain all life on Earth?",
      "What causes weather, winds, and atmospheric pressure systems?",
      "What is the greenhouse effect and how does it keep Earth warm?"
    ],
    keywords: ["water cycle", "evaporation", "condensation", "precipitation", "weather", "atmosphere", "greenhouse", "clouds", "rain", "ocean", "hydrosphere"]
  },
  {
    id: "plate-tectonics-earthquakes",
    category: "earth",
    categoryLabel: "Earth Science & Tectonics",
    categoryIcon: Globe2,
    title: "Plate Tectonics, Continental Drift & Earthquakes",
    simpleExplanation: "Earth's crust is broken into ~15 rigid tectonic plates floating on the hot convective mantle. Colliding plates build mountain ranges (like the Himalayas), while sliding plates trigger earthquakes.",
    coreFormulaOrConcept: "Plates move 2-10 cm/year  |  Energy Scale: log₁₀ E = 4.8 + 1.5M  (Each +1 Mag = 32× Energy)",
    everydayExample: "The Himalayan mountains grow ~5 mm taller every year as the Indian tectonic plate continues colliding into Asia.",
    quickQuestions: [
      "What causes earthquakes and how are seismic waves measured on the Richter scale?",
      "What are convergent, divergent, and transform plate boundaries?",
      "What is Pangaea and continental drift theory?"
    ],
    keywords: ["earthquake", "volcano", "plate tectonics", "crust", "mantle", "core", "seismic", "richter", "continental drift", "pangaea", "fault"]
  },
  {
    id: "rock-cycle-minerals",
    category: "earth",
    categoryLabel: "Geology & Earth Science",
    categoryIcon: Globe2,
    title: "The Rock Cycle: Igneous, Sedimentary & Metamorphic",
    simpleExplanation: "Rocks continuously transform over millions of years: Igneous (cooled lava/magma like Granite), Sedimentary (compressed layered sediments and fossils like Limestone), and Metamorphic (heat/pressure altered rocks like Marble).",
    coreFormulaOrConcept: "Magma ⇄ Igneous ⇄ Sedimentary ⇄ Metamorphic (Weathering, Pressure & Melting)",
    everydayExample: "The Taj Mahal is carved from metamorphic marble, while volcanic basalt forms the seafloor under all world oceans.",
    quickQuestions: [
      "What are the differences between Igneous, Sedimentary, and Metamorphic rocks?",
      "Why are fossils found exclusively in sedimentary rocks?",
      "How do weathering and erosion shape canyons and valleys?"
    ],
    keywords: ["rock cycle", "igneous", "sedimentary", "metamorphic", "granite", "basalt", "marble", "limestone", "fossil", "mineral", "geology"]
  },
  {
    id: "carbon-cycle-greenhouse",
    category: "earth",
    categoryLabel: "Earth Climate & Ecosystems",
    categoryIcon: Globe2,
    title: "The Carbon Cycle & The Natural Greenhouse Effect",
    simpleExplanation: "Atmospheric greenhouse gases (CO₂, H₂O, CH₄) trap outgoing infrared heat, naturally keeping Earth's surface at +15°C instead of a frozen -18°C. Carbon cycles between oceans, forests, rocks, and the atmosphere.",
    coreFormulaOrConcept: "Solar Input (Visible) → Surface Heat (Infrared) → GHG Absorption (CO₂, CH₄, H₂O) → +33°C Natural Warming",
    everydayExample: "Greenhouse glass keeps plants warm in winter, exactly like atmospheric CO₂ and water vapor trap heat around our planet.",
    quickQuestions: [
      "What is the natural greenhouse effect and why is it essential for Earth's habitability?",
      "What are major carbon sinks (oceans, forests, rocks) and sources?",
      "How does human fossil fuel combustion alter the planetary heat balance?"
    ],
    keywords: ["greenhouse effect", "carbon cycle", "global warming", "climate", "co2", "methane", "infrared", "atmosphere", "carbon sink"]
  },
  {
    id: "ocean-currents-thermohaline",
    category: "earth",
    categoryLabel: "Oceanography & Earth Science",
    categoryIcon: Globe2,
    title: "Ocean Currents, Thermohaline Conveyor & Global Climate",
    simpleExplanation: "Global ocean circulation is propelled by surface winds, the Coriolis effect, and deep thermohaline density gradients (cold, salty water sinking at polar regions). It acts as a massive thermal regulator for our planet.",
    coreFormulaOrConcept: "Thermohaline: Density ρ = f(T, Salinity)  |  Coriolis Deflection: F_c = 2m(v × Ω)",
    everydayExample: "The warm Atlantic Gulf Stream transports Caribbean heat to Europe, keeping London and Paris relatively mild in winter compared to icy Canadian cities at the same latitude.",
    quickQuestions: [
      "What is the global thermohaline conveyor belt and how does it drive ocean circulation?",
      "How does the Coriolis effect steer ocean gyres and cyclonic winds?",
      "What are El Niño and La Niña climate oscillations and how do they alter global weather?"
    ],
    keywords: ["ocean current", "thermohaline", "gulf stream", "coriolis", "oceanography", "salinity", "climate", "el nino", "la nina", "gyre"]
  },
  {
    id: "volcanoes-magma-ring-of-fire",
    category: "earth",
    categoryLabel: "Volcanology & Plate Tectonics",
    categoryIcon: Globe2,
    title: "Volcanoes: Magma Viscosity, Eruption Styles & The Ring of Fire",
    simpleExplanation: "Volcanoes vent magma, volcanic ash, and gases from Earth's mantle. Low-silica basaltic magma produces gentle, effusive lava flows (shield volcanoes like Mauna Loa), while high-silica andesitic/rhyolitic magma traps gas and erupts explosively (stratovolcanoes like Krakatoa).",
    coreFormulaOrConcept: "Silica Content: Basalt (45-52% SiO₂) → Andesite → Rhyolite (>68% SiO₂, High Viscosity)",
    everydayExample: "Gentle bubbling lava fountains at Kilauea in Hawaii versus catastrophic explosive pyroclastic blasts at Mount Vesuvius or Mount St. Helens.",
    quickQuestions: [
      "What is the difference between magma beneath the crust and lava on the surface?",
      "Why are subduction zone stratovolcanoes around the Pacific Ring of Fire so explosive?",
      "What are volcanic hot spots and how did the Hawaiian island chain form?"
    ],
    keywords: ["volcano", "magma", "lava", "ring of fire", "viscosity", "shield volcano", "stratovolcano", "pyroclastic", "eruption", "hotspot"]
  },
  {
    id: "weather-fronts-hurricanes",
    category: "earth",
    categoryLabel: "Meteorology & Severe Weather",
    categoryIcon: Globe2,
    title: "Meteorology: Fronts, Jet Streams & Tropical Hurricanes",
    simpleExplanation: "Weather is propelled by temperature and pressure differentials between colliding air masses. Tropical cyclones (hurricanes/typhoons) form over warm ocean waters (>26.5°C), feeding on latent heat of condensation around an extraordinarily calm low-pressure central eye.",
    coreFormulaOrConcept: "Geostrophic Wind Balance  |  Latent Heat of Condensation: L_v = 2.26 × 10⁶ J/kg  |  Central Pressure < 920 hPa",
    everydayExample: "The sharp temperature drop, gusty winds, and sudden thunderstorms that mark the arrival of a cold front on a sweltering summer afternoon.",
    quickQuestions: [
      "How do tropical hurricanes and cyclones form over warm ocean waters?",
      "What is the difference between cold fronts, warm fronts, and occluded fronts?",
      "Why is the eye of a hurricane completely calm while the surrounding eyewall has the highest winds?"
    ],
    keywords: ["hurricane", "cyclone", "typhoon", "weather front", "cold front", "warm front", "jet stream", "meteorology", "pressure", "storm"]
  },
  {
    id: "geological-time-scale-fossils",
    category: "earth",
    categoryLabel: "Paleontology & Geological Time",
    categoryIcon: Globe2,
    title: "The Geological Time Scale, Stratigraphy & Mass Extinctions",
    simpleExplanation: "Earth's 4.54-billion-year history is structured into Eons, Eras, Periods, and Epochs. Rock strata and index fossils preserve the evolutionary timeline and record the 5 major mass extinctions, including the Chicxulub asteroid impact that ended the dinosaurs 66 million years ago.",
    coreFormulaOrConcept: "Radiometric Dating: N(t) = N_0 · e^{-λt}  |  Half-Life: t_{1/2} = ln(2) / λ  |  Superposition Principle",
    everydayExample: "Finding fossilized seashell ammonites high up in the Himalayan mountains proves those rock strata were once ocean seabed before tectonic collision.",
    quickQuestions: [
      "How is Earth's 4.54-billion-year history divided on the geological time scale?",
      "How does radiometric carbon-14 and uranium-lead dating determine the age of rocks?",
      "What caused the Cretaceous-Paleogene (K-Pg) mass extinction that wiped out non-avian dinosaurs?"
    ],
    keywords: ["geological time", "fossils", "paleontology", "stratigraphy", "half life", "carbon dating", "radiometric", "extinction", "dinosaurs", "cambrian"]
  },

  // Math
  {
    id: "quadratic-formula",
    category: "math",
    categoryLabel: "Math (Class 10-12)",
    categoryIcon: Calculator,
    title: "Quadratic Equations & Formula Derivation",
    simpleExplanation: "Finds the exact roots of any second-degree equation ax² + bx + c = 0 using the method of completing the square.",
    coreFormulaOrConcept: "x = (-b ± √(b² - 4ac)) / (2a)  |  Discriminant Δ = b² - 4ac",
    everydayExample: "Calculating maximum height and landing coordinates of thrown balls or parabolic satellite dishes.",
    quickQuestions: [
      "Derive the quadratic formula step by step",
      "What does the discriminant tell us about the roots of a quadratic equation?",
      "How to solve quadratic equations by factoring vs formula?"
    ],
    keywords: ["quadratic", "quadratic formula", "roots", "parabola", "discriminant", "algebra", "polynomial", "ax^2+bx+c"]
  },
  {
    id: "trigonometry-identities",
    category: "math",
    categoryLabel: "Math (Class 10-12)",
    categoryIcon: Calculator,
    title: "Trigonometry, Sin/Cos/Tan & Identities",
    simpleExplanation: "Studies relationships between side lengths and angles in triangles, foundational for waves, navigation, architecture, and computer graphics.",
    coreFormulaOrConcept: "sin²θ + cos²θ = 1  |  1 + tan²θ = sec²θ  |  tanθ = sinθ/cosθ",
    everydayExample: "Surveyors measuring mountain heights without climbing, and audio equalizers processing sound sine waves.",
    quickQuestions: [
      "Derive the fundamental identity sin²θ + cos²θ = 1",
      "What are the standard trigonometric values for 0°, 30°, 45°, 60°, 90°?",
      "How to calculate the height of a building using trigonometry?"
    ],
    keywords: ["trigonometry", "sin", "cos", "tan", "identities", "triangles", "sine", "cosine", "tangent", "angles", "hypotenuse"]
  },
  {
    id: "pythagoras-geometry",
    category: "math",
    categoryLabel: "Math (Class 7-10)",
    categoryIcon: Calculator,
    title: "Pythagorean Theorem & Geometric Proof",
    simpleExplanation: "In any right-angled triangle, the area of the square on the hypotenuse equals the sum of the areas of the squares on the other two sides: a² + b² = c².",
    coreFormulaOrConcept: "a² + b² = c²  →  Hypotenuse c = √(a² + b²)",
    everydayExample: "Calculating TV screen diagonal sizes (e.g. 55-inch diagonal) and GPS distance triangulation.",
    quickQuestions: [
      "Derive the Pythagorean theorem with geometric proof",
      "What are common Pythagorean triples like (3, 4, 5) and (5, 12, 13)?",
      "How is Pythagoras theorem used to calculate 2D distance between points?"
    ],
    keywords: ["pythagoras", "pythagorean", "hypotenuse", "right triangle", "a^2+b^2=c^2", "geometry", "triangles"]
  },
  {
    id: "calculus-derivatives-rates",
    category: "math",
    categoryLabel: "Mathematics (Class 11-12 & College)",
    categoryIcon: Calculator,
    title: "Calculus: Derivatives, Tangent Slopes & Rates of Change",
    simpleExplanation: "The derivative measures the instantaneous rate of change of a function—the slope of the tangent line at any point. Foundational for physics velocities, accelerations, economics, and machine learning gradient descent.",
    coreFormulaOrConcept: "f'(x) = lim_{h→0} [f(x+h) - f(x)] / h  |  Power Rule: d/dx[xⁿ] = n·xⁿ⁻¹  |  d/dx[sin x] = cos x",
    everydayExample: "A car's speedometer shows the instantaneous derivative of distance with respect to time (v = ds/dt) at that exact millisecond.",
    quickQuestions: [
      "Define the derivative using limits from first principles",
      "Derive the power rule d/dx[xⁿ] = n·xⁿ⁻¹",
      "What are product, quotient, and chain rules in differential calculus?"
    ],
    keywords: ["calculus", "derivative", "differentiation", "rate of change", "tangent", "slope", "power rule", "chain rule", "limits"]
  },
  {
    id: "calculus-integrals-area",
    category: "math",
    categoryLabel: "Mathematics (Class 12 & College)",
    categoryIcon: Calculator,
    title: "Integral Calculus & The Fundamental Theorem of Calculus",
    simpleExplanation: "Integration accumulates continuous quantities to calculate area under curves, volumes of solids, and total accumulated change. The Fundamental Theorem establishes differentiation and integration as inverse processes.",
    coreFormulaOrConcept: "∫_a^b f(x) dx = F(b) - F(a)  |  ∫ xⁿ dx = xⁿ⁺¹ / (n+1) + C (n ≠ -1)  |  ∫ 1/x dx = ln|x| + C",
    everydayExample: "Integrating a rocket's varying engine thrust force over time calculates the exact total work done and final orbital velocity reached.",
    quickQuestions: [
      "State and explain the Fundamental Theorem of Calculus (FTC)",
      "How to calculate the area between two curves using definite integrals?",
      "What is integration by parts: ∫ u dv = uv - ∫ v du and when is it used?"
    ],
    keywords: ["calculus", "integral", "integration", "area under curve", "fundamental theorem", "definite integral", "antiderivative", "riemann sum"]
  },
  {
    id: "probability-normal-distribution",
    category: "math",
    categoryLabel: "Mathematics & Statistics",
    categoryIcon: Calculator,
    title: "Probability, Normal Distribution & The Central Limit Theorem",
    simpleExplanation: "Probability quantifies the likelihood of outcomes. The Central Limit Theorem proves that the average of many independent random trials naturally converges toward a symmetrical bell-shaped Normal Distribution curve.",
    coreFormulaOrConcept: "P(A) = Favorable / Total  |  Gaussian Bell Curve: f(x) = (1 / σ√(2π)) · e^{-(x-μ)² / 2σ²}  |  68-95-99.7 Rule",
    everydayExample: "Standardized test scores, human heights, blood pressure readings, and measurement errors in physics all naturally form a bell curve.",
    quickQuestions: [
      "What is the 68-95-99.7 empirical rule for a normal distribution?",
      "State the Central Limit Theorem and why it is so important in statistics",
      "Explain Bayes' theorem for conditional probability: P(A|B) = P(B|A)·P(A) / P(B)"
    ],
    keywords: ["probability", "statistics", "normal distribution", "bell curve", "central limit theorem", "mean", "standard deviation", "bayes", "variance"]
  },
  {
    id: "matrices-linear-algebra",
    category: "math",
    categoryLabel: "Mathematics (Class 12 & College)",
    categoryIcon: Calculator,
    title: "Matrices, Determinants & Linear Transformations",
    simpleExplanation: "Matrices are rectangular arrays of numbers representing linear systems and spatial transformations (rotation, scaling). Crucial for 3D computer graphics, physics tensors, quantum states, and modern AI neural networks.",
    coreFormulaOrConcept: "Matrix Equation: A · x = b  |  Inverse: A⁻¹ = (1 / det A) · adj(A)  |  Eigenvalues: A·v = λ·v",
    everydayExample: "Video game graphic engines multiply 4×4 transformation matrices thousands of times per second to rotate, scale, and render 3D game models onto your screen.",
    quickQuestions: [
      "How to multiply two matrices step by step?",
      "What is the geometric meaning of the determinant of a 2×2 or 3×3 matrix?",
      "What are eigenvalues and eigenvectors with examples (A·v = λ·v)?"
    ],
    keywords: ["matrices", "matrix", "linear algebra", "determinant", "eigenvalues", "eigenvectors", "inverse", "vector", "transformations"]
  },
  {
    id: "logarithms-exponential-growth",
    category: "math",
    categoryLabel: "Mathematics (Class 9-12)",
    categoryIcon: Calculator,
    title: "Logarithms, Exponential Growth & Radioactive Half-Life",
    simpleExplanation: "Logarithms invert exponentiation (b^y = x ⇔ log_b(x) = y). They compress astronomical ranges onto human-scale axes, modeling compound interest, population growth, and radioactive isotope decay.",
    coreFormulaOrConcept: "log(xy) = log x + log y  |  Exponential Growth: N(t) = N₀ · e^{kt}  |  Half-Life: t_{1/2} = ln(2) / λ",
    everydayExample: "The Richter earthquake scale, sound decibels (dB), and chemical pH are all logarithmic: an 8.0 earthquake releases ~32× more energy than a 7.0.",
    quickQuestions: [
      "What are the fundamental laws of logarithms with examples?",
      "Derive the radioactive decay half-life equation t_{1/2} = ln(2) / λ",
      "How does exponential growth differ from linear growth over time?"
    ],
    keywords: ["logarithms", "log", "exponential", "growth", "half life", "radioactive decay", "e", "natural log", "compound interest"]
  },
  {
    id: "sequences-series-progressions",
    category: "math",
    categoryLabel: "Mathematics (Class 10-12)",
    categoryIcon: Calculator,
    title: "Arithmetic & Geometric Progressions (AP, GP) & Infinite Series",
    simpleExplanation: "An Arithmetic Progression (AP) adds a constant difference d; a Geometric Progression (GP) multiplies by a common ratio r. Sums of infinite convergent geometric series (|r| < 1) add up to finite exact quantities.",
    coreFormulaOrConcept: "AP: a_n = a + (n-1)d  |  S_n = (n/2)[2a + (n-1)d]  |  GP: a_n = a·rⁿ⁻¹  |  Infinite GP: S_∞ = a / (1 - r)",
    everydayExample: "A bouncing rubber ball where each bounce reaches 80% of previous height: the total vertical travel distance is an infinite convergent geometric series with a finite sum.",
    quickQuestions: [
      "Derive the formula for the sum of the first n terms of an AP",
      "Calculate the sum of an infinite geometric series when |r| < 1",
      "What is the Fibonacci sequence (F_n = F_{n-1} + F_{n-2}) and the Golden Ratio φ?"
    ],
    keywords: ["ap", "gp", "arithmetic progression", "geometric progression", "series", "sequence", "infinite series", "fibonacci", "golden ratio"]
  }
];

const QUICK_SCIENCE_FACTS = [
  {
    fact: "Bananas are naturally slightly radioactive because they are rich in Potassium-40 (a harmless natural isotope).",
    tag: "Chemistry & Nature",
    prompt: "Why are bananas radioactive and what is Potassium-40?"
  },
  {
    fact: "Venus is hotter than Mercury, even though Mercury is closer to the Sun, because Venus has a runaway CO₂ greenhouse atmosphere.",
    tag: "Space & Climate",
    prompt: "Why is Venus hotter than Mercury despite being further from the Sun?"
  },
  {
    fact: "Water is one of the only substances that expands when it freezes, which is why ice floats and lakes don't freeze solid from the bottom up.",
    tag: "Physics & Chemistry",
    prompt: "Why does water expand when freezing and why is this essential for marine life?"
  },
  {
    fact: "A single bolt of lightning can reach temperatures of 30,000 Kelvin (53,500°F)—five times hotter than the surface of the Sun.",
    tag: "Atmospheric Physics",
    prompt: "How hot is lightning and what causes thunder to rumble?"
  },
  {
    fact: "Your DNA stretched out from every cell in your body would reach to Pluto and back several times.",
    tag: "Genetics & Biology",
    prompt: "How is DNA compacted inside a microscopic cell nucleus?"
  },
  {
    fact: "The Central Limit Theorem in mathematics explains why everything from human heights to measurement errors naturally forms a bell curve.",
    tag: "Mathematics & Statistics",
    prompt: "What is the Central Limit Theorem and why does it produce a normal distribution?"
  },
  {
    fact: "Over 99% of all species that ever lived on Earth are now extinct, with life surviving five catastrophic mass extinction events.",
    tag: "Earth Science & Paleontology",
    prompt: "What were the 5 major mass extinctions in Earth's history?"
  },
  {
    fact: "Olympus Mons on Mars is 22 kilometers high—nearly three times taller than Mount Everest—making it the solar system's largest known volcano.",
    tag: "Space & Mars",
    prompt: "Why is Olympus Mons on Mars so much larger than volcanoes on Earth?"
  },
  {
    fact: "GPS satellites experience time running faster by 38 microseconds every day due to Einstein's general and special relativity, requiring daily clock corrections.",
    tag: "Physics & Relativity",
    prompt: "How does Einstein's theory of relativity affect GPS satellite clocks?"
  },
  {
    fact: "About 1% of the static 'snow' on old analog televisions was caused by the Cosmic Microwave Background radiation from the Big Bang.",
    tag: "Space & Cosmology",
    prompt: "What is the Cosmic Microwave Background and how does it prove the Big Bang?"
  }
];

const POPULAR_ELEMENTS = [
  { symbol: "H", name: "Hydrogen", num: 1, mass: "1.008", category: "Nonmetal", use: "Rocket fuel, water, star fusion" },
  { symbol: "He", name: "Helium", num: 2, mass: "4.003", category: "Noble Gas", use: "Balloons, MRI cryo-cooling" },
  { symbol: "C", name: "Carbon", num: 6, mass: "12.011", category: "Nonmetal", use: "Basis of all organic life, diamonds" },
  { symbol: "N", name: "Nitrogen", num: 7, mass: "14.007", category: "Nonmetal", use: "78% of Earth's atmosphere, fertilizers" },
  { symbol: "O", name: "Oxygen", num: 8, mass: "15.999", category: "Nonmetal", use: "Respiration, water, combustion" },
  { symbol: "Na", name: "Sodium", num: 11, mass: "22.990", category: "Alkali Metal", use: "Table salt (NaCl), nerve impulses" },
  { symbol: "Al", name: "Aluminum", num: 13, mass: "26.982", category: "Post-transition", use: "Airplanes, beverage cans, foil" },
  { symbol: "Si", name: "Silicon", num: 14, mass: "28.085", category: "Metalloid", use: "Computer microchips, solar cells, glass" },
  { symbol: "Fe", name: "Iron", num: 26, mass: "55.845", category: "Transition Metal", use: "Steel buildings, hemoglobin in blood" },
  { symbol: "Cu", name: "Copper", num: 29, mass: "63.546", category: "Transition Metal", use: "Electrical wiring, plumbing pipes" },
  { symbol: "Au", name: "Gold", num: 79, mass: "196.97", category: "Transition Metal", use: "Jewelry, corrosion-free electronics" }
];

// Smart search tokenizer to strip question stop words
function extractSearchTokens(rawQuery: string): string[] {
  const cleaned = (rawQuery || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .trim();
  
  const stopWords = new Set([
    "what", "is", "mean", "by", "the", "a", "an", "how", "does", "why", "in", 
    "to", "for", "of", "are", "tell", "me", "about", "can", "you", "explain", 
    "define", "meaning", "definition", "describe", "which", "where", "when", "who"
  ]);

  const words = cleaned.split(/\s+/).filter(w => w.length > 0);
  const meaningful = words.filter(w => w.length > 1 && !stopWords.has(w));
  return meaningful.length > 0 ? meaningful : words;
}

export const QuantumBasicDesk: React.FC<QuantumBasicDeskProps> = ({
  onSendQuery,
  messages = [],
  isProcessing = false,
  onSpeakMessage,
  themeMode = "normal"
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [customQuestion, setCustomQuestion] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [factIndex, setFactIndex] = useState(0);
  const [activeInquiry, setActiveInquiry] = useState<string | null>(null);

  // Quick unit converter state
  const [tempVal, setTempVal] = useState("25");
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
  const [distVal, setDistVal] = useState("10");
  const [distUnit, setDistUnit] = useState<"km" | "mi">("km");

  // Element search state
  const [elementSearch, setElementSearch] = useState("");

  // Find the latest assistant message for live display
  const latestAssistantMessage = [...messages].reverse().find(m => m.role === "assistant");
  const latestUserMessage = [...messages].reverse().find(m => m.role === "user");

  // Intelligent search matching: supports questions like "what is light?", "why is sky blue", etc.
  const searchTokens = extractSearchTokens(searchQuery);
  const rawSearchLower = searchQuery.toLowerCase().trim();

  const filteredTopics = SCIENCE_TOPICS.filter((topic) => {
    const matchesCategory = selectedCategory === "all" || topic.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!rawSearchLower) return true;

    // 1. Direct substring match
    if (
      topic.title.toLowerCase().includes(rawSearchLower) ||
      topic.simpleExplanation.toLowerCase().includes(rawSearchLower) ||
      topic.categoryLabel.toLowerCase().includes(rawSearchLower) ||
      topic.coreFormulaOrConcept.toLowerCase().includes(rawSearchLower) ||
      topic.everydayExample.toLowerCase().includes(rawSearchLower)
    ) {
      return true;
    }

    // 2. Token / keyword match (handles questions like "what is light?", "how does sound travel")
    const searchableText = `${topic.title} ${topic.simpleExplanation} ${topic.categoryLabel} ${topic.coreFormulaOrConcept} ${topic.everydayExample} ${topic.quickQuestions.join(" ")} ${(topic.keywords || []).join(" ")}`.toLowerCase();

    return searchTokens.some((token) => searchableText.includes(token));
  });

  const filteredElements = POPULAR_ELEMENTS.filter(
    (el) =>
      elementSearch === "" ||
      el.name.toLowerCase().includes(elementSearch.toLowerCase()) ||
      el.symbol.toLowerCase().includes(elementSearch.toLowerCase()) ||
      el.use.toLowerCase().includes(elementSearch.toLowerCase())
  );

  const handleCopy = (id: string, text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
    } catch {
      // Safe fallback
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNextFact = () => {
    setFactIndex((prev) => (prev + 1) % QUICK_SCIENCE_FACTS.length);
  };

  const activeFact = QUICK_SCIENCE_FACTS[factIndex];

  // Temperature calculations
  const numTemp = parseFloat(tempVal) || 0;
  const convertedTemp =
    tempUnit === "C"
      ? `${((numTemp * 9) / 5 + 32).toFixed(1)} °F  |  ${(numTemp + 273.15).toFixed(1)} K`
      : `${(((numTemp - 32) * 5) / 9).toFixed(1)} °C  |  ${((((numTemp - 32) * 5) / 9) + 273.15).toFixed(1)} K`;

  // Distance calculations
  const numDist = parseFloat(distVal) || 0;
  const convertedDist =
    distUnit === "km"
      ? `${(numDist * 0.621371).toFixed(2)} miles  |  ${(numDist * 1000).toLocaleString()} meters`
      : `${(numDist / 0.621371).toFixed(2)} km  |  ${(numDist * 5280).toLocaleString()} feet`;

  const triggerAIQuery = (query: string, domain: STEMDomain = "physics") => {
    if (!query.trim()) return;
    setActiveInquiry(query);
    onSendQuery(query, domain);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#070B11] text-[#E2E8F0] overflow-y-auto rounded-xl border border-[#1E293B] shadow-2xl">
      {/* Header Banner for Quantum Basic */}
      <div className="p-4 sm:p-5 border-b border-[#1E293B] bg-gradient-to-r from-[#0C1523] via-[#0E1A2D] to-[#0A1220] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
                QUANTUM BASIC
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase">
                  Class 1st to 12th STEM &amp; General Knowledge
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Accessible science concepts, everyday natural phenomena, clear definitions, derivations, and instant AI answers.
            </p>
          </div>
        </div>

        {/* Quick Ask Natural Language Box */}
        <div className="flex items-center gap-2 w-full md:w-auto max-w-md">
          <div className="relative flex-1">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && customQuestion.trim()) {
                  triggerAIQuery(customQuestion, "physics");
                  setCustomQuestion("");
                }
              }}
              placeholder="Ask any science question (e.g. What is light? Why is sky blue?)..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-[#090E17] border border-[#26354A] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            onClick={() => {
              if (customQuestion.trim()) {
                triggerAIQuery(customQuestion, "physics");
                setCustomQuestion("");
              }
            }}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
          >
            <Send className="w-3 h-3" />
            <span>Ask</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Main Prominent Global Search Bar for Quantum Basic */}
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-[#091522]/90 shadow-lg">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-emerald-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    triggerAIQuery(searchQuery, "physics");
                  }
                }}
                placeholder="Search science topics (e.g. 'What is light?', 'sound', 'electricity', 'kinematics', 'photosynthesis')..."
                className="w-full pl-10 pr-24 py-2.5 rounded-lg text-sm bg-[#060B12] border border-[#1E2E42] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[11px] font-mono text-slate-400 hover:text-slate-200 bg-[#121E2E] rounded border border-slate-700 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {searchQuery && (
              <button
                onClick={() => triggerAIQuery(searchQuery, "physics")}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Search in AI &rarr;</span>
              </button>
            )}
          </div>

          {/* Live Search Indicator & Quick Keywords */}
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase font-semibold text-emerald-400">Quick Filters:</span>
              {[
                "Light & Color", "Sound", "Electricity", "Gravity", "Newton", "Quantum", 
                "Thermodynamics", "Relativity", "Atoms", "Electrochem", "Photosynthesis", 
                "Neurons", "Immunity", "Evolution", "CRISPR", "Planets", "Exoplanets", 
                "Mars", "Ocean Currents", "Volcanoes", "Calculus", "Probability", "Matrices"
              ].map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => setSearchQuery(keyword)}
                  className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    searchQuery.toLowerCase() === keyword.toLowerCase()
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold"
                      : "bg-[#0B131F] border-[#1E293B] text-slate-400 hover:text-slate-200 hover:border-slate-600"
                  }`}
                >
                  {keyword}
                </button>
              ))}
            </div>

            {searchQuery && (
              <span className="text-[11px] text-emerald-400 font-semibold">
                Showing {filteredTopics.length} topic{filteredTopics.length === 1 ? "" : "s"}
              </span>
            )}
          </div>
        </div>

        {/* Real-time Interactive AI Solution Panel (Displays answers instantly inside Quantum Basic) */}
        {(isProcessing || activeInquiry || latestAssistantMessage) && (
          <div className="p-4 sm:p-5 rounded-xl border border-emerald-500/50 bg-[#0A1624] shadow-2xl space-y-3 transition-all animate-fadeIn w-full max-w-full overflow-hidden break-words">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100 font-mono">
                      QUANTUM AI SOLUTION ENGINE
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase">
                      {isProcessing ? "Synthesizing Answer..." : "Solution Verified"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono line-clamp-1">
                    Inquiry: &ldquo;{activeInquiry || latestUserMessage?.content || "Scientific Inquiry"}&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {latestAssistantMessage && onSpeakMessage && (
                  <button
                    onClick={() => onSpeakMessage(latestAssistantMessage.content)}
                    className="px-2.5 py-1 rounded bg-[#111F30] hover:bg-[#182C44] border border-slate-700 text-xs font-mono text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Read Aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Listen</span>
                  </button>
                )}
                {latestAssistantMessage && (
                  <button
                    onClick={() => handleCopy("ai-solution", latestAssistantMessage.content)}
                    className="px-2.5 py-1 rounded bg-[#111F30] hover:bg-[#182C44] border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedId === "ai-solution" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{copiedId === "ai-solution" ? "Copied" : "Copy"}</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveInquiry(null)}
                  className="p-1 rounded bg-[#111F30] hover:bg-red-500/20 border border-slate-700 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                  title="Close panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Answer Body */}
            {isProcessing ? (
              <div className="py-8 flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                <p className="text-xs font-mono text-emerald-300">
                  Computing step-by-step mathematical derivation &amp; physical intuition...
                </p>
              </div>
            ) : latestAssistantMessage ? (
              <div className="pt-2 text-sm text-slate-200">
                <KaTeXRenderer content={latestAssistantMessage.content} />

                {/* Follow-up Question Chips */}
                {latestAssistantMessage.suggestedFollowups && latestAssistantMessage.suggestedFollowups.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold block mb-2">
                      Suggested Follow-Up Inquiries:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {latestAssistantMessage.suggestedFollowups.map((followup, idx) => (
                        <button
                          key={idx}
                          onClick={() => triggerAIQuery(followup, "physics")}
                          className="px-2.5 py-1 rounded-full text-xs font-mono bg-[#112030] hover:bg-[#193048] border border-emerald-500/30 text-emerald-300 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{followup}</span>
                          <ArrowRight className="w-3 h-3 opacity-60" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs font-mono text-slate-400 py-2">
                Type any question or equation in the search box to see the complete solution here.
              </p>
            )}
          </div>
        )}

        {/* Fact of the Moment Card */}
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-[#091522]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400">
                  Curiosity Desk &bull; {activeFact.tag}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-200 leading-snug">
                &ldquo;{activeFact.fact}&rdquo;
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => triggerAIQuery(activeFact.prompt, "physics")}
              className="px-3 py-1.5 bg-[#132338] hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explain in AI</span>
            </button>
            <button
              onClick={handleNextFact}
              title="Next Fact"
              className="p-1.5 bg-[#132338] hover:bg-[#1C324E] border border-slate-700 text-slate-300 rounded-lg text-xs transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Launch Science Query Pills */}
        <div>
          <div className="text-xs font-mono uppercase text-slate-400 mb-2 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Popular Student Science Questions (Click to Ask AI)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "What is light?",
              "Why is the sky blue?",
              "What is sound and how does it travel?",
              "Explain Ohm's Law and V = IR",
              "How does photosynthesis work?",
              "What is an atom made of?",
              "Explain wave-particle duality",
              "What is entropy and the 2nd law of thermodynamics?",
              "How does Bernoulli's principle create lift?",
              "Explain Le Chatelier's principle",
              "How do vaccines train the immune system?",
              "How do neurons fire action potentials?",
              "What is CRISPR gene editing?",
              "What is an exoplanet Goldilocks zone?",
              "Why is Olympus Mons so big?",
              "What is the Cosmic Microwave Background?",
              "How do ocean currents regulate climate?",
              "Why are Ring of Fire volcanoes explosive?",
              "Derive the power rule in calculus",
              "What is the Central Limit Theorem?",
              "Derive the quadratic formula",
              "Derive the 3 equations of motion"
            ].map((query, idx) => (
              <button
                key={idx}
                onClick={() => triggerAIQuery(query, "physics")}
                className="px-2.5 py-1 rounded-full text-xs font-mono bg-[#111A26] border border-[#223348] text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300 hover:bg-[#162438] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{query}</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* Search & Subject Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "All Subjects", icon: Layers },
              { id: "physics", label: "Physics", icon: Atom },
              { id: "chemistry", label: "Chemistry", icon: FlaskConical },
              { id: "biology", label: "Biology", icon: Dna },
              { id: "space", label: "Space & Astronomy", icon: Orbit },
              { id: "earth", label: "Earth Science", icon: Globe2 },
              { id: "math", label: "Mathematics", icon: Calculator },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-sm"
                      : "bg-[#090E17] border border-[#1E293B] text-slate-400 hover:text-slate-200 hover:bg-[#0D1522]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-mono text-slate-400 shrink-0">
            <span>{filteredTopics.length} topic{filteredTopics.length === 1 ? "" : "s"} found</span>
          </div>
        </div>

        {/* Topics Grid */}
        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map((topic) => {
              const CatIcon = topic.categoryIcon;
              return (
                <div
                  key={topic.id}
                  className="p-4 rounded-xl bg-[#09101C] border border-[#1C2C40] hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-emerald-950/20"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-[#122030] text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CatIcon className="w-3 h-3" />
                        {topic.categoryLabel}
                      </span>
                      <button
                        onClick={() => handleCopy(topic.id, `${topic.title}\n\nConcept: ${topic.simpleExplanation}\n\nKey Formula: ${topic.coreFormulaOrConcept}`)}
                        className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-[#152336] transition-colors"
                        title="Copy Summary"
                      >
                        {copiedId === topic.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-slate-100 mb-1.5 group-hover:text-emerald-300 transition-colors">
                      {topic.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {topic.simpleExplanation}
                    </p>

                    {/* Formula / Concept Banner */}
                    <div className="p-2 rounded-lg bg-[#060B12] border border-[#1A2A3E] font-mono text-[11px] text-emerald-300 mb-3 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{topic.coreFormulaOrConcept}</span>
                    </div>

                    {/* Everyday Real-World Example */}
                    <div className="text-[11px] text-slate-400 mb-4 bg-[#0A121E]/60 p-2 rounded border border-slate-800">
                      <span className="text-slate-300 font-semibold block mb-0.5">Everyday Example:</span>
                      {topic.everydayExample}
                    </div>
                  </div>

                  {/* Quick Questions Section */}
                  <div className="border-t border-[#162232] pt-3 mt-auto">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5 font-semibold">
                      Ask AI about this topic:
                    </span>
                    <div className="space-y-1.5">
                      {topic.quickQuestions.map((q, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => triggerAIQuery(q, topic.category === "math" ? "calculus" : "physics")}
                          className="w-full text-left text-[11px] font-mono p-1.5 rounded bg-[#0D1826] hover:bg-emerald-950/40 hover:text-emerald-300 text-slate-300 border border-transparent hover:border-emerald-500/30 transition-all flex items-center justify-between gap-1 group/btn cursor-pointer"
                        >
                          <span className="truncate">{q}</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 text-emerald-400 transition-opacity shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-xl border border-dashed border-emerald-500/30 bg-[#091522]/40 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">
                Ask Quantum AI about &ldquo;{searchQuery}&rdquo;
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 font-mono">
                No static quick card matched &ldquo;{searchQuery}&rdquo;, but Quantum AI can solve and explain this scientific question right away!
              </p>
            </div>
            <button
              onClick={() => triggerAIQuery(searchQuery, "physics")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold inline-flex items-center gap-2 shadow-lg cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Quantum AI: &ldquo;{searchQuery}&rdquo; &rarr;</span>
            </button>
          </div>
        )}

        {/* Bottom Utility Grid: Quick Unit Converter & Periodic Table Quick-Lookup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-[#1C2C40]">
          {/* Quick Unit Converter */}
          <div className="p-4 rounded-xl bg-[#09101C] border border-[#1C2C40] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                <Compass className="w-4 h-4" />
                <span>Quick Unit Converter for Science</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Instant Formulas</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Temperature */}
              <div className="p-3 rounded-lg bg-[#060B12] border border-[#1A2A3E] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <span>Temperature</span>
                  <button
                    onClick={() => setTempUnit((prev) => (prev === "C" ? "F" : "C"))}
                    className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                  >
                    Switch to °{tempUnit === "C" ? "F" : "C"}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tempVal}
                    onChange={(e) => setTempVal(e.target.value)}
                    className="w-20 px-2 py-1 text-xs bg-[#0C1523] border border-slate-700 rounded font-mono text-slate-100"
                  />
                  <span className="text-xs font-mono text-slate-400">°{tempUnit}</span>
                </div>
                <div className="text-[11px] font-mono text-emerald-300 pt-1 border-t border-slate-800">
                  {convertedTemp}
                </div>
              </div>

              {/* Distance */}
              <div className="p-3 rounded-lg bg-[#060B12] border border-[#1A2A3E] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <span>Distance / Speed</span>
                  <button
                    onClick={() => setDistUnit((prev) => (prev === "km" ? "mi" : "km"))}
                    className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                  >
                    Switch to {distUnit === "km" ? "Miles" : "Km"}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={distVal}
                    onChange={(e) => setDistVal(e.target.value)}
                    className="w-20 px-2 py-1 text-xs bg-[#0C1523] border border-slate-700 rounded font-mono text-slate-100"
                  />
                  <span className="text-xs font-mono text-slate-400">{distUnit}</span>
                </div>
                <div className="text-[11px] font-mono text-emerald-300 pt-1 border-t border-slate-800">
                  {convertedDist}
                </div>
              </div>
            </div>
          </div>

          {/* Periodic Elements Quick Sheet */}
          <div className="p-4 rounded-xl bg-[#09101C] border border-[#1C2C40] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                <FlaskConical className="w-4 h-4" />
                <span>Periodic Table Quick Sheet</span>
              </div>
              <input
                type="text"
                value={elementSearch}
                onChange={(e) => setElementSearch(e.target.value)}
                placeholder="Filter element (e.g. Iron, H, Si)..."
                className="px-2 py-1 text-[11px] bg-[#060B12] border border-slate-700 rounded font-mono text-slate-200 placeholder-slate-500 w-44"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
              {filteredElements.map((el) => (
                <button
                  key={el.symbol}
                  onClick={() => triggerAIQuery(`Tell me about element ${el.name} (${el.symbol}), its atomic properties and uses`, "chemistry")}
                  className="p-2 rounded-lg bg-[#060B12] border border-[#1A2A3E] hover:border-emerald-500/40 text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 font-mono">{el.symbol}</span>
                    <span className="text-[10px] text-slate-500 font-mono">#{el.num}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-200 truncate">{el.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{el.use}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
