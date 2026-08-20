import type { Player, Round } from '../types';
import { Trophy, RotateCcw, Crown } from 'lucide-react';

interface GameResultProps {
  players: Player[];
  rounds: Round[];
  onNewGame: () => void;
}

const SUITS = ['♠', '♥', '♣', '♦', '★'];

export function GameResult({ players, rounds, onNewGame }: GameResultProps) {
  const totals = players.map(player => {
    const total = rounds.reduce((sum, round) => sum + (round[player.id]?.score || 0), 0);
    return { ...player, total };
  });

  totals.sort((a, b) => b.total - a.total);

  const getRankBadge = (index: number) => {
    if (index === 0) return { icon: '🥇', label: '1ST PLACE', isWinner: true };
    if (index === 1) return { icon: '🥈', label: '2ND PLACE', isWinner: false };
    if (index === 2) return { icon: '🥉', label: '3RD PLACE', isWinner: false };
    return { icon: `${index + 1}th`, label: `${index + 1}TH PLACE`, isWinner: false };
  };

  const winner = totals[0];

  return (
    <div className="game-result-container">
      <div className="card playing-card winner-podium-card">
        <div className="suit-decor top-left">♠</div>
        <div className="suit-decor top-right">♥</div>
        <div className="suit-decor bottom-left">♣</div>
        <div className="suit-decor bottom-right">♦</div>

        <div className="winner-trophy-badge">
          <Crown size={32} className="crown-icon" />
          <Trophy size={48} className="trophy-icon" />
        </div>

        <span className="badge-pill gold-pill">CHAMPION DECLARED</span>
        <h1 className="game-over-title">Game Complete</h1>

        <div className="winner-highlight-box">
          <span className="winner-label">🏆 GRAND WINNER</span>
          <h2 className="winner-name">{winner?.name}</h2>
          <span className="winner-score">{winner?.total} Points</span>
        </div>

        {/* Full Leaderboard */}
        <div className="final-ranks-list">
          {totals.map((player, index) => {
            const badge = getRankBadge(index);
            const playerIndex = players.findIndex(p => p.id === player.id);
            const suit = SUITS[playerIndex % SUITS.length];

            return (
              <div
                key={player.id}
                className={`final-rank-item ${badge.isWinner ? 'winner-item' : ''}`}
              >
                <div className="rank-left">
                  <span className="rank-medal">{badge.icon}</span>
                  <span className="player-suit">{suit}</span>
                  <span className="rank-player-name">{player.name}</span>
                </div>
                <div className="rank-score-pill">
                  <strong>{player.total}</strong> pts
                </div>
              </div>
            );
          })}
        </div>

        <button type="button" className="btn btn-gold" onClick={onNewGame} style={{ marginTop: '20px' }}>
          <RotateCcw size={18} /> START NEW GAME
        </button>
      </div>
    </div>
  );
}
