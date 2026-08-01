"use client";

import { useEffect, useMemo, useState } from "react";
import {
  assumptions,
  evidenceCorpus,
  formatMoney,
  rankProofs,
  retrieveEvidence,
  runSimulation,
  type Scenario,
} from "@/lib/decision-engine";

const defaultScenario: Scenario = {
  priceDelta: 8,
  competitorPressure: false,
  regulatoryTailwind: true,
  onboardingSlip: false,
};

const graphPositions = [
  { left: "5%", top: "15%" },
  { left: "28%", top: "62%" },
  { left: "30%", top: "8%" },
  { left: "62%", top: "17%" },
  { left: "65%", top: "64%" },
  { left: "84%", top: "35%" },
];

const betOptions = [
  { id: "014", name: "Enterprise tier / Q4", status: "ACTIVE" },
  { id: "009", name: "EU data plane", status: "WATCH" },
  { id: "006", name: "Usage pricing", status: "ARCHIVE" },
];

export default function Home() {
  const [scenario, setScenario] = useState<Scenario>(defaultScenario);
  const [seed, setSeed] = useState(1209);
  const [selectedId, setSelectedId] = useState("activation");
  const [query, setQuery] = useState("What could slow enterprise activation?");
  const [activeTab, setActiveTab] = useState<"model" | "evidence" | "proof">("model");
  const [modelState, setModelState] = useState("MODEL LIVE");
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    const hydration = window.setTimeout(() => {
      const saved = window.localStorage.getItem("nullset-scenario");
      if (saved) {
        try {
          setScenario({ ...defaultScenario, ...JSON.parse(saved) });
        } catch {
          window.localStorage.removeItem("nullset-scenario");
        }
      }
      setStorageReady(true);
    }, 0);
    return () => window.clearTimeout(hydration);
  }, []);

  useEffect(() => {
    if (storageReady) window.localStorage.setItem("nullset-scenario", JSON.stringify(scenario));
  }, [scenario, storageReady]);

  const result = useMemo(() => runSimulation(scenario, seed), [scenario, seed]);
  const proofQueue = useMemo(() => rankProofs(), []);
  const selected = assumptions.find((item) => item.id === selectedId) ?? assumptions[0];
  const evidence = useMemo(() => retrieveEvidence(query), [query]);

  function updateScenario<Key extends keyof Scenario>(key: Key, value: Scenario[Key]) {
    setScenario((current) => ({ ...current, [key]: value }));
    setModelState("UNRUN CHANGES");
  }

  function runModel() {
    setSeed((current) => current + 97);
    setModelState("RECALIBRATING");
    window.setTimeout(() => setModelState("MODEL LIVE"), 520);
  }

  function exportBrief() {
    const topProof = proofQueue[0];
    const markdown = `# NULLSET / Decision brief\n\n## The bet\nShip the governed enterprise tier in Q4 and reach $12M ARR run-rate.\n\n## Current read\n- Probability of target: ${Math.round(result.probability * 100)}%\n- Expected ARR: ${formatMoney(result.expectedArr * 1_000_000)}\n- Downside / upside: ${formatMoney(result.downsideArr * 1_000_000)} / ${formatMoney(result.upsideArr * 1_000_000)}\n\n## The next proof\n**${topProof.label}** — ${topProof.statement}\n\nRun a ${topProof.daysToTest}-day test for ${formatMoney(topProof.costToTest)}. Estimated evidence value: ${formatMoney(topProof.evidenceValue)}.\n\n## Kill condition\nPause the Q4 launch if activation remains above 18 days after a named deployment owner is assigned.\n\nGenerated locally by NULLSET. No source data left the browser.\n`;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nullset-decision-brief.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="NULLSET home">
          <span className="mark" aria-hidden="true">N</span>
          <span>NULLSET</span>
          <small>/ OS—01</small>
        </a>
        <div className="topbar-center" aria-label="Model status">
          <span className={`status-dot ${modelState === "MODEL LIVE" ? "is-live" : ""}`} />
          {modelState}
          <span className="faint">· 6,000 RUNS</span>
        </div>
        <button className="export-button" onClick={exportBrief}>
          EXPORT BRIEF <span aria-hidden="true">↗</span>
        </button>
      </header>

      <div className="workspace" id="top">
        <aside className="bet-rail" aria-label="Decision portfolio">
          <div className="rail-label">BET LEDGER</div>
          <div className="bets">
            {betOptions.map((bet, index) => (
              <button className={`bet-item ${index === 0 ? "active" : ""}`} key={bet.id}>
                <span className="bet-id">{bet.id}</span>
                <span className="bet-copy">
                  <strong>{bet.name}</strong>
                  <small>{bet.status}</small>
                </span>
              </button>
            ))}
          </div>
          <div className="rail-foot">
            <div className="privacy-badge"><span>◈</span> LOCAL CORE</div>
            <p>Source material is indexed and scored in your browser.</p>
          </div>
        </aside>

        <section className="main-stage">
          <div className="stage-heading">
            <div>
              <div className="eyebrow">BET 014 <span>/</span> EXECUTIVE GO / NO-GO</div>
              <h1>Should we ship the enterprise tier in Q4?</h1>
              <p>Target: $12M ARR run-rate without extending payback beyond 14 months.</p>
            </div>
            <div className="decision-chip">
              <span>DECISION WINDOW</span>
              <strong>11 DAYS</strong>
            </div>
          </div>

          <div className="readout-grid">
            <section className="probability-card" aria-label="Decision probability">
              <div className="card-kicker">CURRENT READ</div>
              <div className="probability-value">
                {Math.round(result.probability * 100)}<sup>%</sup>
              </div>
              <div className="probability-label">PROBABILITY OF TARGET</div>
              <div className="band-track" aria-label="Probability confidence band">
                <span className="band-fill" style={{ width: `${result.probability * 100}%` }} />
                <span className="band-marker" style={{ left: "64%" }} />
              </div>
              <div className="band-legend"><span>0</span><span>GO LINE / 64</span><span>100</span></div>
              <div className="metric-row">
                <div><span>EXPECTED</span><strong>{formatMoney(result.expectedArr * 1_000_000)}</strong></div>
                <div><span>DOWNSIDE</span><strong>{formatMoney(result.downsideArr * 1_000_000)}</strong></div>
                <div><span>UPSIDE</span><strong>{formatMoney(result.upsideArr * 1_000_000)}</strong></div>
              </div>
            </section>

            <section className="hinge-card">
              <div className="card-kicker">THE HINGE <span>01</span></div>
              <h2>Activation speed is carrying the decision.</h2>
              <p>If median time-to-value stays above 18 days, launch probability falls below the go line.</p>
              <button className="text-button" onClick={() => { setSelectedId("activation"); setActiveTab("proof"); }}>
                SHOW MINIMUM PROOF <span>→</span>
              </button>
              <div className="hinge-index">
                <span>FRAGILITY</span>
                <div><i style={{ width: "84%" }} /></div>
                <strong>8.4</strong>
              </div>
            </section>

            <section className="scenario-card">
              <div className="card-kicker">COUNTERFACTUAL RIG</div>
              <label className="slider-label" htmlFor="price-range">
                <span>PRICE DELTA</span><strong>{scenario.priceDelta > 0 ? "+" : ""}{scenario.priceDelta}%</strong>
              </label>
              <input
                id="price-range"
                type="range"
                min="-12"
                max="22"
                value={scenario.priceDelta}
                onChange={(event) => updateScenario("priceDelta", Number(event.target.value))}
              />
              <div className="shock-list">
                {[
                  ["competitorPressure", "Competitor undercuts 20%"],
                  ["regulatoryTailwind", "EU compliance tailwind"],
                  ["onboardingSlip", "Onboarding slips +9 days"],
                ].map(([key, label]) => (
                  <label className="shock-row" key={key}>
                    <input
                      type="checkbox"
                      checked={Boolean(scenario[key as keyof Scenario])}
                      onChange={(event) => updateScenario(key as keyof Scenario, event.target.checked as never)}
                    />
                    <span className="switch" aria-hidden="true" />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <button className="run-button" onClick={runModel}>RUN MODEL <span>↻</span></button>
            </section>
          </div>

          <nav className="section-tabs" aria-label="Decision workspace views">
            <button className={activeTab === "model" ? "active" : ""} onClick={() => setActiveTab("model")}>CAUSAL MODEL</button>
            <button className={activeTab === "evidence" ? "active" : ""} onClick={() => setActiveTab("evidence")}>EVIDENCE / {evidenceCorpus.length}</button>
            <button className={activeTab === "proof" ? "active" : ""} onClick={() => setActiveTab("proof")}>PROOF QUEUE / 03</button>
          </nav>

          {activeTab === "model" && (
            <div className="model-grid">
              <section className="causal-canvas" aria-label="Interactive causal model">
                <div className="canvas-topline">
                  <span>CAUSAL SURFACE / CLICK A NODE</span>
                  <span><i className="legend-dot high" /> HIGH LEVERAGE <i className="legend-dot" /> STABLE</span>
                </div>
                <div className="graph-field">
                  <div className="graph-line line-a" /><div className="graph-line line-b" />
                  <div className="graph-line line-c" /><div className="graph-line line-d" />
                  <div className="graph-line line-e" /><div className="graph-line line-f" />
                  {assumptions.map((item, index) => (
                    <button
                      key={item.id}
                      className={`graph-node node-${index} ${selectedId === item.id ? "selected" : ""}`}
                      style={graphPositions[index]}
                      onClick={() => setSelectedId(item.id)}
                      aria-label={`Inspect ${item.label}`}
                    >
                      <span className="node-ring" style={{ "--confidence": `${item.confidence * 360}deg` } as React.CSSProperties}>
                        <b>{Math.round(item.confidence * 100)}</b>
                      </span>
                      <span className="node-label">{item.shortLabel}</span>
                      <small>{item.evidenceCount} SIGNALS</small>
                    </button>
                  ))}
                  <div className="outcome-node">
                    <span>OUTCOME</span><strong>$12M</strong><small>ARR / Q4</small>
                  </div>
                </div>
              </section>

              <aside className="node-inspector">
                <div className="inspector-head"><span>ASSUMPTION / {selected.id.toUpperCase()}</span><b>×</b></div>
                <div className={`category-tag ${selected.category}`}>{selected.category}</div>
                <h3>{selected.label}</h3>
                <p>{selected.statement}</p>
                <div className="inspector-stats">
                  <div><span>CONFIDENCE</span><strong>{Math.round(selected.confidence * 100)}%</strong></div>
                  <div><span>IMPACT</span><strong>{Math.round(selected.impact * 10)}/10</strong></div>
                  <div><span>EVIDENCE</span><strong>{selected.evidenceCount}</strong></div>
                  <div><span>TEST COST</span><strong>{formatMoney(selected.costToTest)}</strong></div>
                </div>
                <div className="counterfactual-note">
                  <span>IF WRONG</span>
                  <strong>−{Math.round(selected.impact * selected.uncertainty * 38)} pts</strong>
                  <p>from launch probability under the current scenario.</p>
                </div>
                <button className="inspector-action" onClick={() => setActiveTab("evidence")}>TRACE EVIDENCE <span>→</span></button>
              </aside>
            </div>
          )}

          {activeTab === "evidence" && (
            <section className="evidence-view">
              <div className="evidence-query">
                <div className="query-label"><span>RETRIEVAL CORE</span><small>LOCAL TF–IDF / NO API</small></div>
                <label htmlFor="evidence-search">Ask the evidence, not a model.</label>
                <div className="search-shell"><span>⌕</span><input id="evidence-search" value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>↵</kbd></div>
              </div>
              <div className="evidence-results">
                {evidence.map((item, index) => (
                  <article className="evidence-card" key={item.id}>
                    <div className="evidence-rank">0{index + 1}</div>
                    <div className="evidence-body">
                      <div className="evidence-meta"><span className={item.polarity}>{item.polarity}</span>{item.source} · {item.date}</div>
                      <h3>{item.title}</h3><p>{item.excerpt}</p>
                      <div className="tag-row">{item.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
                    </div>
                    <div className="match-score"><strong>{item.score ? Math.min(99, Math.round(62 + item.score * 5)) : 62}%</strong><span>MATCH</span></div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === "proof" && (
            <section className="proof-view">
              <div className="proof-intro">
                <div className="card-kicker">MINIMUM EVIDENCE PLAN</div>
                <h2>Don’t research everything.<br />Collapse the right uncertainty.</h2>
                <p>Experiments are ranked by decision exposure reduced per dollar and day—not by confidence theater.</p>
                <div className="proof-total"><span>TOTAL PLAN</span><strong>{formatMoney(proofQueue.slice(0, 3).reduce((sum, item) => sum + item.costToTest, 0))}</strong><small>17 DAYS / PARALLEL</small></div>
              </div>
              <div className="proof-stack">
                {proofQueue.slice(0, 3).map((item, index) => (
                  <article className={`proof-card ${index === 0 ? "priority" : ""}`} key={item.id}>
                    <div className="proof-number">0{index + 1}</div>
                    <div><div className="proof-label">{index === 0 ? "RUN FIRST" : "THEN"} / {item.category}</div><h3>{item.label}</h3><p>{item.statement}</p></div>
                    <div className="proof-metrics"><div><span>COST</span><strong>{formatMoney(item.costToTest)}</strong></div><div><span>TIME</span><strong>{item.daysToTest}D</strong></div><div><span>EVIDENCE VALUE</span><strong>{formatMoney(item.evidenceValue)}</strong></div></div>
                  </article>
                ))}
                <div className="kill-line"><span>KILL CRITERION</span><strong>Activation stays above 18 days after guided deployment.</strong><small>→ PAUSE Q4 LAUNCH</small></div>
              </div>
            </section>
          )}
        </section>
      </div>

      <footer>
        <span>NULLSET / DECISION COMPILER</span>
        <span>BUILT FOR REVERSIBLE THINKING ABOUT IRREVERSIBLE BETS.</span>
        <span>LOCAL-FIRST · EXPLAINABLE · EXPORTABLE</span>
      </footer>
    </main>
  );
}
