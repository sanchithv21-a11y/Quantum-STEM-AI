import { STEMNewsArticle } from "../types";

export const DAILY_STEM_NEWS_ARTICLES: STEMNewsArticle[] = [
  {
    id: "news-01",
    title: "Fault-Tolerant Topological Qubits Reach 99.98% Fidelity Milestone",
    summary:
      "Physicists demonstrate non-Abelian anyon braiding in semiconductor-superconductor nanowire heterostructures, establishing topological protection against environmental phase decoherence.",
    category: "Quantum & Physics",
    source: "Nature Physics",
    sourceUrl: "https://www.nature.com",
    publishedDate: "Today, 06:30 UTC",
    readTime: "3 min read",
    keyTakeaway:
      "Topological braiding operations suppress local thermal and magnetic noise by over 3 orders of magnitude, approaching the threshold for scalable quantum error correction.",
    paperDoiOrArxiv: "arXiv:2608.09842v1",
    impactScore: "9.8 / 10",
    promptToAnalyze:
      "Quantum, explain the mathematical formulation of non-Abelian anyon braiding and how topological invariants protect quantum information from local Hamiltonian perturbations.",
  },
  {
    id: "news-02",
    title: "JWST Detects Methane and Carbon Dioxide in Habitable-Zone Super-Earth Atmosphere",
    summary:
      "High-resolution transmission spectroscopy from the James Webb Space Telescope reveals atmospheric biosignature gases on exoplanet K2-18b with a 4.8-sigma confidence interval.",
    category: "Astrophysics & Space",
    source: "The Astrophysical Journal Letters",
    sourceUrl: "https://iopscience.ioporg",
    publishedDate: "Today, 04:15 UTC",
    readTime: "4 min read",
    keyTakeaway:
      "Absorption spectra in the 2.5–5.0 μm band confirm a hydrogen-rich atmosphere overlying a potentially water-bearing ocean mantle (Hycean world scenario).",
    paperDoiOrArxiv: "ApJL-2026-8841",
    impactScore: "9.6 / 10",
    promptToAnalyze:
      "Quantum, derive the radiative transfer equation and transmission spectroscopy absorption depth formula $\\Delta \\delta = \\frac{2 R_p h_{\\text{eff}}}{R_*^2}$ for exoplanetary atmospheres.",
  },
  {
    id: "news-03",
    title: "Automated Theorem Prover Resolves 40-Year Open Conjecture in Spectral Graph Theory",
    summary:
      "A neural-symbolic AI verification engine integrated with Lean 4 formally synthesizes an analytic proof regarding the algebraic connectivity bounds of hypergraphs.",
    category: "AI & Mathematics",
    source: "Annals of Mathematics",
    sourceUrl: "https://annals.math.princeton.edu",
    publishedDate: "Yesterday, 19:45 UTC",
    readTime: "5 min read",
    keyTakeaway:
      "Constructed a 12,000-line verifiable Lean 4 proof establishing tight Cheeger constant inequalities for higher-order simplicial complexes.",
    paperDoiOrArxiv: "arXiv:2608.07719v2",
    impactScore: "9.4 / 10",
    promptToAnalyze:
      "Quantum, formulate the algebraic connectivity and Laplacian spectrum definition $\\lambda_2(L)$ of a graph and its relationship to the Cheeger isoperimetric constant $h(G)$.",
  },
  {
    id: "news-04",
    title: "CRISPR Prime-Editing 3.0 Achieves 99.4% Insertion Precision in Somatic Cells",
    summary:
      "Engineered reverse transcriptase domains paired with optimized prime editing guide RNAs (pegRNAs) eliminate double-strand break indel artifacts in human embryonic models.",
    category: "Biotechnology",
    source: "Cell Molecular Systems",
    sourceUrl: "https://www.cell.com",
    publishedDate: "Today, 02:00 UTC",
    readTime: "3 min read",
    keyTakeaway:
      "Eliminates unintended target chromosomal translocations while maintaining high-efficiency point mutation correction for hereditary monogenic disorders.",
    paperDoiOrArxiv: "DOI:10.1016/j.cell.2026.04.012",
    impactScore: "9.2 / 10",
    promptToAnalyze:
      "Quantum, explain the biochemical kinetics and thermodynamic free energy profile of Cas9-H840A nickase prime-editing complexes during reverse transcription.",
  },
  {
    id: "news-05",
    title: "Tandem Perovskite-Silicon Solar Cells Shatter World Record with 34.8% Certified Efficiency",
    summary:
      "Self-assembled 2D passivation monolayers overcome carrier recombination at the perovskite/C60 interface, delivering industrial-grade stability under continuous 1-sun illumination.",
    category: "Energy & Materials",
    source: "Science Advances",
    sourceUrl: "https://www.science.org",
    publishedDate: "Yesterday, 14:20 UTC",
    readTime: "3 min read",
    keyTakeaway:
      "Dual-junction bandgap optimization ($E_g = 1.68\\text{ eV}$ top cell, $E_g = 1.12\\text{ eV}$ bottom cell) exceeds the single-junction Shockley-Queisser limit of 33.7%.",
    paperDoiOrArxiv: "DOI:10.1126/sciadv.2026.9011",
    impactScore: "9.1 / 10",
    promptToAnalyze:
      "Quantum, calculate the thermodynamic Shockley-Queisser limit and explain how tandem subcell bandgap splitting overcomes thermalization losses.",
  },
  {
    id: "news-06",
    title: "Tokamak Fusion Reactor Sustains 120 Million °C High-Beta Plasma for 1,024 Seconds",
    summary:
      "Advanced magnetic divertor coils and AI-driven magnetohydrodynamic feedback stabilization prevent edge-localized modes (ELMs) in steady-state D-T equivalent regimes.",
    category: "Quantum & Physics",
    source: "Nuclear Fusion Letters",
    sourceUrl: "https://iopscience.iop.org",
    publishedDate: "Yesterday, 11:00 UTC",
    readTime: "4 min read",
    keyTakeaway:
      "Normalized beta parameter $\\beta_N = 3.4$ maintained with zero disruptions, validating magnet design for next-generation pilot power plants.",
    paperDoiOrArxiv: "NF-2026-3392",
    impactScore: "9.5 / 10",
    promptToAnalyze:
      "Quantum, derive the Lawson criterion $n \\tau_E T \\ge 3 \\times 10^{21}\\text{ keV}\\cdot\\text{s}/\\text{m}^3$ for self-sustaining thermonuclear D-T fusion ignition.",
  },
];
