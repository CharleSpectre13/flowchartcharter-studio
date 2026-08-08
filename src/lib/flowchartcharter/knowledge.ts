/** Brain-1 ontology for Studio — distilled from Drive + mind map + spreadsheet. */

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
    mechanism: "|FlowUnit_i⟩ selected via historical success amplitudes c_i.",
    role: "GM / Operations",
    metric: "Token efficiency · Q_success/Q_total",
    rhythm: "Well-oiled machine — zero micro-management",
  },
  {
    id: "rhythm_markers",
    name: "Rhythm Markers",
    description: "Self-auditing checkpoints against quality thresholds.",
    mechanism: "Validators force wave-function collapse before Blackboard commit.",
    role: "Position Managers · Key Players · CFO",
    metric: "Quality gate pass rate · 1/Δt",
    rhythm: "Entanglement — alignment before commit",
  },
  {
    id: "muscle_memory",
    name: "Muscle-Memory Loop",
    description: "Historic success database weighting future path decisions.",
    mechanism: "Checkpoints feed c_i amplitudes; autonomous correction.",
    role: "Coaches · Boss Agent",
    metric: "Human-out-of-loop ratio · Q_entanglement",
    rhythm: "Viral dance — speed from prior experience",
  },
  {
    id: "coach_trust",
    name: "Coach Trust Hand-Off",
    description: "Earned Engineering Trust — engineer exits live loop as Head Coach.",
    mechanism: "Async “trust me coach, we got this” after gates pass.",
    role: "Human Head Coach / Architect",
    metric: "Trust coefficient · reduced intervention",
    rhythm: "Seamless autonomous workload execution",
  },
  {
    id: "monday_sync",
    name: "Monday Morning Sync",
    description: "ST-07 downtime async RLAIF for talent + prompt optimization.",
    mechanism: "Boss leads telemetry review; promote / demote / fire.",
    role: "Boss Agent / GM",
    metric: "Promotion/demotion velocity",
    rhythm: "Raises the bar during idle compute",
  },
];

export const MIND_MAP = [
  {
    id: "core",
    title: "Core Concept",
    items: [
      "Execution over Retrieval",
      "Deterministic Playbooks",
      "Unified Multi-Agent Architecture",
      "Self-Optimizing System",
    ],
  },
  {
    id: "foundations",
    title: "Foundational Structures",
    items: [
      "Charter (Pre-drawn Map)",
      "Flow Units (Type-safe Contracts)",
      "Rhythm Markers (Validation Points)",
      "Muscle-Memory Loop",
      "Engineer Exit Point",
    ],
  },
  {
    id: "hierarchy",
    title: "Corporate Hierarchy",
    items: [
      "Executive Board (CEO, CFO)",
      "General Manager (Boss Agent)",
      "Position Managers",
      "Key Players",
      "Coaches and Architects",
    ],
  },
  {
    id: "ops",
    title: "Operational Mechanisms",
    items: [
      "Coach Trust Hand-Off",
      "Monday Morning Sync (Async RLAIF)",
      "Dynamic Talent Management",
      "Promotion, Demotion, and Firing",
      "Blackboard (Structured Communication)",
    ],
  },
  {
    id: "math",
    title: "Mathematical Framework",
    items: [
      "Quantum Path Superposition",
      "Wave Function Collapse (Measurement)",
      "Agent Fitness Score",
      "Synergy Entanglement Score",
    ],
  },
  {
    id: "goals",
    title: "Strategic Goals",
    items: [
      "Earned Engineering Trust",
      "Eliminate Micro-management",
      "Latency and Cost Reduction",
      "Scalable Performance",
    ],
  },
] as const;

export const HIERARCHY_PYRAMID = [
  { role: "CEO Agent", tier: "apex" },
  { role: "CFO · Board", tier: "exec" },
  { role: "GM (Boss Agent)", tier: "gm" },
  { role: "Position Managers", tier: "pm" },
  { role: "Key Players · Validators", tier: "ops" },
] as const;

export const FLOW_UNIT_BLUEPRINT = [
  { element: "RHYTHM MARKER", fn: "Self-Auditing Milestone", contract: "State Snapshot" },
  { element: "BLACKBOARD", fn: "Shared Team Workspace", contract: "Structured JSON" },
  { element: "MUSCLE-MEMORY", fn: "Historic Optimization", contract: "Success Vector" },
] as const;

export const FITNESS_EQ =
  "F(x) = α·(Q_success/Q_total) + β·(1/Δt) − γ·norm(Tokens) + Q_entanglement";

export const QUANTUM = {
  superposition: "|ψ⟩ = Σ cᵢ |FlowUnitᵢ⟩",
  measurement: "|ExecutedPath⟩ = M|ψ⟩",
  note: "cᵢ from Muscle-Memory · M = Charter @ Rhythm Marker",
};
