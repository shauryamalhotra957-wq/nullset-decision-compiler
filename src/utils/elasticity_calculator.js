/**
 * Decision Sensitivity Elasticity Calculator.
 * Measures the marginal sensitivity delta of decision outcomes relative to underlying premise shifts.
 */
export class DecisionElasticityCalculator {
  static computeElasticity({ baselineOutcomeScore, perturbedOutcomeScore, deltaPremisePct }) {
    if (deltaPremisePct === 0) return 0.0;

    const deltaOutcomePct = ((perturbedOutcomeScore - baselineOutcomeScore) / (baselineOutcomeScore || 1.0)) * 100;
    const elasticity = deltaOutcomePct / deltaPremisePct;

    return Number(elasticity.toFixed(3));
  }

  static rankPremiseVulnerability(premises) {
    // premises: [{ id, baselineScore, perturbedScore, deltaPct }]
    const ranked = premises.map(p => {
      const elasticity = DecisionElasticityCalculator.computeElasticity({
        baselineOutcomeScore: p.baselineScore,
        perturbedOutcomeScore: p.perturbedScore,
        deltaPremisePct: p.deltaPct,
      });
      return {
        id: p.id,
        elasticity,
        isHyperSensitive: Math.abs(elasticity) >= 2.0,
      };
    });

    return ranked.sort((a, b) => Math.abs(b.elasticity) - Math.abs(a.elasticity));
  }
}
