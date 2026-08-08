/** Brain-1 ontology for Studio — distilled from Drive + mind map + Advanced Blueprint. */

export interface Foundation {
  id: string;
  name: string;
  description: string;
  mechanism: string;
  role: string;
  metric: string;
  rhythm: string;
}

export const FOUNDATIONS: Foundation[] = [
  {
    id: "charter",
    name: "Charter",
    description: "Pre-drawn deterministic playbook — agents follow rather than search.",
    mechanism: "Measurement operator M collapses path superposition to 100% confident action.",
    role: "Executive Board / Head Coach",
    metric: "Path accuracy · Determinism confidence 1.0",
    rhythm: "Cheat-sheet blueprint — agents move in unison",
  },
  {
    id: "flow_units",
    name: "Flow Units",
    description: "Type-safe modular work blocks with explicit I/O and exit criteria.",
    mechanism: "|FlowUnit_i⟩ selected via historical success amplitudes c_i × H_ctx affinity.",
    role: "GM / Operations",
    metric: "Token efficiency · Q_success/Q_total",
    rhythm: "Well-oiled machine — zero micro-management",
  },
  {
    id: "rhythm_markers",
    name: "Rhythm Markers",
    description: "Self-auditing checkpoints against quality thresholds + Q_s schema gates.",
    mechanism: "EvaluateRhythmMarker: Q_s = exp(−k·D); fail routes back without human.",
    role: "Position Managers · Key Players · CFO",
    metric: "Quality gate pass rate · Q_s · 1/Δt",
    rhythm: "Entanglement — alignment before commit",
  },
  {
    id: "muscle_memory",
    name: "Muscle-Memory Loop",
    description: "Repeated runs + checkpoint history harden the path (QueryMuscleMemory).",
    mechanism: "Vector store of successful completions replaces open-graph RAG under pressure.",
    role: "All agents · Boss Agent",
    metric: "Precedent hit-rate · weight convergence",
    rhythm: "Cheat codes from history",
  },
  {
    id: "coach_trust",
    name: "Engineer Exit / Coach Trust Hand-Off",
    description: "Earned autonomy when quality gates pass — human exits the flow.",
    mechanism: "Board GovernanceVector approve_hand_off when trust ∧ quality ≥ floor.",
    role: "Head Coach · Board",
    metric: "Trust rate · hand-off approvals",
    rhythm: "Engineer out of the loop",
  },
  {
    id: "monday_sync",
    name: "Monday Morning Sync",
    description: "Downtime RLAIF — fitness, promote/demote/fire, re-weight paths.",
    mechanism: "TriggerMondayMorningSync + AdjustCorporateRoster skills.",
    role: "Boss Agent (GM)",
    metric: "F(x) vs industry benchmark",
    rhythm: "Idle compute → fleet optimization",
  },
];

export const MIND_MAP = [
  {
    id: "core",
    title: "Core Concept",
    items: [
      "Execution-first vs GraphRAG retrieval-first",
      "Charter owns the journey",
      "Deterministic Flow Units",
      "Coach Trust Hand-Off",
    ],
  },
  {
    id: "foundations",
    title: "Foundational Structures",
    items: [
      "Charter",
      "Flow Units",
      "Rhythm Markers",
      "Muscle-Memory Loop",
      "Engineer Exit",
      "Monday Morning Sync",
    ],
  },
  {
    id: "hierarchy",
    title: "Corporate Hierarchy",
    items: ["CEO", "CFO (token economics)", "Board", "Boss Agent / GM", "Position Managers", "Key Players"],
  },
  {
    id: "ops",
    title: "Operational Mechanisms",
    items: [
      "Blackboard JSON only",
      "BSP super-steps",
      "Voluntary bind",
      "Five agent skills",
      "CFO budget matrix",
    ],
  },
  {
    id: "math",
    title: "Mathematical Framework",
    items: [
      "|ψ⟩ = Σ cᵢ|FlowUnitᵢ⟩",
      "H_ctx contextual entropy",
      "Q_s = exp(−k·D)",
      "F(x) fitness score",
      "CFO path-cost interrupt",
    ],
  },
  {
    id: "goals",
    title: "Strategic Goals",
    items: [
      "Engineer happiness & exit",
      "Token/latency savings",
      "Industry benchmark lift",
      "Open design standard",
    ],
  },
];

export const HIERARCHY_PYRAMID = [
  { role: "Head Coach (Human Engineer)" },
  { role: "CEO · CFO · Board" },
  { role: "Boss Agent (GM)" },
  { role: "Position Managers" },
  { role: "Key Players · Validators" },
];

export const FLOW_UNIT_BLUEPRINT = [
  { element: "Input schema", fn: "Typed contract", contract: "JSON / Pydantic" },
  { element: "Action", fn: "Deterministic unit work", contract: "Side-effect bounded" },
  { element: "Exit criteria", fn: "Quality + Q_s gate", contract: "≥ floor" },
  { element: "Rhythm marker", fn: "Self-audit checkpoint", contract: "Maker-checker" },
  { element: "Handoff", fn: "Blackboard post", contract: "No NL filler" },
];

export const FITNESS_EQ =
  "F(x) = α·(Q_success/Q_total) + β·(1/Δt) − γ·norm(Tokens) + Q_s";

export const QUANTUM = {
  superposition: "|ψ⟩ = Σ cᵢ |FlowUnitᵢ⟩ · affinity(H_ctx)",
  measurement: "|ExecutedPath⟩ = M|ψ⟩  (CFO matrix pre-gate)",
  synergy: "Q_s = exp(−k · D)",
  note: "cᵢ from Muscle-Memory · H_ctx → cleansing bias · M = Charter @ Rhythm Marker",
};

export const SKILL_CATALOG = [
  { name: "QueryMuscleMemory", purpose: "Precedent cheat-codes (replaces open RAG)" },
  { name: "EvaluateRhythmMarker", purpose: "Schema self-audit · Q_s gate" },
  { name: "ExecuteQuantumCollapse", purpose: "Tensor routing decision engine" },
  { name: "TriggerMondayMorningSync", purpose: "Downtime RLAIF + re-weights" },
  { name: "AdjustCorporateRoster", purpose: "PROMOTE | DEMOTE | FIRE" },
];
