# flowchartcharter-studio

Interactive Studio for [FlowChartCharter v3.3](https://github.com/CharleSpectre13/flowchartcharter).

- Glanceable ST-01…ST-07 charter map
- Multi-agent roster + fitness
- Run charter → muscle-memory → Coach Trust Hand-Off
- Harness: HALT, earned Rhythm, citation, QFS reduce
- LiveModel: grok-4.5 when `XAI_API_KEY` is set; otherwise extractive/mock

## Load the engine
```bash
pip install "git+https://github.com/CharleSpectre13/flowchartcharter.git"
export XAI_API_KEY=...   # optional
python3 -c "from flowchartcharter import LiveModel; print(LiveModel.from_env().status())"
```

## Stack
TanStack Start + React + Tailwind v4 + lucide-react

## Related
- Core: https://github.com/CharleSpectre13/flowchartcharter
- Loop: https://github.com/CharleSpectre13/flowchartcharter-loop

Apache-2.0 · Spectre Industries open design
