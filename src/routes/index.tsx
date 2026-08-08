import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
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
  type SystemSnapshot,
} from "@/lib/flowchartcharter/engine";

export const Route = createFileRoute("/")({
  component: StudioPage,
});

function StudioPage() {
  const [snap, setSnap] = useState<SystemSnapshot>(() => initialSnapshot());
  const [activePhase, setActivePhase] = useState(0);
  const [log, setLog] = useState<string[]>([
    "Studio ready — Charter primary, GraphRAG secondary (callable tool only).",
  ]);
  const [busy, setBusy] = useState(false);

  const lastRun = snap.runs[snap.runs.length - 1];

  const avgFitness = useMemo(() => {
    const vals = snap.roster.map((a) => fitness(a.history));
    if (!vals.length) return 0;
    return vals.reduce((s, v) => s + v, 0) / vals.length;
  }, [snap.roster]);

  function pushLog(line: string) {
    setLog((prev) => [line, ...prev].slice(0, 40));
  }

  async function animatePhases(until: number) {
    for (let i = 0; i <= until; i++) {
      setActivePhase(i);
      await new Promise((r) => setTimeout(r, 180));
    }
  }

  async function onRunCharter() {
    if (busy) return;
    setBusy(true);
    const workload = WORKLOADS[snap.runs.length % WORKLOADS.length];
    await animatePhases(5);
    setSnap((prev) => {
      const roster = prev.roster.map((a) => ({ ...a, history: [...a.history], muscleMemory: { ...a.muscleMemory } }));
      const run = runCharter(roster, workload);
      const runs = [...prev.runs, run];
      const trustRate = runs.filter((r) => r.trust).length / runs.length;
      pushLog(
        `CHARTER "${workload}" · Q=${run.quality.toFixed(3)} · trust=${run.trust} · loops=${run.remediationLoops}`,
      );
      return {
        ...prev,
        roster,
        runs,
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
      const { outcomes, playbook } = mondayMorningSync(roster);
      pushLog(`MONDAY SYNC · ${Object.entries(outcomes).map(([k, v]) => `${k}:${v}`).join(" · ")}`);
      return {
        ...prev,
        roster,
        syncOutcomes: outcomes,
        playbook: [...playbook, ...prev.playbook].slice(0, 24),
        step: prev.step + 1,
      };
    });
    setBusy(false);
  }

  function onReset() {
    setSnap(initialSnapshot());
    setActivePhase(0);
    setLog(["System reset — fresh roster, empty checkpointer."]);
  }

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
              <div className="text-xs text-muted">Execution-first · Coach Trust Hand-Off</div>
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
              Glanceable sequential ownership replaces open graph traversal under pressure.
              GraphRAG remains a callable sub-flow — never the default orchestration layer.
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
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg hover:opacity-90 disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                Run charter
              </button>
              <button
                type="button"
                disabled={busy || snap.runs.length === 0}
                onClick={onSync}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium hover:border-primary/40 disabled:opacity-50"
              >
                <Users className="h-4 w-4" />
                Monday morning sync
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onReset}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-muted hover:text-fg disabled:opacity-50"
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
              hint={lastRun?.trust ? "Hand-off earned on last run" : "Run charters to earn trust"}
            />
            <MetricCard
              icon={<Activity className="h-4 w-4" />}
              label="Avg agent fitness"
              value={avgFitness.toFixed(3)}
              hint="F = 0.4Q + 0.3Rhythm − 0.0002Cost + 0.2Synergy"
            />
            <MetricCard
              icon={<GitBranch className="h-4 w-4" />}
              label="Charters completed"
              value={String(snap.runs.length)}
              hint={`Super-step counter ${snap.step}`}
            />
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
                      <div className="text-xs text-muted">{a.role}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-semibold ${statusColor}`}>{a.status}</div>
                      <div className="font-mono text-xs text-muted">F={f.toFixed(3)} · rank {a.corporateRank}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

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
                          <CheckCircle2 className="h-3.5 w-3.5" /> Trust
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-accent">Remediate</span>
                      )}
                    </div>
                    <div className="mt-1 font-mono text-xs text-muted">
                      Q={r.quality.toFixed(3)} · loops={r.remediationLoops} · paths{" "}
                      {Object.entries(r.pathByAgent)
                        .map(([k, v]) => `${k}:${v}`)
                        .join(", ")}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
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
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Playbook</h2>
            {snap.playbook.length === 0 ? (
              <p className="text-sm text-muted">
                Downtime sync writes promotion/retention notes here after Monday Morning Sync.
              </p>
            ) : (
              <ul className="max-h-56 space-y-1 overflow-auto text-sm">
                {snap.playbook.map((p, i) => (
                  <li key={i} className="rounded-md bg-surface-2 px-2 py-1.5 text-muted">
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <footer className="border-t border-border pt-4 pb-8 text-center text-xs text-muted">
          Open design · Apache-2.0 · Spectre Industries · flowchartcharter-engineering skill
        </footer>
      </main>
    </div>
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