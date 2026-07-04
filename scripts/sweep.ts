import { runSimulation, SimulatorConfig } from '../lib/simulator';

const baseConfig: SimulatorConfig = {
  probA: 0.5,
  probAServe: 0.6,
  probAReturn: 0.4,
  probAServesFirst: 0.5,
  numMatches: 100000,
  noAdScoring: false,
  matchTiebreak: false,
  fastFour: false,
  bestOfFive: false,
  useAdvancedProb: false,
};

console.log('point_win_prob,match_win_prob');

for (let p = 0.40; p <= 0.60; p += 0.01) {
  const result = runSimulation({ ...baseConfig, probA: p });
  console.log(`${p.toFixed(2)},${result.winProbA.toFixed(4)}`);
}
