export interface Player {
  id: string;
  name: string;
}

export interface RoundScore {
  bid: number;
  tricks: number;
  score: number;
}

// Maps playerId to their RoundScore
export type Round = Record<string, RoundScore>;

export type GamePhase = 'setup' | 'playing' | 'finished';

export interface GameState {
  phase: GamePhase;
  players: Player[];
  rounds: Round[];
  totalRounds: number;
  theme: 'light' | 'dark';
}
