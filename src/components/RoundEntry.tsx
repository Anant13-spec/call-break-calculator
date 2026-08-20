import { useState, useEffect } from 'react';
import type { Player, Round } from '../types';
import { calculateScore } from '../utils/scoring';
import { validateRound, MAX_TRICKS } from '../utils/validation';
import { RotateCcw, ArrowLeft } from 'lucide-react';

interface RoundEntryProps {
  players: Player[];
  currentRoundNumber: number;
  totalRounds: number;
  initialRoundData?: Round;
  onSubmitRound: (round: Round) => void;
  isEditing?: boolean;
  onCancelEdit?: () => void;
  onEditPreviousRound?: () => void;
}

const SUITS = ['♠', '♥', '♣', '♦', '★'];
const SUIT_COLORS = ['var(--suit-spade)', 'var(--suit-heart)', 'var(--suit-club)', 'var(--suit-diamond)', 'var(--accent-gold)'];

export function RoundEntry({
  players,
  currentRoundNumber,
  totalRounds,
  initialRoundData,
  onSubmitRound,
  isEditing,
  onCancelEdit,
  onEditPreviousRound,
}: RoundEntryProps) {
  const maxPossibleTricks = MAX_TRICKS[players.length] || 13;

  const [inputState, setInputState] = useState<Record<string, { bid: string; tricks: string }>>(() => {
    const initial: Record<string, { bid: string; tricks: string }> = {};
    players.forEach(p => {
      if (initialRoundData && initialRoundData[p.id]) {
        initial[p.id] = {
          bid: String(initialRoundData[p.id].bid),
          tricks: String(initialRoundData[p.id].tricks),
        };
      } else {
        initial[p.id] = { bid: '1', tricks: '' };
      }
    });
    return initial;
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initial: Record<string, { bid: string; tricks: string }> = {};
    players.forEach(p => {
      if (initialRoundData && initialRoundData[p.id]) {
        initial[p.id] = {
          bid: String(initialRoundData[p.id].bid),
          tricks: String(initialRoundData[p.id].tricks),
        };
      } else {
        initial[p.id] = { bid: '1', tricks: '' };
      }
    });
    setInputState(initial);
    setError(null);
  }, [currentRoundNumber, initialRoundData, players]);

  const handleTextChange = (playerId: string, field: 'bid' | 'tricks', value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    let finalVal = cleaned;
    if (cleaned !== '') {
      const num = parseInt(cleaned, 10);
      if (num > maxPossibleTricks) {
        finalVal = String(maxPossibleTricks);
      }
    }

    setInputState(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: finalVal,
      },
    }));
    setError(null);
  };

  const getPlayerNumericValues = (playerId: string) => {
    const state = inputState[playerId] || { bid: '1', tricks: '0' };
    const bid = state.bid === '' ? 1 : parseInt(state.bid, 10);
    const tricks = state.tricks === '' ? 0 : parseInt(state.tricks, 10);
    const score = calculateScore(bid, tricks);
    return { bid, tricks, score, rawBid: state.bid, rawTricks: state.tricks };
  };

  const getStatus = (bid: number, tricks: number, hasEnteredTricks: boolean) => {
    if (!hasEnteredTricks) return { text: 'Awaiting Tricks', className: 'status-tag pending' };
    if (tricks < bid) return { text: 'Failed (-' + (bid * 10) + ')', className: 'status-tag failed' };
    if (tricks === bid) return { text: 'Exact Bid (+' + (bid * 10) + ')', className: 'status-tag completed' };
    return { text: 'Exceeded (+' + (bid * 10 + (tricks - bid)) + ')', className: 'status-tag exceeded' };
  };

  const getScorePrefix = (score: number) => (score > 0 ? '+' : '');

  const totalTricksEntered = Object.values(inputState).reduce((sum, item) => {
    const val = item.tricks === '' ? 0 : parseInt(item.tricks, 10);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const handleSubmit = () => {
    const roundData: Round = {};
    for (const p of players) {
      const state = inputState[p.id];
      if (!state || state.bid === '' || state.tricks === '') {
        setError(`Please enter both Bid and Tricks won for all players.`);
        return;
      }
      const bid = parseInt(state.bid, 10);
      const tricks = parseInt(state.tricks, 10);
      roundData[p.id] = {
        bid,
        tricks,
        score: calculateScore(bid, tricks),
      };
    }

    const validation = validateRound(players.length, roundData);
    if (!validation.isValid) {
      setError(validation.message || 'Invalid round data.');
      return;
    }
    onSubmitRound(roundData);
  };

  return (
    <div className="round-entry-container">
      {/* Round Header Card */}
      <div className="card round-banner">
        <div className="suit-decor top-left">♠</div>
        <div className="suit-decor top-right">♥</div>
        <div className="suit-decor bottom-left">♣</div>
        <div className="suit-decor bottom-right">♦</div>

        <div className="round-title-row">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span className="badge-pill">
              {isEditing ? 'EDITING ROUND' : 'CURRENT ROUND'}
            </span>

            {onEditPreviousRound && (
              <button
                type="button"
                className="btn secondary quick-prev-btn"
                onClick={onEditPreviousRound}
                title="Go back to edit previous round"
              >
                <RotateCcw size={13} /> Edit Previous Round
              </button>
            )}
          </div>

          <h2 className="round-heading">
            Round {currentRoundNumber} <span className="round-total-sub">/ {totalRounds}</span>
          </h2>
        </div>

        <div className="trick-counter-bar">
          <div className="trick-counter-info">
            <span>Total Tricks Count:</span>
            <strong className={totalTricksEntered === maxPossibleTricks ? 'trick-count-match' : 'trick-count-mismatch'}>
              {totalTricksEntered} / {maxPossibleTricks}
            </strong>
          </div>
          <div className="trick-progress-track">
            <div
              className={`trick-progress-fill ${totalTricksEntered === maxPossibleTricks ? 'complete' : ''}`}
              style={{ width: `${Math.min(100, (totalTricksEntered / maxPossibleTricks) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message shake">
          ⚠️ {error}
        </div>
      )}

      {/* Playing Cards for each player */}
      <div className="player-cards-list">
        {players.map((player, idx) => {
          const { bid, tricks, score, rawTricks } = getPlayerNumericValues(player.id);
          const hasEnteredTricks = rawTricks !== '';
          const status = getStatus(bid, tricks, hasEnteredTricks);
          const suitIcon = SUITS[idx % SUITS.length];
          const suitColor = SUIT_COLORS[idx % SUIT_COLORS.length];

          return (
            <div key={player.id} className="playing-card">
              <div className="card-top-bar">
                <div className="player-identity">
                  <span className="player-suit" style={{ color: suitColor }}>
                    {suitIcon}
                  </span>
                  <span className="player-name">{player.name}</span>
                </div>
                <span className={status.className}>{status.text}</span>
              </div>

              <div className="card-input-grid">
                <div className="entry-box">
                  <label className="entry-label">BID</label>
                  <div className="input-type-wrapper">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="1"
                      value={inputState[player.id]?.bid ?? '1'}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => handleTextChange(player.id, 'bid', e.target.value)}
                      className="large-type-input"
                    />
                  </div>
                  <span className="input-hint">Min 1</span>
                </div>

                <div className="entry-box">
                  <label className="entry-label">TRICKS WON</label>
                  <div className="input-type-wrapper">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="0"
                      value={inputState[player.id]?.tricks ?? ''}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => handleTextChange(player.id, 'tricks', e.target.value)}
                      className="large-type-input highlight"
                    />
                  </div>
                  <span className="input-hint">Target: {bid}</span>
                </div>
              </div>

              <div className="card-score-strip">
                <span className="score-strip-label">Calculated Score:</span>
                <span className={`score-strip-value ${score >= 0 ? 'positive' : 'negative'}`}>
                  {hasEnteredTricks ? `${getScorePrefix(score)}${score}` : '--'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons-group">
        {isEditing && onCancelEdit && (
          <button type="button" className="btn secondary" onClick={onCancelEdit} style={{ flex: 1 }}>
            <ArrowLeft size={16} /> CANCEL
          </button>
        )}
        <button type="button" className="btn btn-gold" onClick={handleSubmit} style={{ flex: 2 }}>
          {isEditing ? '✓ SAVE ROUND CHANGES' : '♠ SUBMIT ROUND'}
        </button>
      </div>
    </div>
  );
}
