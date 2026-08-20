/**
 * Calculate the score for a player in a round of Call Break.
 * 
 * Rules:
 * If tricks < bid: score = bid * -10
 * If tricks == bid: score = bid * 10
 * If tricks > bid: score = (bid * 10) + (tricks - bid)
 */
export function calculateScore(bid: number, tricks: number): number {
  if (tricks < bid) {
    return bid * -10;
  }
  if (tricks === bid) {
    return bid * 10;
  }
  
  // tricks > bid
  return (bid * 10) + (tricks - bid);
}
