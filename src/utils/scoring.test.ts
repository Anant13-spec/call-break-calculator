import { describe, it, expect } from 'vitest';
import { calculateScore } from './scoring';
import { validateRound } from './validation';

describe('Scoring Logic', () => {
  it('should calculate negative score when tricks < bid', () => {
    expect(calculateScore(5, 4)).toBe(-50);
    expect(calculateScore(3, 0)).toBe(-30);
  });

  it('should calculate exact score when tricks === bid', () => {
    expect(calculateScore(5, 5)).toBe(50);
    expect(calculateScore(1, 1)).toBe(10);
  });

  it('should calculate extra score when tricks > bid', () => {
    expect(calculateScore(5, 7)).toBe(52);
    expect(calculateScore(4, 5)).toBe(41);
  });
});

describe('Validation Logic', () => {
  it('should validate 4 players correctly (max 13)', () => {
    const roundData = {
      p1: { bid: 3, tricks: 3, score: 0 },
      p2: { bid: 3, tricks: 4, score: 0 },
      p3: { bid: 3, tricks: 3, score: 0 },
      p4: { bid: 3, tricks: 3, score: 0 },
    };
    
    expect(validateRound(4, roundData).isValid).toBe(true);
  });

  it('should fail 4 players if total tricks != 13', () => {
    const roundData = {
      p1: { bid: 3, tricks: 3, score: 0 },
      p2: { bid: 3, tricks: 4, score: 0 },
      p3: { bid: 3, tricks: 3, score: 0 },
      p4: { bid: 3, tricks: 4, score: 0 }, // total 14
    };
    
    expect(validateRound(4, roundData).isValid).toBe(false);
  });

  it('should validate 3 players correctly (max 17)', () => {
    const roundData = {
      p1: { bid: 5, tricks: 6, score: 0 },
      p2: { bid: 5, tricks: 5, score: 0 },
      p3: { bid: 5, tricks: 6, score: 0 },
    };
    
    expect(validateRound(3, roundData).isValid).toBe(true);
  });

  it('should validate 5 players correctly (max 10)', () => {
    const roundData = {
      p1: { bid: 2, tricks: 2, score: 0 },
      p2: { bid: 2, tricks: 2, score: 0 },
      p3: { bid: 2, tricks: 2, score: 0 },
      p4: { bid: 2, tricks: 2, score: 0 },
      p5: { bid: 2, tricks: 2, score: 0 },
    };
    
    expect(validateRound(5, roundData).isValid).toBe(true);
  });

  it('should fail if a bid is < 1', () => {
    const roundData = {
      p1: { bid: 0, tricks: 3, score: 0 },
      p2: { bid: 3, tricks: 4, score: 0 },
      p3: { bid: 3, tricks: 3, score: 0 },
      p4: { bid: 3, tricks: 3, score: 0 },
    };
    
    expect(validateRound(4, roundData).isValid).toBe(false);
  });
});
