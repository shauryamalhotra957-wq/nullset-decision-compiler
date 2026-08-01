export type Assumption = {
  id: string;
  label: string;
  shortLabel: string;
  category: "market" | "product" | "execution" | "finance";
  confidence: number;
  impact: number;
  uncertainty: number;
  evidenceCount: number;
  costToTest: number;
  daysToTest: number;
  statement: string;
};

export type Scenario = {
  priceDelta: number;
  competitorPressure: boolean;
  regulatoryTailwind: boolean;
  onboardingSlip: boolean;
};

export type SimulationResult = {
  probability: number;
  expectedArr: number;
  downsideArr: number;
  upsideArr: number;
  confidenceBand: [number, number];
  sensitivities: Array<Assumption & { sensitivity: number }>;
};

export type Evidence = {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  date: string;
  tags: string[];
  polarity: "supports" | "challenges" | "neutral";
};

export const assumptions: Assumption[] = [
  {
    id: "price-fit",
    label: "Price / value fit",
    shortLabel: "Price fit",
    category: "market",
    confidence: 0.72,
    impact: 0.94,
    uncertainty: 0.23,
    evidenceCount: 12,
    costToTest: 8500,
    daysToTest: 8,
    statement: "Enterprise buyers will accept a 28% price premium for governed workflow controls.",
  },
  {
    id: "activation",
    label: "Time to first value",
    shortLabel: "Activation",
    category: "product",
    confidence: 0.61,
    impact: 0.81,
    uncertainty: 0.31,
    evidenceCount: 7,
    costToTest: 4200,
    daysToTest: 5,
    statement: "A guided deployment can move median time-to-value below fourteen days.",
  },
  {
    id: "champion",
    label: "Champion retention",
    shortLabel: "Champion",
    category: "market",
    confidence: 0.76,
    impact: 0.76,
    uncertainty: 0.18,
    evidenceCount: 18,
    costToTest: 2600,
    daysToTest: 4,
    statement: "Internal champions remain active through security and procurement review.",
  },
  {
    id: "sales-ramp",
    label: "Enterprise sales ramp",
    shortLabel: "Sales ramp",
    category: "execution",
    confidence: 0.67,
    impact: 0.88,
    uncertainty: 0.27,
    evidenceCount: 9,
    costToTest: 12000,
    daysToTest: 14,
    statement: "The current team can support six concurrent enterprise evaluations without cycle-time drift.",
  },
  {
    id: "gross-margin",
    label: "Inference margin",
    shortLabel: "Margin",
    category: "finance",
    confidence: 0.84,
    impact: 0.59,
    uncertainty: 0.12,
    evidenceCount: 24,
    costToTest: 1800,
    daysToTest: 3,
    statement: "Usage-weighted inference cost remains below 11% of enterprise ACV.",
  },
  {
    id: "procurement",
    label: "Procurement velocity",
    shortLabel: "Procurement",
    category: "execution",
    confidence: 0.58,
    impact: 0.71,
    uncertainty: 0.34,
    evidenceCount: 5,
    costToTest: 6300,
    daysToTest: 10,
    statement: "Pre-approved security artifacts can keep legal and procurement below forty-five days.",
  },
];

export const evidenceCorpus: Evidence[] = [
  {
    id: "ev-01",
    title: "Win/loss synthesis — regulated accounts",
    excerpt: "Seven of nine regulated prospects ranked auditability above model quality; five accepted the proposed premium without negotiation.",
    source: "Revenue research",
    date: "28 JUL",
    tags: ["pricing", "regulated", "buyer", "audit", "value"],
    polarity: "supports",
  },
  {
    id: "ev-02",
    title: "Pilot cohort activation trace",
    excerpt: "Median activation reached 19 days. The two fastest teams had a named solutions owner and pre-mapped data access.",
    source: "Product telemetry",
    date: "26 JUL",
    tags: ["activation", "onboarding", "deployment", "time", "owner"],
    polarity: "challenges",
  },
  {
    id: "ev-03",
    title: "Security review objection log",
    excerpt: "Data residency and audit exports caused 63% of review delay. The new trust packet directly answers both blockers.",
    source: "Deal desk",
    date: "23 JUL",
    tags: ["procurement", "security", "delay", "legal", "trust"],
    polarity: "neutral",
  },
  {
    id: "ev-04",
    title: "Usage-weighted unit economics",
    excerpt: "P90 inference spend is 8.4% of modeled ACV after caching. Long-context workloads remain the primary variance source.",
    source: "Finance model",
    date: "21 JUL",
    tags: ["margin", "cost", "inference", "acv", "finance"],
    polarity: "supports",
  },
  {
    id: "ev-05",
    title: "Champion continuity interviews",
    excerpt: "Six of eight champions brought security into the process early. Two deals stalled after the champion changed roles.",
    source: "Customer calls",
    date: "18 JUL",
    tags: ["champion", "retention", "buyer", "security", "deal"],
    polarity: "supports",
  },
  {
    id: "ev-06",
    title: "Capacity stress test",
    excerpt: "At seven parallel evaluations, solution-engineering response time doubled and pushed one milestone into the following week.",
    source: "Operating review",
    date: "14 JUL",
    tags: ["sales", "ramp", "capacity", "cycle", "execution"],
    polarity: "challenges",
  },
  {
    id: "ev-07",
    title: "Competitive pricing scan",
    excerpt: "Two adjacent vendors introduced governance bundles, but both meter audit exports separately and require annual prepayment.",
    source: "Market intelligence",
    date: "11 JUL",
    tags: ["pricing", "competitor", "governance", "market", "premium"],
    polarity: "neutral",
  },
  {
    id: "ev-08",
    title: "Trust packet dry run",
    excerpt: "A former enterprise CISO completed a simulated review in eleven business days with no critical evidence gaps.",
    source: "External red team",
    date: "08 JUL",
    tags: ["procurement", "security", "trust", "review", "evidence"],
    polarity: "supports",
  },
];

function mulberry32(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function normal(random: () => number) {
  const u = Math.max(random(), Number.EPSILON);
  const v = Math.max(random(), Number.EPSILON);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function quantile(values: number[], at: number) {
  const index = Math.floor((values.length - 1) * at);
  return values[index];
}

export function runSimulation(
  scenario: Scenario,
  seed = 1209,
  iterations = 6000,
): SimulationResult {
  const random = mulberry32(seed);
  const scores: number[] = [];
  let wins = 0;
  let arrTotal = 0;

  const scenarioShift =
    scenario.priceDelta * 0.0022 +
    (scenario.competitorPressure ? -0.055 : 0) +
    (scenario.regulatoryTailwind ? 0.048 : 0) +
    (scenario.onboardingSlip ? -0.072 : 0);

  const weightTotal = assumptions.reduce((sum, item) => sum + item.impact, 0);

  for (let run = 0; run < iterations; run += 1) {
    const base = assumptions.reduce((sum, item) => {
      const sampled = clamp(item.confidence + normal(random) * item.uncertainty * 0.22);
      return sum + sampled * item.impact;
    }, 0) / weightTotal;

    const score = clamp(base + scenarioShift + normal(random) * 0.035);
    const arr = Math.max(0, 8.9 + (score - 0.5) * 15.8 + normal(random) * 0.75);
    scores.push(arr);
    arrTotal += arr;
    if (score >= 0.735) wins += 1;
  }

  scores.sort((a, b) => a - b);
  const rawSensitivities = assumptions.map((item) => ({
    ...item,
    sensitivity: item.impact * item.uncertainty * (1.1 - item.confidence * 0.35),
  }));
  const maxSensitivity = Math.max(...rawSensitivities.map((item) => item.sensitivity));

  return {
    probability: wins / iterations,
    expectedArr: arrTotal / iterations,
    downsideArr: quantile(scores, 0.1),
    upsideArr: quantile(scores, 0.9),
    confidenceBand: [quantile(scores, 0.25), quantile(scores, 0.75)],
    sensitivities: rawSensitivities
      .map((item) => ({ ...item, sensitivity: item.sensitivity / maxSensitivity }))
      .sort((a, b) => b.sensitivity - a.sensitivity),
  };
}

export function rankProofs(items: Assumption[] = assumptions) {
  return items
    .map((item) => {
      const decisionExposure = item.impact * item.uncertainty * (1.05 - item.confidence * 0.3);
      const evidenceValue = decisionExposure * 1_000_000;
      const efficiency = evidenceValue / Math.sqrt(item.costToTest * Math.max(item.daysToTest, 1));
      return { ...item, evidenceValue, efficiency };
    })
    .sort((a, b) => b.efficiency - a.efficiency);
}

function tokens(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

export function retrieveEvidence(query: string, limit = 3) {
  const queryTokens = tokens(query);
  if (!queryTokens.length) return evidenceCorpus.slice(0, limit).map((item) => ({ ...item, score: 0 }));

  const documentTokens = evidenceCorpus.map((item) =>
    tokens(`${item.title} ${item.excerpt} ${item.tags.join(" ")}`),
  );

  return evidenceCorpus
    .map((item, index) => {
      const doc = documentTokens[index];
      const score = queryTokens.reduce((total, token) => {
        const frequency = doc.filter((word) => word === token).length;
        const containingDocs = documentTokens.filter((tokensInDoc) => tokensInDoc.includes(token)).length;
        const inverseDocumentFrequency = Math.log((evidenceCorpus.length + 1) / (containingDocs + 1)) + 1;
        return total + frequency * inverseDocumentFrequency;
      }, 0);
      return { ...item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function formatMoney(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${Math.round(value)}`;
}
