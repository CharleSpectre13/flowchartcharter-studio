export type AgentStatus = "Active" | "Promoted" | "Demoted" | "Fired";

export interface ExecutionMetrics {
  tokenCost: number;
  executionTime: number;
  qualityScore: number;
  synergyScore: number;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  history: ExecutionMetrics[];
  muscleMemory: Record<string, number>;
  corporateRank: number;
  load: number;
  capability: Record<string, number>;
  talentEligible: boolean;
  layer: "ops" | "exec" | "audit";
}

export type VectorType =
  | "StrategyVector"
  | "BudgetVector"
  | "GovernanceVector"
  | "OpsVector"
  | "RhythmAudit";

export interface ExecVector {
  type: VectorType;
  from?: string;
  charter_id?: string;
  marker?: string;
  quality?: number;
  threshold?: number;
  passed?: boolean;
  trust_signal?: boolean;
  approve_hand_off?: boolean;
  token_spend?: number;
  token_budget?: number;
  halt_if_over?: boolean;
  notes?: string;
  roster_outcomes?: Record<string, string>;
  [key: string]: unknown;
}

export interface CharterRun {
  workload: string;
  quality: number;
  trust: boolean;
  remediationLoops: number;
  pathByAgent: Record<string, string>;
  metrics: ExecutionMetrics[];
  auditPassed: boolean;
  governanceApproved: boolean;
  vectors: ExecVector[];
}

export interface SystemSnapshot {
  roster: Agent[];
  executives: { ceo: string; cfo: string; board: string; gm: string };
  runs: CharterRun[];
  syncOutcomes: Record<string, string>;
  playbook: string[];
  vectors: ExecVector[];
  trustRate: number;
  step: number;
  tokenSpend: number;
  tokenBudget: number;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function createRoster(): Agent[] {
  return [
    {
      id: uid(),
      name: "Worker-1",
      role: "Key Player — Data Extraction",
      status: "Active",
      history: [],
      muscleMemory: { path_A: 1, path_B: 1 },
      corporateRank: 1,
      load: 0,
      capability: { extraction: 1, general: 0.5 },
      talentEligible: true,
      layer: "ops",
    },
    {
      id: uid(),
      name: "Worker-2",
      role: "Key Player — Validation",
      status: "Active",
      history: [],
      muscleMemory: { path_A: 1, path_B: 1 },
      corporateRank: 1,
      load: 0,
      capability: { validation: 1, general: 0.5 },
      talentEligible: true,
      layer: "ops",
    },
    {
      id: uid(),
      name: "Worker-3",
      role: "Position Manager — Synthesizer",
      status: "Active",
      history: [],
      muscleMemory: { path_A: 1.2, path_B: 0.8 },
      corporateRank: 2,
      load: 0,
      capability: { synthesis: 1, general: 0.6 },
      talentEligible: true,
      layer: "ops",
    },
    {
      id: uid(),
      name: "Validator-1",
      role: "Rhythm Marker Validator",
      status: "Active",
      history: [],
      muscleMemory: { path_A: 1, path_B: 1 },
      corporateRank: 4,
      load: 0,
      capability: { audit: 1, general: 0.4 },
      talentEligible: false,
      layer: "audit",
    },
  ];
}

const COST_NORM = 300;

export function fitness(history: ExecutionMetrics[]): number {
  if (!history.length) return 0;
  const n = history.length;
  const q = history.reduce((s, m) => s + m.qualityScore, 0) / n;
  const t = history.reduce((s, m) => s + m.executionTime, 0) / n;
  const c = history.reduce((s, m) => s + m.tokenCost, 0) / n;
  const sy = history.reduce((s, m) => s + m.synergyScore, 0) / n;
  const rhythm = t > 0 ? 1 / t : 0;
  return 0.4 * q + 0.3 * rhythm - 0.15 * (c / COST_NORM) + 0.2 * sy;
}

function pickPath(agent: Agent): string {
  const paths = ["path_A", "path_B"] as const;
  const total = paths.reduce((s, p) => s + (agent.muscleMemory[p] ?? 1), 0);
  let r = Math.random() * total;
  for (const p of paths) {
    r -= agent.muscleMemory[p] ?? 1;
    if (r <= 0) return p;
  }
  return "path_A";
}

function executeUnit(agent: Agent, qualityBias = 0): ExecutionMetrics {
  const m: ExecutionMetrics = {
    tokenCost: Math.floor(rand(80, 280)),
    executionTime: rand(0.4, 1.8),
    qualityScore: Math.min(1, Math.max(0, rand(0.78, 0.98) + qualityBias)),
    synergyScore: rand(0.82, 1),
  };
  agent.history.push(m);
  agent.load = Math.min(1, agent.load + 0.08);
  return m;
}

function rhythmAudit(
  charterId: string,
  quality: number,
  threshold: number,
  loops: number,
): ExecVector {
  const passed = quality >= threshold && loops <= 3;
  return {
    type: "RhythmAudit",
    marker: "gate",
    charter_id: charterId,
    quality: Number(quality.toFixed(4)),
    threshold,
    passed,
    remediation_loops: loops,
    blocking_issues: passed ? [] : [`quality ${quality.toFixed(3)} < ${threshold}`],
  };
}

export function runCharter(
  roster: Agent[],
  workload: string,
  prevVectors: ExecVector[],
  tokenSpend: number,
  tokenBudget: number,
): { run: CharterRun; vectors: ExecVector[]; tokenSpend: number } {
  const vectors: ExecVector[] = [...prevVectors];
  vectors.push({
    type: "StrategyVector",
    from: "CEO",
    charter_id: workload,
    priority: 0.7,
    budget_cap_tokens: tokenBudget,
    quality_floor: 0.9,
  });

  const metrics: ExecutionMetrics[] = [];
  const pathByAgent: Record<string, string> = {};
  for (const a of roster) {
    if (a.status === "Fired" || a.layer !== "ops") continue;
    const path = pickPath(a);
    pathByAgent[a.name] = path;
    metrics.push(executeUnit(a));
  }
  let quality = metrics.length
    ? metrics.reduce((s, m) => s + m.qualityScore, 0) / metrics.length
    : 0;
  let loops = 0;
  let audit = rhythmAudit(workload, quality, 0.9, loops);
  vectors.push(audit);

  while (!audit.passed && loops < 3) {
    loops += 1;
    const batch: ExecutionMetrics[] = [];
    for (const a of roster) {
      if (a.status === "Fired" || a.layer !== "ops") continue;
      batch.push(executeUnit(a, 0.12));
    }
    metrics.push(...batch);
    quality = batch.reduce((s, m) => s + m.qualityScore, 0) / Math.max(batch.length, 1);
    audit = rhythmAudit(workload, quality, 0.9, loops);
    vectors.push(audit);
  }

  const spend = metrics.reduce((s, m) => s + m.tokenCost, 0);
  const nextSpend = tokenSpend + spend;
  vectors.push({
    type: "BudgetVector",
    from: "CFO",
    charter_id: workload,
    token_spend: nextSpend,
    token_budget: tokenBudget,
    cost_penalty_gamma: 0.001,
    halt_if_over: nextSpend > tokenBudget,
  });

  const trust = Boolean(audit.passed) && quality >= 0.9;
  vectors.push({
    type: "GovernanceVector",
    from: "Board",
    charter_id: workload,
    trust_signal: trust,
    approve_hand_off: trust,
    notes: trust ? "hand-off approved" : "hand-off withheld",
  });

  return {
    run: {
      workload,
      quality,
      trust,
      remediationLoops: loops,
      pathByAgent,
      metrics,
      auditPassed: Boolean(audit.passed),
      governanceApproved: trust,
      vectors: vectors.slice(-6),
    },
    vectors,
    tokenSpend: nextSpend,
  };
}

export function mondayMorningSync(
  roster: Agent[],
  prevVectors: ExecVector[],
  tokenSpend: number,
  tokenBudget: number,
  lastTrust: boolean,
  lastQuality: number,
): {
  outcomes: Record<string, string>;
  playbook: string[];
  vectors: ExecVector[];
} {
  const benchmark = 0.65;
  const outcomes: Record<string, string> = {};
  const playbook: string[] = [];
  const fitnessSnap: Record<string, number> = {};

  for (const a of roster) {
    if (!a.talentEligible || !a.history.length) continue;
    const f = fitness(a.history);
    fitnessSnap[a.name] = Number(f.toFixed(4));
    if (f >= benchmark * 1.15) {
      a.status = "Promoted";
      a.corporateRank = Math.min(10, a.corporateRank + 1);
      outcomes[a.name] = "PROMOTED";
      playbook.push(`Promote ${a.name}: F=${f.toFixed(3)}`);
    } else if (f < benchmark * 0.55) {
      a.status = "Fired";
      outcomes[a.name] = "FIRED";
      playbook.push(`Fire ${a.name}: F=${f.toFixed(3)}`);
    } else {
      a.status = "Active";
      a.muscleMemory.path_A = Math.max(0.1, (a.muscleMemory.path_A ?? 1) + rand(-0.05, 0.15));
      outcomes[a.name] = "RETAINED";
      playbook.push(`Retain ${a.name}: F=${f.toFixed(3)}`);
    }
  }

  const vectors = [...prevVectors];
  vectors.push({
    type: "OpsVector",
    from: "GM",
    charter_id: "downtime-sync",
    roster_outcomes: { ...outcomes },
    fitness_snapshot: fitnessSnap,
    playbook_updates: playbook.slice(0, 8),
  });
  vectors.push({
    type: "StrategyVector",
    from: "CEO",
    charter_id: "downtime-sync",
    priority: 0.6,
    budget_cap_tokens: tokenBudget,
    quality_floor: 0.9,
  });
  vectors.push({
    type: "BudgetVector",
    from: "CFO",
    charter_id: "downtime-sync",
    token_spend: tokenSpend,
    token_budget: tokenBudget,
    halt_if_over: tokenSpend > tokenBudget,
  });
  vectors.push({
    type: "GovernanceVector",
    from: "Board",
    charter_id: "downtime-sync",
    trust_signal: lastTrust,
    approve_hand_off: lastTrust && lastQuality >= 0.9,
    notes: lastTrust ? "fleet stable" : "review remediation",
  });

  return { outcomes, playbook, vectors };
}

export function initialSnapshot(): SystemSnapshot {
  return {
    roster: createRoster(),
    executives: {
      ceo: "CEO-Prime",
      cfo: "CFO-Ledger",
      board: "Board-Spectre",
      gm: "Alpha-GM",
    },
    runs: [],
    syncOutcomes: {},
    playbook: [],
    vectors: [],
    trustRate: 0,
    step: 0,
    tokenSpend: 0,
    tokenBudget: 50_000,
  };
}

export const PHASES = [
  { id: "ST-01", name: "Charter Init", marker: "start" },
  { id: "ST-02", name: "Voluntary Bind", marker: "bind" },
  { id: "ST-03", name: "Super-Step", marker: "superstep" },
  { id: "ST-04", name: "Rhythm Audit", marker: "gate" },
  { id: "ST-05", name: "Muscle Memory", marker: "loop" },
  { id: "ST-06", name: "Coach Trust", marker: "handoff" },
  { id: "ST-07", name: "Monday Sync", marker: "sync" },
] as const;

export const WORKLOADS = [
  "Enterprise Data Migration",
  "API Integration Synthesis",
  "Security Audit Routing",
  "Realtime Telemetry Charter",
] as const;
