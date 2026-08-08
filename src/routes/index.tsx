import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  GitBranch,
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
  type SystemSnapshot,
} from "@/lib/flowchartcharter/engine";

export const Route = createFileRoute("/")({
  component: StudioPage,
});

function StudioPage() {
  const [snap, setSnap] = useState<SystemSnapshot>(() => initialSnapshot());
  const [activePhase, setActivePhase] = useState(0);
  const [log, setLog] = useState<string[]>([
    "Cycle 2 ready — CEO/CFO/Board typed vectors · RhythmAudit at ST-04.",
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
      await new Promise((r) => setTimeout(r, 160));
    }
  }

  async function onRunCharter() {
    if (busy) return;
    setBusy(true);
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
        `CHARTER "${workload}" · Q=${run.quality.toFixed(3)} · audit=${run.auditPassed} · trust=${run.trust} · loops=${run.remediationLoops}`,
      );
      return {
        ...prev,
        roster,
        runs,
        vectors,
        tokenSpend,
        trustRate,
        step: prev.step + 1,
      };
    });
    setBusy(false);
  }

  async function onSync() {
    if (busy) return;
    setBusy(true);
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
          .join(" · ") || "no operational changes"}`,
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
    setLog(["System reset — fresh roster, empty executive wire."]);
  }

  const recentVectors = [...snap.vectors].reverse().slice(0, 10);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">FlowChartCharter Studio</div>
              <div className="text-xs text-muted">Cycle 2 · Executive vectors · RhythmAudit</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://github.com/CharleSpectre13/flowchartcharter"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:text-fg hover:border-primary/40"
            >
              Core repo
            </a>
            <a
              href="https://github.com/CharleSpectre13/flowchartcharter-loop"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:text-fg hover:border-primary/40"
            >
              Learning loop
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <section className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Zap className="h-4 w-4" />
              <h1 className="text-lg font-semibold">Charter map</h1>
            </div>
            <p className="mb-4 text-sm text-muted leading-relaxed">
              Pre-drawn flow units with RhythmAudit gates. Executives speak only in typed JSON
              vectors — no free-form chat, minimal token waste.
            </p>
            <ol className="grid gap-2 sm:grid-cols-2">
              {PHASES.map((p, i) => {
                const active = i === activePhase;
                const done = i < activePhase || (lastRun && i <= 5);
                return (
                  <li
                    key={p.id}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "border-primary/50 bg-primary/10 text-fg"
                        : done
                          ? "border-border bg-surface-2 text-fg"
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
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg hover:opacity-90 disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                Run charter
              </button>
              <button
                type="button"
                disabled={busy || snap.runs.length === 0}
                onClick={onSync}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium hover:border-primary/40 disabled:opacity-50"
              >
                <Users className="h-4 w-4" />
                Monday morning sync
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onReset}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-muted hover:text-fg disabled:opacity-50"
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
              hint={lastRun?.trust ? "Board approved hand-off" : "Run charters to earn trust"}
            />
            <MetricCard
              icon={<Activity className="h-4 w-4" />}
              label="Avg ops fitness"
              value={avgFitness.toFixed(3)}
              hint="F = 0.4Q + 0.3Rhythm − 0.15·(Cost/300) + 0.2Synergy"
            />
            <MetricCard
              icon={<Briefcase className="h-4 w-4" />}
              label="Token spend"
              value={`${snap.tokenSpend.toLocaleString()} / ${snap.tokenBudget.toLocaleString()}`}
              hint="CFO BudgetVector tracks spend vs cap"
            />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Executive layer (typed vectors only)
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "CEO", name: snap.executives.ceo, vector: "StrategyVector" },
              { title: "CFO", name: snap.executives.cfo, vector: "BudgetVector" },
              { title: "Board", name: snap.executives.board, vector: "GovernanceVector" },
              { title: "GM", name: snap.executives.gm, vector: "OpsVector" },
            ].map((e) => (
              <div key={e.title} className="rounded-lg border border-border bg-surface-2 px-3 py-3">
                <div className="text-xs font-semibold text-primary">{e.title}</div>
                <div className="text-sm font-medium">{e.name}</div>
                <div className="mt-1 font-mono text-[11px] text-muted">{e.vector}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Roster</h2>
            <ul className="space-y-2">
              {snap.roster.map((a) => {
                const f = fitness(a.history);
                const statusColor =
                  a.status === "Promoted"
                    ? "text-ok"
                    : a.status === "Fired"
                      ? "text-danger"
                      : "text-muted";
                return (
                  <li
                    key={a.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2.5"
                  >
                    <div>
                      <div className="text-sm font-medium">{a.name}</div>
                      <div className="text-xs text-muted">
                        {a.role} · {a.layer}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-semibold ${statusColor}`}>{a.status}</div>
                      <div className="font-mono text-xs text-muted">
                        {a.talentEligible ? `F=${f.toFixed(3)}` : "exec/audit"} · rank {a.corporateRank}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Executive wire (JSON vectors)
            </h2>
            {recentVectors.length === 0 ? (
              <p className="text-sm text-muted">
                No vectors yet. Run a charter — CEO StrategyVector posts at ST-01; RhythmAudit at ST-04.
              </p>
            ) : (
              <ul className="max-h-72 space-y-2 overflow-auto">
                {recentVectors.map((v, i) => (
                  <li
                    key={`${v.type}-${i}`}
                    className="rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-[11px] text-muted"
                  >
                    <VectorLine v={v} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Run telemetry
            </h2>
            {snap.runs.length === 0 ? (
              <p className="text-sm text-muted">No charters yet. Hit Run charter to start ST-01…ST-06.</p>
            ) : (
              <ul className="space-y-2">
                {[...snap.runs].reverse().map((r, idx) => (
                  <li
                    key={`${r.workload}-${idx}`}
                    className="rounded-lg border border-border bg-surface-2 px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{r.workload}</span>
                      {r.trust ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-ok">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Board trust
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-accent">Remediate</span>
                      )}
                    </div>
                    <div className="mt-1 font-mono text-xs text-muted">
                      Q={r.quality.toFixed(3)} · audit={String(r.auditPassed)} · loops=
                      {r.remediationLoops}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Event log</h2>
            <ul className="max-h-56 space-y-1 overflow-auto font-mono text-xs text-muted">
              {log.map((line, i) => (
                <li key={i} className="border-b border-border/50 py-1.5">
                  <ArrowRight className="mr-1 inline h-3 w-3 text-primary" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="border-t border-border pt-4 pb-8 text-center text-xs text-muted">
          Cycle 2 · Apache-2.0 · advanced-agent-builder + advanced-coding · executive-comms-protocol
        </footer>
      </main>
    </div>
  );
}

function VectorLine({ v }: { v: ExecVector }) {
  if (v.type === "RhythmAudit") {
    return (
      <span>
        <span className="text-primary">{v.type}</span> marker={v.marker} Q={v.quality} passed=
        {String(v.passed)}
      </span>
    );
  }
  if (v.type === "GovernanceVector") {
    return (
      <span>
        <span className="text-primary">{v.type}</span> from={v.from} hand_off=
        {String(v.approve_hand_off)} · {v.notes}
      </span>
    );
  }
  if (v.type === "BudgetVector") {
    return (
      <span>
        <span className="text-primary">{v.type}</span> spend={v.token_spend} / {v.token_budget} halt=
        {String(v.halt_if_over)}
      </span>
    );
  }
  if (v.type === "OpsVector") {
    const keys = Object.keys(v.roster_outcomes ?? {});
    return (
      <span>
        <span className="text-primary">{v.type}</span> from={v.from} roster={keys.join(",") || "—"}
      </span>
    );
  }
  return (
    <span>
      <span className="text-primary">{v.type}</span> from={v.from} charter={v.charter_id}
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
      <div className="mt-1 text-xs text-muted">{hint}</div>
    </div>
  );
}
