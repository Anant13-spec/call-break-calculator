import type { RoundScore } from '../types';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const MAX_TRICKS: Record<number, number> = {
  3: 17,
  4: 13,
  5: 10,
};

/**
 * Validates a round based on player count rules.
 */
export function validateRound(
  playerCount: number,
  roundData: Record<string, RoundScore>
): ValidationResult {
  const maxTricks = MAX_TRICKS[playerCount];
  
  if (!maxTricks) {
    return { isValid: false, message: 'Invalid number of players.' };
  }

  const playerIds = Object.keys(roundData);
  if (playerIds.length !== playerCount) {
    return { isValid: false, message: 'Please enter bids and tricks for all players.' };
  }

  let totalTricks = 0;

  for (const playerId of playerIds) {
    const entry = roundData[playerId];
    if (!entry) {
      return { isValid: false, message: 'Missing player data.' };
    }
    if (entry.bid === undefined || entry.bid === null || isNaN(entry.bid) || entry.bid < 1) {
      return { isValid: false, message: 'Bid must be at least 1 for all players.' };
    }
    if (entry.tricks === undefined || entry.tricks === null || isNaN(entry.tricks) || entry.tricks < 0) {
      return { isValid: false, message: 'Tricks cannot be negative.' };
    }
    if (entry.bid > maxTricks) {
      return { isValid: false, message: `Bid cannot exceed ${maxTricks} for ${playerCount} players.` };
    }
    if (entry.tricks > maxTricks) {
      return { isValid: false, message: `Tricks cannot exceed ${maxTricks} for ${playerCount} players.` };
    }
    totalTricks += entry.tricks;
  }

  if (totalTricks !== maxTricks) {
    return { 
      isValid: false, 
      message: `Total tricks won across all players must equal ${maxTricks}. (Current total: ${totalTricks})` 
    };
  }

  return { isValid: true };
}
