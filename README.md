# NULLSET

**Find the one fact that changes the decision.**

NULLSET is a local-first decision compiler for high-stakes, hard-to-reverse bets. It combines a causal assumption surface, seeded Monte Carlo simulation, counterfactual stress testing, local evidence retrieval, and expected-value-of-information ranking into one explainable operating instrument.

It is deliberately not a chatbot. The output is a proof plan: the smallest, cheapest set of experiments that can collapse enough uncertainty to make a decision.

## Product thesis

Most decision-intelligence products optimize the answer. NULLSET optimizes the **next fact worth buying**.

The current demo models an executive go/no-go decision: whether to ship a governed enterprise tier in Q4. Every control is live:

- change pricing or activate market and execution shocks;
- rerun a deterministic 6,000-trial Monte Carlo model;
- inspect the confidence, impact, and fragility of each causal assumption;
- query an evidence corpus with in-browser TF–IDF retrieval;
- rank experiments by evidence value per dollar and day;
- export the current decision brief as Markdown;
- preserve the scenario locally without sending source material to a service.

## Architecture

```text
Evidence corpus ──► local retrieval ─┐
                                     ├──► causal assumption model
Scenario controls ─► seeded shocks ─┘             │
                                                   ▼
                                           Monte Carlo engine
                                                   │
                           ┌───────────────────────┼──────────────────┐
                           ▼                       ▼                  ▼
                     target probability      sensitivity       ARR bands
                           │                       │                  │
                           └────────────► evidence-value rank ◄──────┘
                                                   │
                                                   ▼
                                            minimum proof plan
```

The numerical core lives in `lib/decision-engine.ts` and has no framework dependencies. The interface is a single React client surface built for vinext and Cloudflare Workers. Scenario state uses browser storage by design; this keeps the demo private, zero-configuration, and fully functional without pretending that static sample data is a hosted enterprise backend.

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Quality gates

```bash
npm run lint
npm test
```

`npm test` performs a production Cloudflare-compatible build, exercises the decision engine, verifies scenario monotonicity and retrieval relevance, and server-renders the finished product surface to guard against starter or metadata regressions.

## Technology

- React 19 + TypeScript
- vinext / Vite / Cloudflare Workers
- dependency-free seeded Monte Carlo simulation
- dependency-free TF–IDF evidence retrieval
- CSS-native graph and responsive visual system
- Node test runner

## Privacy and scope

This repository ships a decision-grade interaction model and transparent numerical engine, not a claim of production causal inference from arbitrary organizational data. A production deployment would connect ingestion, identity, provenance, model calibration, and governed storage to the same boundaries demonstrated here. No sample source material leaves the browser.

## License

MIT
