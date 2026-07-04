export interface SimulatorConfig {
  probA: number;
  probAServe: number;
  probAReturn: number;
  probAServesFirst: number;
  numMatches: number;
  noAdScoring: boolean;
  matchTiebreak: boolean;
  fastFour: boolean;
  bestOfFive: boolean;
  useAdvancedProb: boolean;
}

export interface MatchResult {
  score: [number, number][];
  scoreText: string;
  winner: 'A' | 'B';
}

export interface SimulationResult {
  winsA: number;
  winProbA: number;
  avgGamesPerSetA: number;
  avgGamesPerSetB: number;
  matches: MatchResult[];
}

export function simulatePoint(config: SimulatorConfig, isAServing: boolean): boolean {
  if (config.useAdvancedProb) {
    return Math.random() < (isAServing ? config.probAServe : config.probAReturn);
  }
  return Math.random() < config.probA;
}

export function simulateGame(config: SimulatorConfig, isAServing: boolean): boolean {
  let scoreA = 0, scoreB = 0;
  while (true) {
    if (simulatePoint(config, isAServing)) scoreA++; else scoreB++;
    if (config.noAdScoring && scoreA === 3 && scoreB === 3) {
      return simulatePoint(config, isAServing);
    }
    if (scoreA >= 4 && scoreA >= scoreB + 2) return true;
    if (scoreB >= 4 && scoreB >= scoreA + 2) return false;
  }
}

export function simulateTiebreak(config: SimulatorConfig, points: number, isAServingFirst: boolean): boolean {
  let scoreA = 0, scoreB = 0;
  let isAServing = isAServingFirst;
  while (true) {
    if (simulatePoint(config, isAServing)) scoreA++; else scoreB++;
    if (scoreA >= points && scoreA >= scoreB + 2) return true;
    if (scoreB >= points && scoreB >= scoreA + 2) return false;
    if ((scoreA + scoreB) % 2 === 1) isAServing = !isAServing;
  }
}

export function simulateSet(config: SimulatorConfig, isAServingFirst: boolean): [number, number] {
  let gamesA = 0, gamesB = 0;
  let isAServing = isAServingFirst;
  const gamesNeeded = config.fastFour ? 4 : 6;
  const tiebreakAt = config.fastFour ? 3 : 6;

  while (true) {
    if (simulateGame(config, isAServing)) gamesA++; else gamesB++;
    isAServing = !isAServing;
    if (gamesA === tiebreakAt && gamesB === tiebreakAt) {
      return simulateTiebreak(config, 7, isAServing) ? [gamesA + 1, gamesB] : [gamesA, gamesB + 1];
    }
    if (gamesA >= gamesNeeded && gamesA >= gamesB + 2) return [gamesA, gamesB];
    if (gamesB >= gamesNeeded && gamesB >= gamesA + 2) return [gamesA, gamesB];
    if (config.fastFour && (gamesA === 4 || gamesB === 4)) return [gamesA, gamesB];
  }
}

export function simulateMatch(config: SimulatorConfig): [number, number][] {
  let setsA = 0, setsB = 0;
  const score: [number, number][] = [];
  const setsToWin = config.bestOfFive ? 3 : 2;
  let isAServingFirst = Math.random() < config.probAServesFirst;

  while (setsA < setsToWin && setsB < setsToWin) {
    if (config.matchTiebreak && setsA === setsToWin - 1 && setsB === setsToWin - 1) {
      const tiebreakResult = simulateTiebreak(config, 10, isAServingFirst);
      score.push(tiebreakResult ? [1, 0] : [0, 1]);
      return score;
    }

    const setScore = simulateSet(config, isAServingFirst);
    score.push(setScore);
    if (setScore[0] > setScore[1]) setsA++; else setsB++;

    // Determine who serves first in the next set
    const totalGames = setScore[0] + setScore[1];
    if (totalGames % 2 === 0) {
      isAServingFirst = isAServingFirst;
    } else {
      isAServingFirst = !isAServingFirst;
    }
  }
  return score;
}

export function runSimulation(config: SimulatorConfig): SimulationResult {
  let winsA = 0;
  let totalGamesA = 0, totalGamesB = 0, totalSets = 0;
  const matches: MatchResult[] = [];

  for (let i = 0; i < config.numMatches; i++) {
    const score = simulateMatch(config);
    const scoreText = score.map(set => set.join('-')).join(' ');
    
    const setsWonA = score.filter(set => set[0] > set[1]).length;
    const setsWonB = score.filter(set => set[0] < set[1]).length;
    const winner = setsWonA > setsWonB ? 'A' : 'B';
    
    if (winner === 'A') {
      winsA++;
    }

    matches.push({
      score,
      scoreText,
      winner
    });

    totalSets += score.length;
    score.forEach(set => {
      totalGamesA += set[0];
      totalGamesB += set[1];
    });
  }

  const winProbA = winsA / config.numMatches;
  const avgGamesPerSetA = totalSets > 0 ? totalGamesA / totalSets : 0;
  const avgGamesPerSetB = totalSets > 0 ? totalGamesB / totalSets : 0;

  return {
    winsA,
    winProbA,
    avgGamesPerSetA,
    avgGamesPerSetB,
    matches
  };
}
