import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  GitBranch,
  Layers,
  Network,
  Play,
  RefreshCw,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import {
  PHASES,
  WORKLOADS,
  fitness,
  initialSnapshot,
  mondayMorningSync,
  runCharter,
  type ExecVector,
  type QuantumCollapse,
  type SystemSnapshot,
} from "@/lib/flowchartcharter/engine";
import {
  FITNESS_EQ,
  FLOW_UNIT_BLUEPRINT,
  FOUNDATIONS,
  HIERARCHY_PYRAMID,
  MIND_MAP,
  QUANTUM,
} from "@/lib/flowchartcharter/knowledge";

export const Route = createFileRoute("/")({
  component: StudioPage,
});

type Tab = "live" | "blueprint" | "mindmap";

function StudioPage() {
  const [snap, setSnap] = useState<SystemSnapshot>(() => initialSnapshot());
  const [activePhase, setActivePhase] = useState(0);
  const [tab, setTab] = useState<Tab>("live");
  const [log, setLog] = useState<string[]>([
    "Quantum routing online — |ψ⟩ → M|ψ⟩ collapse at super-step · muscle-memory reinforce.",
  ]);
  const [busy, setBusy] = useState(false);

  const lastRun = snap.runs[snap.runs.length - 1];

  const avgFitness = useMemo(() => {
    const ops = snap.roster.filter((a) => a.talentEligible && a.history.length);
    if (!ops.length) return 0;
    return ops.reduce((s, a) => s + fitness(a.history), 0) / ops.length;
  }, [snap.roster]);

  function pushLog(line: string) {
    setLog((prev) => [line, ...prev].slice(0, 48));
  }

  async function animatePhases(until: number) {
    for (let i = 0; i <= until; i++) {
      setActivePhase(i);
      await new Promise((r) => setTimeout(r, 140));
    }
  }

  async function onRunCharter() {
    if (busy) return;
    setBusy(true);
    setTab("live");
    const workload = WORKLOADS[snap.runs.length % WORKLOADS.length];
    await animatePhases(5);
    setSnap((prev) => {
      const roster = prev.roster.map((a) => ({
        ...a,
        history: [...a.history],
        muscleMemory: { ...a.muscleMemory },
      }));
      const { run, vectors, tokenSpend } = runCharter(
        roster,
        workload,
        prev.vectors,
        prev.tokenSpend,
        prev.tokenBudget,
      );
      const runs = [...prev.runs, run];
      const trustRate = runs.filter((r) => r.trust).length / runs.length;
      pushLog(
        `CHARTER "${workload}" · Q=${run.quality.toFixed(3)} · collapses=${run.collapses.length} · Q_ent=${run.entanglement} · trust=${run.trust}`,
      );
      for (const c of run.collapses.filter((x) => x.marker === "superstep")) {
        pushLog(
          `  M|ψ⟩ ${c.agent} → ${c.chosenPath} (H=${c.preEntropy} → 0 · conf=1.0)`,
        );
      }
      return {
        ...prev,
        roster,
        runs,
        vectors,
        tokenSpend,
        trustRate,
        step: prev.step + 1,
        lastCollapses: run.collapses,
      };
    });
    setBusy(false);
  }

  async function onSync() {
    if (busy) return;
    setBusy(true);
    setTab("live");
    await animatePhases(6);
    setSnap((prev) => {
      const roster = prev.roster.map((a) => ({
        ...a,
        history: [...a.history],
        muscleMemory: { ...a.muscleMemory },
      }));
      const last = prev.runs[prev.runs.length - 1];
      const { outcomes, playbook, vectors } = mondayMorningSync(
        roster,
        prev.vectors,
        prev.tokenSpend,
        prev.tokenBudget,
        last?.trust ?? false,
        last?.quality ?? 0,
      );
      pushLog(
        `MONDAY SYNC · ${Object.entries(outcomes)
          .map(([k, v]) => `${k}:${v}`)
          .join(" · ") || "stable"}`,
      );
      return {
        ...prev,
        roster,
        syncOutcomes: outcomes,
        playbook: [...playbook, ...prev.playbook].slice(0, 24),
        vectors,
        step: prev.step + 1,
      };
    });
    setBusy(false);
  }

  function onReset() {
    setSnap(initialSnapshot());
    setActivePhase(0);
    setLog(["Reset — fresh roster, empty |ψ⟩ amplitudes."]);
  }

  const recentVectors = [...snap.vectors].reverse().slice(0, 8);
  const collapses = snap.lastCollapses.filter((c) => c.marker === "superstep");

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">FlowChartCharter Studio</div>
              <div className="text-xs text-muted">
                Quantum routing · |ψ⟩ → M|ψ⟩ · Cycle 4
              </div>
            </div>
          </div>
          <nav className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface-2 p-1">
            {(
              [
                ["live", "Live", Play],
                ["blueprint", "Blueprint", Layers],
                ["mindmap", "Mind map", Network],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`inline-flex min-h-10 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${
                  tab === id ? "bg-primary text-primary-fg" : "text-muted hover:text-fg"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {tab === "live" && (
          <>
            <section className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
              <div className="rounded-xl border border-border bg-surface p-5">
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <Zap className="h-4 w-4" />
                  <h1 className="text-lg font-semibold">Charter map</h1>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted">
                  At ST-03 each agent builds |ψ⟩ from muscle-memory, then the Charter measures
                  M|ψ⟩ → one definitive path (confidence 1.0). Outcomes reinforce amplitudes.
                </p>
                <ol className="grid gap-2 sm:grid-cols-2">
                  {PHASES.map((p, i) => {
                    const active = i === activePhase;
                    const done = i < activePhase || (lastRun && i <= 5);
                    return (
                      <li
                        key={p.id}
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm ${
                          active
                            ? "border-primary/50 bg-primary/10"
                            : done
                              ? "border-border bg-surface-2"
                              : "border-border/60 text-muted"
                        }`}
                      >
                        <span className="font-mono text-xs text-primary">{p.id}</span>
                        <span className="flex-1">{p.name}</span>
                        {done ? <CheckCircle2 className="h-3.5 w-3.5 text-ok" /> : null}
                      </li>
                    );
                  })}
                </ol>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={onRunCharter}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg disabled:opacity-50"
                  >
                    <Play className="h-4 w-4" />
                    Run charter
                  </button>
                  <button
                    type="button"
                    disabled={busy || snap.runs.length === 0}
                    onClick={onSync}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm disabled:opacity-50"
                  >
                    <Users className="h-4 w-4" />
                    Monday morning sync
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={onReset}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-muted disabled:opacity-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                <MetricCard
                  icon={<Shield className="h-4 w-4" />}
                  label="Coach trust rate"
                  value={`${Math.round(snap.trustRate * 100)}%`}
                  hint="Board GovernanceVector hand-off"
                />
                <MetricCard
                  icon={<Activity className="h-4 w-4" />}
                  label="Entanglement Q"
                  value={lastRun ? lastRun.entanglement.toFixed(3) : "—"}
                  hint="Team synergy across sequential units"
                />
                <MetricCard
                  icon={<Briefcase className="h-4 w-4" />}
                  label="Pre-measure entropy"
                  value={lastRun ? lastRun.meanPreEntropy.toFixed(3) : "—"}
                  hint="H(|ψ⟩) before collapse → 0 after M"
                />
              </div>
            </section>

            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted">
                Quantum path collapse
              </h2>
              <p className="mb-3 font-mono text-[11px] text-muted">
                {QUANTUM.superposition} · {QUANTUM.measurement}
              </p>
              {collapses.length === 0 ? (
                <p className="text-sm text-muted">
                  Run a charter to watch |ψ⟩ amplitudes collapse into definitive paths.
                </p>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-3">
                  {collapses.map((c) => (
                    <CollapseCard key={`${c.agent}-${c.marker}`} c={c} />
                  ))}
                </ul>
              )}
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                  Roster · muscle memory
                </h2>
                <ul className="space-y-2">
                  {snap.roster.map((a) => {
                    const f = fitness(a.history);
                    const total =
                      (a.muscleMemory.path_A ?? 1) + (a.muscleMemory.path_B ?? 1);
                    const pA = ((a.muscleMemory.path_A ?? 1) / total) * 100;
                    return (
                      <li
                        key={a.id}
                        className="rounded-lg border border-border bg-surface-2 px-3 py-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <div className="text-sm font-medium">{a.name}</div>
                            <div className="text-xs text-muted">{a.role}</div>
                          </div>
                          <div className="text-right font-mono text-xs text-muted">
                            {a.status}
                            {a.talentEligible && a.history.length ? ` · F=${f.toFixed(3)}` : ""}
                          </div>
                        </div>
                        {a.layer === "ops" && (
                          <div className="mt-2">
                            <div className="mb-0.5 flex justify-between font-mono text-[10px] text-muted">
                              <span>path_A {(a.muscleMemory.path_A ?? 1).toFixed(2)}</span>
                              <span>path_B {(a.muscleMemory.path_B ?? 1).toFixed(2)}</span>
                            </div>
                            <div className="flex h-1.5 overflow-hidden rounded-full bg-bg">
                              <div
                                className="bg-primary transition-all"
                                style={{ width: `${pA}%` }}
                              />
                              <div
                                className="bg-accent/80 transition-all"
                                style={{ width: `${100 - pA}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                  Executive wire
                </h2>
                {recentVectors.length === 0 ? (
                  <p className="text-sm text-muted">Run a charter to stream typed vectors.</p>
                ) : (
                  <ul className="max-h-72 space-y-1.5 overflow-auto">
                    {recentVectors.map((v, i) => (
                      <li
                        key={`${v.type}-${i}`}
                        className="rounded-md border border-border bg-surface-2 px-2.5 py-1.5 font-mono text-[11px] text-muted"
                      >
                        <VectorLine v={v} />
                      </li>
                    ))}
                  </ul>
                )}
                <h2 className="mb-2 mt-4 text-sm font-semibold uppercase tracking-wide text-muted">
                  Event log
                </h2>
                <ul className="max-h-40 space-y-1 overflow-auto font-mono text-xs text-muted">
                  {log.map((line, i) => (
                    <li key={i} className="border-b border-border/50 py-1">
                      <ArrowRight className="mr-1 inline h-3 w-3 text-primary" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}

        {tab === "blueprint" && (
          <section className="space-y-4">
            <div className="rounded-xl border border-border bg-surface p-5">
              <h1 className="mb-1 text-lg font-semibold">Foundational structures</h1>
              <p className="mb-4 text-sm text-muted">DNA of FlowChartCharter + quantum measurement model.</p>
              <div className="grid gap-3 md:grid-cols-2">
                {FOUNDATIONS.map((f) => (
                  <article key={f.id} className="rounded-lg border border-border bg-surface-2 p-4">
                    <h3 className="text-sm font-semibold text-primary">{f.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{f.description}</p>
                    <p className="mt-2 text-[11px] text-muted">
                      <span className="font-semibold text-fg/80">Mechanism · </span>
                      {f.mechanism}
                    </p>
                  </article>
                ))}
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-3 text-sm font-semibold text-primary">Flow Unit Blueprint</h2>
                <table className="w-full text-left text-xs">
                  <thead className="text-muted">
                    <tr className="border-b border-border">
                      <th className="py-2 pr-2">Element</th>
                      <th className="py-2 pr-2">Function</th>
                      <th className="py-2">Contract</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FLOW_UNIT_BLUEPRINT.map((row) => (
                      <tr key={row.element} className="border-b border-border/60">
                        <td className="py-2 pr-2 font-mono text-primary">{row.element}</td>
                        <td className="py-2 pr-2 text-muted">{row.fn}</td>
                        <td className="py-2 text-muted">{row.contract}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-3 text-sm font-semibold text-primary">Hierarchy</h2>
                <div className="mx-auto flex max-w-xs flex-col items-center gap-1.5">
                  {HIERARCHY_PYRAMID.map((r, i) => (
                    <div
                      key={r.role}
                      className="rounded-md border border-border bg-surface-2 py-2 text-center text-xs font-medium"
                      style={{ width: `${100 - i * 10}%` }}
                    >
                      {r.role}
                    </div>
                  ))}
                </div>
                <p className="mt-4 font-mono text-[11px] text-muted">{FITNESS_EQ}</p>
              </div>
            </div>
          </section>
        )}

        {tab === "mindmap" && (
          <section className="space-y-4">
            <div className="rounded-xl border border-border bg-surface p-5">
              <h1 className="mb-1 text-lg font-semibold">FlowChartCharter Engineering</h1>
              <p className="mb-5 text-sm text-muted">Brain 1 communities — structural precision over parameter scale.</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {MIND_MAP.map((branch) => (
                  <div key={branch.id} className="rounded-xl border border-border bg-surface-2 p-4">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                      {branch.title}
                    </div>
                    <ul className="space-y-1.5">
                      {branch.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-md border border-border/80 bg-bg/40 px-2.5 py-1.5 text-xs"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <footer className="border-t border-border pb-8 pt-4 text-center text-xs text-muted">
          Cycle 4 · QuantumRouter · |ψ⟩ = Σ cᵢ|FlowUnitᵢ⟩ · M = Charter @ RhythmMarker
        </footer>
      </main>
    </div>
  );
}

function CollapseCard({ c }: { c: QuantumCollapse }) {
  return (
    <li className="rounded-lg border border-border bg-surface-2 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{c.agent}</span>
        <span className="rounded bg-primary/15 px-2 py-0.5 font-mono text-[10px] text-primary">
          {c.chosenPath}
        </span>
      </div>
      <div className="mt-1 font-mono text-[10px] text-muted">
        H={c.preEntropy} → 0 · conf={c.confidence}
        {c.quality != null ? ` · Q=${c.quality}` : ""}
      </div>
      <div className="mt-2 space-y-1">
        {c.amplitudes.map((a) => (
          <div key={a.path}>
            <div className="mb-0.5 flex justify-between font-mono text-[10px] text-muted">
              <span>
                {a.path} c={a.c}
              </span>
              <span>p={a.p}</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-bg">
              <div
                className={
                  a.path === c.chosenPath ? "h-full bg-primary" : "h-full bg-muted/40"
                }
                style={{ width: `${Math.round(a.p * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </li>
  );
}

function VectorLine({ v }: { v: ExecVector }) {
  if (v.type === "RhythmAudit") {
    return (
      <span>
        <span className="text-primary">{v.type}</span> Q={v.quality} passed={String(v.passed)}
      </span>
    );
  }
  if (v.type === "GovernanceVector") {
    return (
      <span>
        <span className="text-primary">{v.type}</span> hand_off={String(v.approve_hand_off)}
      </span>
    );
  }
  if (v.type === "BudgetVector") {
    return (
      <span>
        <span className="text-primary">{v.type}</span> spend={v.token_spend}/{v.token_budget}
      </span>
    );
  }
  return (
    <span>
      <span className="text-primary">{v.type}</span> from={v.from}
    </span>
  );
}

function MetricCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-2 flex items-center gap-2 text-primary">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      </div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-[10px] text-muted">{hint}</div>
    </div>
  );
}
