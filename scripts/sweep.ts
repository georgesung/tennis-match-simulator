import { runSimulation, SimulatorConfig } from '../lib/simulator';
import * as fs from 'fs';
import * as path from 'path';

const numMatches = 100000;

const baseConfig: SimulatorConfig = {
  probA: 0.5,
  probAServe: 0.6,
  probAReturn: 0.4,
  probAServesFirst: 0.5,
  numMatches,
  noAdScoring: false,
  matchTiebreak: false,
  fastFour: false,
  bestOfFive: false,
  useAdvancedProb: false,
};

// Ensure s_curve_data directory exists
const outputDir = 's_curve_data';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const csvPath = path.join(outputDir, 'sweep_results.csv');
const writeStream = fs.createWriteStream(csvPath);

// Write header
writeStream.write('point_win_prob,default_match_win_prob,best_of_5_match_win_prob,no_ad_match_win_prob,match_tiebreak_match_win_prob,fast_four_match_win_prob,num_matches\n');

console.log('Starting multi-scenario tennis simulation parameter sweep...');
console.log(`Each configuration will be simulated over ${numMatches.toLocaleString()} matches per point win probability step.`);

for (let i = 40; i <= 60; i++) {
  const p = i / 100;
  process.stdout.write(`Simulating p = ${p.toFixed(2)}... `);
  
  // 1. Default (Best of 3)
  const resDefault = runSimulation({ ...baseConfig, probA: p });
  
  // 2. Best of 5
  const resBestOf5 = runSimulation({ ...baseConfig, probA: p, bestOfFive: true });
  
  // 3. No-Ad
  const resNoAd = runSimulation({ ...baseConfig, probA: p, noAdScoring: true });
  
  // 4. Match Tiebreak
  const resMatchTiebreak = runSimulation({ ...baseConfig, probA: p, matchTiebreak: true });
  
  // 5. Fast 4 Format
  const resFastFour = runSimulation({ ...baseConfig, probA: p, fastFour: true });

  writeStream.write(`${p.toFixed(2)},${resDefault.winProbA.toFixed(4)},${resBestOf5.winProbA.toFixed(4)},${resNoAd.winProbA.toFixed(4)},${resMatchTiebreak.winProbA.toFixed(4)},${resFastFour.winProbA.toFixed(4)},${numMatches}\n`);
  
  console.log('done');
}

writeStream.end();
console.log(`\nSuccessfully generated sweep data at: ${csvPath}`);
