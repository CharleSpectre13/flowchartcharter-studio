import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Eraser,
  Play,
  RefreshCw,
  Sparkles,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import {
  PRESET_JOBS,
  clearLogs,
  createDashboard,
  executeWorkload,
  fitnessScore,
  mondayMorningSync,
  type DashboardState,
  type LogKind,
  type RosterAgent,
} from "@/lib/flowchartcharter/dashboard";

export const Route = createFileRoute("/")({
  component: MasterDashboard,
});

function MasterDashboard() {
  const [state, setState] = useState<DashboardState>(() => createDashboard());
  const [busy, setBusy] = useState(false);
  const logEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.logs.length]);

  async function onGo() {
    if (busy) return;
    setBusy(true);
    await sleep(180);
    setState((s) => executeWorkload(s));
    setBusy(false);
  }

  async function onSync() {
    if (busy) return;
    setBusy(true);
    await sleep(220);
    setState((s) => mondayMorningSync(s));
    setBusy(false);
  }

  function onReset() {
    setState(createDashboard());
  }

  const activePlayers = state.roster.filter((a) => a.status !== "FIRED").length;

  return (
    <div className="flex min-h-full flex-col bg-bg text-fg">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="pulse-dot inline-block h-3 w-3 rounded-full bg-ok" />
            <div>
              <h1 className="text-base font-bold tracking-tight sm:text-lg">
                FlowChartCharter
                <span className="ml-2 rounded border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-primary">
                  Game Desk v1
                </span>
              </h1>
              <p className="text-xs text-muted">
                Press GO — the robots follow the map
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
            <span>
              Coach: <strong className="text-fg">You</strong>
            </span>
            <span>
              Rhythm:{" "}
              <strong className="text-ok">
                {state.rhythm === "idle" ? "Ready" : state.rhythm === "running" ? "Running…" : "Sync…"}
              </strong>
            </span>
            <span className="font-mono text-primary">
              Runs {state.runs} · Hits {state.hits}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-4 p-4 lg:grid-cols-3">
        {/* LEFT: Team + CFO */}
        <section className="space-y-4 lg:col-span-1">
          <div className="rounded-xl border border-border bg-surface p-4 shadow-lg">
            <div className="mb-1 flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Users className="h-4 w-4 text-primary" />
                Your Team
              </h2>
              <span className="rounded bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-primary">
                {activePlayers} playing
              </span>
            </div>
            <p className="mb-3 text-xs text-muted">
              Green stars = winners. Red = benched after Monday Sync.
            </p>
            <ul className="space-y-2">
              {state.roster.map((a) => (
                <PlayerCard key={a.id} agent={a} />
              ))}
            </ul>
            <button
              type="button"
              disabled={busy}
              onClick={onSync}
              className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-fg shadow-md transition hover:opacity-90 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
              Monday Morning Sync
            </button>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 shadow-lg">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
              <Wallet className="h-4 w-4 text-ok" />
              Money Meter (CFO)
            </h3>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted">Max tokens per path</span>
              <span className="font-mono font-bold text-ok">
                {state.cfoBudget.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={5000}
              step={100}
              value={state.cfoBudget}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  cfoBudget: Number(e.target.value),
                }))
              }
              className="w-full"
              aria-label="CFO token budget"
            />
            <p className="mt-2 text-[11px] text-muted">
              Slide left = thrifty. If a path costs more than this, CFO says STOP.
            </p>
          </div>

          <HowToPlay />
        </section>

        {/* RIGHT: Job + console */}
        <section className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-border bg-surface p-4 shadow-lg sm:p-5">
            <h2 className="mb-1 flex items-center gap-2 text-base font-semibold">
              <Zap className="h-4 w-4 text-ok" />
              Mission Control
            </h2>
            <p className="mb-4 text-xs text-muted">
              1) Pick or type a job · 2) Tweak knobs · 3) Smash GO
            </p>

            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">
              What should the team do?
            </label>
            <input
              type="text"
              value={state.workload}
              onChange={(e) =>
                setState((s) => ({ ...s, workload: e.target.value }))
              }
              className="mb-3 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-primary focus:ring-2"
              placeholder="Type a job…"
            />

            <div className="mb-3 flex flex-wrap gap-2">
              {PRESET_JOBS.map((job) => (
                <button
                  key={job}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, workload: job }))}
                  className={`rounded-full border px-3 py-1.5 text-left text-[11px] transition ${
                    state.workload === job
                      ? "border-ok/50 bg-ok/15 text-ok"
                      : "border-border bg-surface-2 text-muted hover:text-fg"
                  }`}
                >
                  {job.length > 36 ? `${job.slice(0, 34)}…` : job}
                </button>
              ))}
            </div>

            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <Knob
                label="Messy-o-meter (entropy)"
                hint="0 = clean · 1 = super messy"
                value={state.entropy}
                min={0}
                max={1}
                step={0.1}
                onChange={(v) => setState((s) => ({ ...s, entropy: v }))}
              />
              <Knob
                label="Memory match bar"
                hint="Higher = harder to get a HIT"
                value={state.threshold}
                min={0.5}
                max={1}
                step={0.05}
                onChange={(v) => setState((s) => ({ ...s, threshold: v }))}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy || !state.workload.trim()}
                onClick={onGo}
                className="flex min-h-14 min-w-[10rem] flex-1 items-center justify-center gap-2 rounded-xl bg-ok px-6 py-3 text-base font-bold text-accent-fg shadow-lg transition hover:opacity-90 disabled:opacity-50 sm:flex-none"
              >
                <Play className="h-5 w-5 fill-current" />
                GO!
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onReset}
                className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-muted hover:text-fg disabled:opacity-50"
              >
                <Eraser className="h-4 w-4" />
                New game
              </button>
            </div>

            {state.lastPath && (
              <div
                className={`mt-4 rounded-xl border px-4 py-3 ${
                  state.lastHit
                    ? "border-ok/40 bg-ok/10"
                    : "border-primary/40 bg-primary/10"
                }`}
              >
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                  <Sparkles className="h-3.5 w-3.5" />
                  {state.lastHit ? "Memory HIT — reused path" : "Quantum path"}
                </div>
                <div className="font-mono text-sm text-fg">
                  {state.lastPath.join(" → ")}
                </div>
              </div>
            )}
          </div>

          {/* Console / blackboard */}
          <div className="flex h-80 flex-col rounded-xl border border-border bg-surface p-4 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Game Log (Blackboard)
              </h3>
              <button
                type="button"
                onClick={() => setState((s) => clearLogs(s))}
                className="text-xs text-muted hover:text-fg"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 space-y-1.5 overflow-y-auto rounded-lg border border-border bg-bg p-3 font-mono text-xs">
              {state.logs.map((line) => (
                <div key={line.id} className={logColor(line.kind)}>
                  <span className="text-muted">[{line.t}] </span>
                  {line.text}
                </div>
              ))}
              <div ref={logEnd} />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-3 text-center text-[11px] text-muted">
        FlowChartCharter Game Desk · Muscle-Memory · Quantum Router · CFO Guard
      </footer>
    </div>
  );
}

function PlayerCard({ agent }: { agent: RosterAgent }) {
  const score = fitnessScore(agent);
  const badge =
    agent.status === "PROMOTED"
      ? "border-ok/40 bg-ok/10 text-ok"
      : agent.status === "FIRED"
        ? "border-danger/40 bg-danger/10 text-danger"
        : "border-border bg-surface-2 text-muted";

  return (
    <li className="flex items-center justify-between gap-2 rounded-xl border border-border bg-bg px-3 py-2.5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold">{agent.id}</span>
          <span className="truncate text-xs text-muted">{agent.role}</span>
          <span
            className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${badge}`}
          >
            {agent.status}
          </span>
        </div>
        <div className="mt-0.5 text-[11px] text-muted">
          Wins {agent.success}/{agent.total} · Tokens {agent.tokens} · Oops{" "}
          {agent.errors}
        </div>
      </div>
      <div className="shrink-0 text-right font-mono text-xs text-primary">
        {score.toFixed(2)}
      </div>
    </li>
  );
}

function Knob({
  label,
  hint,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg p-3">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted">{label}</span>
        <span className="font-mono text-sm font-bold text-primary">
          {value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        aria-label={label}
      />
      <p className="mt-1 text-[10px] text-muted">{hint}</p>
    </div>
  );
}

function HowToPlay() {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-xs text-muted">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg">
        <ArrowRight className="h-4 w-4 text-ok" />
        How to play
      </div>
      <ol className="list-decimal space-y-1.5 pl-4">
        <li>
          Pick a job chip (or type your own).
        </li>
        <li>
          Press the big green <strong className="text-ok">GO!</strong>
        </li>
        <li>
          Watch the log: <strong className="text-ok">HIT</strong> = free cheat
          sheet · MISS = robots invent a path.
        </li>
        <li>
          Press <strong className="text-primary">Monday Morning Sync</strong> to
          promote stars and bench flops.
        </li>
      </ol>
    </div>
  );
}

function logColor(kind: LogKind): string {
  if (kind === "success") return "text-ok";
  if (kind === "warning") return "text-warn";
  if (kind === "error") return "text-danger";
  return "text-fg/90";
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
