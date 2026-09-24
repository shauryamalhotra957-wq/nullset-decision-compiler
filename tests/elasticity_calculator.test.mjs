import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { DecisionElasticityCalculator } from '../src/utils/elasticity_calculator.js';

describe('DecisionElasticityCalculator Test Suite', () => {
  test('computes proportional elasticity correctly', () => {
    // 10% change in premise causes 30% change in outcome -> elasticity = 3.0
    const elasticity = DecisionElasticityCalculator.computeElasticity({
      baselineOutcomeScore: 100,
      perturbedOutcomeScore: 130,
      deltaPremisePct: 10,
    });
    assert.strictEqual(elasticity, 3.0);
  });

  test('ranks hyper-sensitive premises at the top', () => {
    const premises = [
      { id: 'premise-inert', baselineScore: 100, perturbedScore: 101, deltaPct: 10 }, // 0.1
      { id: 'premise-volatile', baselineScore: 100, perturbedScore: 150, deltaPct: 10 }, // 5.0
    ];
    const ranked = DecisionElasticityCalculator.rankPremiseVulnerability(premises);
    assert.strictEqual(ranked[0].id, 'premise-volatile');
    assert.strictEqual(ranked[0].isHyperSensitive, true);
    assert.strictEqual(ranked[1].isHyperSensitive, false);
  });
});
