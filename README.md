# flowchartcharter-studio

> **This repository is a read-only redirect.**

All Studio UI source now lives in the canonical monorepo:

**https://github.com/CharleSpectre13/flowchartcharter/tree/main/studio**

| What you want | Where it is now |
|---|---|
| Dashboard engine | `studio/src/lib/flowchartcharter/dashboard.ts` |
| Tensor / Quantum engine | `studio/src/lib/flowchartcharter/engine.ts` |
| Brain-1 ontology | `studio/src/lib/flowchartcharter/knowledge.ts` |
| UI routes | `studio/src/routes/` |
| Theme | `studio/src/styles.css` |
| Python engine | `packages/core/flowchartcharter/` |

```bash
pip install "git+https://github.com/CharleSpectre13/flowchartcharter.git"
# optional live mouth
export XAI_API_KEY=...
```

Do not open PRs here. All new work lands on the main monorepo.

Apache-2.0 · Spectre Industries open design
