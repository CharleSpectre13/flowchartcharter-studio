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
}

export interface CharterRun {
  workload: string;
  quality: number;
  trust: boolean;
  remediationLoops: number;
  pathByAgent: Record<string, string>;
  metrics: ExecutionMetrics[];
}

export interface SystemSnapshot {
  roster: Agent[];
  runs: CharterRun[];
  syncOutcomes: Record<string, string>;
  playbook: string[];
  trustRate: number;
  step: number;
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
    },
    {
      id: uid(),
      name: "Auditor-1",
      role: "Audit Manager",
      status: "Active",
      history: [],
      muscleMemory: { path_A: 1, path_B: 1 },
      corporateRank: 3,
      load: 0,
      capability: { audit: 1, general: 0.4 },
    },
  ];
}

export function fitness(history: ExecutionMetrics[]): number {
  if (!history.length) return 0;
  const n = history.length;
  const q = history.reduce((s, m) => s + m.qualityScore, 0) / n;
  const t = history.reduce((s, m) => s + m.executionTime, 0) / n;
  const c = history.reduce((s, m) => s + m.tokenCost, 0) / n;
  const sy = history.reduce((s, m) => s + m.synergyScore, 0) / n;
  const rhythm = t > 0 ? 1 / t : 0;
  // Normalized cost term so short demos don't mass-fire
  return 0.4 * q + 0.3 * rhythm - 0.0002 * c + 0.2 * sy;
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

export function runCharter(roster: Agent[], workload: string): CharterRun {
  const metrics: ExecutionMetrics[] = [];
  const pathByAgent: Record<string, string> = {};
  for (const a of roster) {
    if (a.status === "Fired" || a.role.includes("Audit")) continue;
    const path = pickPath(a);
    pathByAgent[a.name] = path;
    metrics.push(executeUnit(a));
  }
  let quality = metrics.length
    ? metrics.reduce((s, m) => s + m.qualityScore, 0) / metrics.length
    : 0;
  let loops = 0;
  while (quality < 0.9 && loops < 3) {
    loops += 1;
    const batch: ExecutionMetrics[] = [];
    for (const a of roster) {
      if (a.status === "Fired" || a.role.includes("Audit")) continue;
      batch.push(executeUnit(a, 0.12));
    }
    metrics.push(...batch);
    quality = batch.reduce((s, m) => s + m.qualityScore, 0) / Math.max(batch.length, 1);
  }
  return {
    workload,
    quality,
    trust: quality >= 0.9,
    remediationLoops: loops,
    pathByAgent,
    metrics,
  };
}

export function mondayMorningSync(roster: Agent[]): {
  outcomes: Record<string, string>;
  playbook: string[];
} {
  const benchmark = 0.65;
  const outcomes: Record<string, string> = {};
  const playbook: string[] = [];
  for (const a of roster) {
    if (a.role.includes("Boss")) continue;
    const f = fitness(a.history);
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
  return { outcomes, playbook };
}

export function initialSnapshot(): SystemSnapshot {
  return {
    roster: createRoster(),
    runs: [],
    syncOutcomes: {},
    playbook: [],
    trustRate: 0,
    step: 0,
  };
}

export const PHASES = [
  { id: "ST-01", name: "Charter Init", marker: "start" },
  { id: "ST-02", name: "Voluntary Bind", marker: "bind" },
  { id: "ST-03", name: "Super-Step", marker: "superstep" },
  { id: "ST-04", name: "Audit Gate", marker: "gate" },
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
