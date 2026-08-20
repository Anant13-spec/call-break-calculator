import { useState } from 'react';
import type { Player, Round } from '../types';
import { ChevronDown, ChevronUp, Edit3, Award } from 'lucide-react';

interface ScoreboardProps {
  players: Player[];
  rounds: Round[];
  onEditRound?: (roundIndex: number) => void;
}

const SUITS = ['♠', '♥', '♣', '♦', '★'];

export function Scoreboard({ players, rounds, onEditRound }: ScoreboardProps) {
  const [expandedRounds, setExpandedRounds] = useState<Record<number, boolean>>({});

  const toggleRoundExpand = (roundIndex: number) => {
    setExpandedRounds(prev => ({
      ...prev,
      [roundIndex]: !prev[roundIndex],
    }));
  };

  const getPlayerTotal = (playerId: string) => {
    return rounds.reduce((total, round) => {
      return total + (round[playerId]?.score || 0);
    }, 0);
  };

  const getScorePrefix = (score: number) => (score > 0 ? '+' : '');

  if (rounds.length === 0) {
    return null;
  }

  // Calculate current rankings
  const rankedPlayers = [...players].sort((a, b) => getPlayerTotal(b.id) - getPlayerTotal(a.id));

  return (
    <div className="scoreboard-container">
      {/* Header */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={20} className="gold-icon" />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Leaderboard & Scoreboard</h3>
        </div>
        <span className="badge-pill">{rounds.length} Rounds Played</span>
      </div>

      {/* Mobile Stacked Player Cards */}
      <div className="mobile-only-cards">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {rankedPlayers.map((player, rank) => {
            const total = getPlayerTotal(player.id);
            const playerIndex = players.findIndex(p => p.id === player.id);
            const suit = SUITS[playerIndex % SUITS.length];

            return (
              <div key={player.id} className="playing-card player-total-card">
                <div className="card-top-bar">
                  <div className="player-identity">
                    <span className="player-rank">#{rank + 1}</span>
                    <span className="player-suit">{suit}</span>
                    <span className="player-name">{player.name}</span>
                  </div>
                  <div className="player-total-badge">
                    <span className="total-label">TOTAL</span>
                    <span className={`total-val ${total >= 0 ? 'positive' : 'negative'}`}>
                      {total}
                    </span>
                  </div>
                </div>

                <div className="round-chips-row">
                  {rounds.map((round, rIndex) => {
                    const data = round[player.id];
                    if (!data) return null;
                    const isPositive = data.score >= 0;
                    return (
                      <div key={rIndex} className={`round-score-chip ${isPositive ? 'chip-pos' : 'chip-neg'}`}>
                        <span className="chip-round">R{rIndex + 1}</span>
                        <span className="chip-score">{getScorePrefix(data.score)}{data.score}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="desktop-table-view playing-card" style={{ overflowX: 'auto' }}>
        <table className="card-table">
          <thead>
            <tr>
              <th>Player</th>
              {rounds.map((_, idx) => (
                <th key={idx} style={{ textAlign: 'center' }}>R{idx + 1}</th>
              ))}
              <th style={{ textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {rankedPlayers.map(player => (
              <tr key={player.id}>
                <td>
                  <span className="player-suit" style={{ marginRight: '6px' }}>
                    {SUITS[players.findIndex(p => p.id === player.id) % SUITS.length]}
                  </span>
                  <strong>{player.name}</strong>
                </td>
                {rounds.map((round, idx) => {
                  const data = round[player.id];
                  if (!data) return <td key={idx} style={{ textAlign: 'center' }}>-</td>;
                  return (
                    <td
                      key={idx}
                      style={{
                        textAlign: 'center',
                        color: data.score >= 0 ? 'var(--success-color)' : 'var(--danger-color)',
                        fontWeight: 600,
                      }}
                    >
                      {getScorePrefix(data.score)}{data.score}
                    </td>
                  );
                })}
                <td style={{ textAlign: 'right' }}>
                  <span className="table-total-pill">{getPlayerTotal(player.id)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Round-by-Round Breakdown & History */}
      <div className="round-history-section" style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px' }}>Detailed Round History</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rounds.map((round, rIndex) => {
            const isExpanded = expandedRounds[rIndex] ?? true;
            return (
              <div key={rIndex} className="playing-card history-round-card">
                <div
                  className="history-header"
                  onClick={() => toggleRoundExpand(rIndex)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="round-number-tag">Round {rIndex + 1}</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>

                  {onEditRound && (
                    <button
                      type="button"
                      className="btn secondary edit-round-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditRound(rIndex);
                      }}
                    >
                      <Edit3 size={13} /> Edit Round {rIndex + 1}
                    </button>
                  )}
                </div>

                {isExpanded && (
                  <div className="history-details-grid">
                    {players.map((p, pIdx) => {
                      const data = round[p.id];
                      if (!data) return null;
                      const isPositive = data.score >= 0;
                      return (
                        <div key={p.id} className="history-player-row">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className="player-suit">{SUITS[pIdx % SUITS.length]}</span>
                            <span style={{ fontWeight: 600 }}>{p.name}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="history-bid-tricks">
                              Bid: <strong>{data.bid}</strong> | Won: <strong>{data.tricks}</strong>
                            </span>
                            <span className={`history-score-tag ${isPositive ? 'pos' : 'neg'}`}>
                              {getScorePrefix(data.score)}{data.score}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
