import assert from "node:assert/strict";
import test from "node:test";
import {
  assumptions,
  rankProofs,
  retrieveEvidence,
  runSimulation,
} from "../lib/decision-engine.ts";

const baseline = {
  priceDelta: 8,
  competitorPressure: false,
  regulatoryTailwind: true,
  onboardingSlip: false,
};

test("simulation is deterministic for an identical seed", () => {
  const first = runSimulation(baseline, 42, 1500);
  const second = runSimulation(baseline, 42, 1500);
  assert.deepEqual(first, second);
});

test("negative shocks reduce target probability", () => {
  const control = runSimulation(baseline, 77, 4000);
  const stressed = runSimulation(
    { ...baseline, competitorPressure: true, onboardingSlip: true, regulatoryTailwind: false },
    77,
    4000,
  );
  assert.ok(stressed.probability < control.probability - 0.2);
  assert.ok(stressed.expectedArr < control.expectedArr);
});

test("proof queue ranks every assumption by evidence efficiency", () => {
  const ranked = rankProofs();
  assert.equal(ranked.length, assumptions.length);
  assert.ok(ranked.every((item) => item.evidenceValue > 0 && item.efficiency > 0));
  for (let index = 1; index < ranked.length; index += 1) {
    assert.ok(ranked[index - 1].efficiency >= ranked[index].efficiency);
  }
});

test("local retrieval returns semantically relevant evidence", () => {
  const [top] = retrieveEvidence("security procurement review delay");
  assert.match(top.title, /Security|Trust/i);
  assert.ok(top.score > 0);
});
