import { useState } from 'react';
import type { Player, GameState } from '../types';
import { Play, Trash2, ShieldCheck } from 'lucide-react';

interface SetupScreenProps {
  onStartGame: (players: Player[], totalRounds: number) => void;
  savedGame: GameState | null;
  onContinueGame: () => void;
  onDiscardSavedGame: () => void;
}

const SUITS = ['♠', '♥', '♣', '♦', '★'];
const ROUND_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function SetupScreen({
  onStartGame,
  savedGame,
  onContinueGame,
  onDiscardSavedGame,
}: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  const [totalRounds, setTotalRounds] = useState<number>(5);

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setPlayerNames(prev => {
      const newNames = [...prev];
      if (count > prev.length) {
        for (let i = prev.length; i < count; i++) {
          newNames.push(`Player ${i + 1}`);
        }
      } else {
        newNames.length = count;
      }
      return newNames;
    });
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleRoundChange = (valStr: string) => {
    const cleaned = valStr.replace(/[^0-9]/g, '');
    if (cleaned === '') {
      setTotalRounds(1);
      return;
    }
    const num = parseInt(cleaned, 10);
    const clamped = Math.max(1, Math.min(10, num));
    setTotalRounds(clamped);
  };

  const handleStart = () => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: `p${index + 1}`,
      name: name.trim() || `Player ${index + 1}`,
    }));
    onStartGame(players, totalRounds);
  };

  const hasValidSavedGame = savedGame && savedGame.players && savedGame.players.length > 0;

  return (
    <div className="setup-card-container">
      {/* Saved Game Banner if available */}
      {hasValidSavedGame && (
        <div className="card playing-card saved-game-banner" style={{ marginBottom: '16px' }}>
          <div className="saved-game-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} className="gold-icon" />
              <span className="badge-pill gold-pill">SAVED GAME AVAILABLE</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Round {savedGame.rounds.length + 1} of {savedGame.totalRounds}
            </span>
          </div>

          <div className="saved-game-info">
            <div className="saved-players-preview">
              {savedGame.players.map((p, idx) => (
                <span key={p.id} className="saved-player-chip">
                  <span className="player-suit">{SUITS[idx % SUITS.length]}</span>
                  {p.name}
                </span>
              ))}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              {savedGame.rounds.length === 0
                ? 'Game created, no rounds played yet'
                : `${savedGame.rounds.length} ${savedGame.rounds.length === 1 ? 'round' : 'rounds'} scored`}
            </div>
          </div>

          <div className="saved-game-actions">
            <button
              type="button"
              className="btn btn-gold continue-game-btn"
              onClick={onContinueGame}
            >
              <Play size={16} fill="currentColor" /> Continue Previous Game
            </button>
            <button
              type="button"
              className="btn secondary discard-game-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to discard the saved game?')) {
                  onDiscardSavedGame();
                }
              }}
              title="Delete Saved Game"
            >
              <Trash2 size={16} /> Discard
            </button>
          </div>
        </div>
      )}

      {/* Main Setup Card */}
      <div className="card playing-card setup-card">
        <div className="suit-decor top-left">♠</div>
        <div className="suit-decor top-right">♥</div>
        <div className="suit-decor bottom-left">♣</div>
        <div className="suit-decor bottom-right">♦</div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span className="badge-pill">NEW GAME SETUP</span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0 4px' }}>Table Settings</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Configure players and custom rounds (1 to 10)
          </p>
        </div>

        <div className="form-section">
          <label className="section-label">Number of Players</label>
          <div className="player-count-selector">
            {[3, 4, 5].map(count => (
              <button
                key={count}
                type="button"
                className={`player-count-btn ${playerCount === count ? 'active' : ''}`}
                onClick={() => handlePlayerCountChange(count)}
              >
                <span className="count-number">{count}</span>
                <span className="count-label">Players</span>
                <span className="count-tricks-note">{count === 3 ? '17 tricks' : count === 4 ? '13 tricks' : '10 tricks'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label className="section-label">Player Names</label>
          <div className="player-inputs-list">
            {playerNames.map((name, index) => (
              <div key={index} className="player-input-row">
                <span className="player-input-suit">{SUITS[index % SUITS.length]}</span>
                <input
                  type="text"
                  value={name}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder={`Player ${index + 1}`}
                  className="player-name-field"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label className="section-label" style={{ margin: 0 }}>Number of Rounds (1 - 10)</label>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-gold)' }}>
              {totalRounds} {totalRounds === 1 ? 'Round' : 'Rounds'}
            </span>
          </div>

          {/* Quick 1 to 10 Selector Grid */}
          <div className="round-numbers-grid">
            {ROUND_OPTIONS.map(r => (
              <button
                key={r}
                type="button"
                className={`round-number-btn ${totalRounds === r ? 'active' : ''}`}
                onClick={() => setTotalRounds(r)}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Custom Numeric Input for Rounds */}
          <div className="custom-round-input-wrapper">
            <span className="custom-round-label">Custom Round Entry:</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={totalRounds}
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleRoundChange(e.target.value)}
              className="custom-round-input"
              placeholder="1 - 10"
              maxLength={2}
            />
          </div>
        </div>

        <button type="button" className="btn btn-gold" onClick={handleStart} style={{ marginTop: '12px' }}>
          ♠ DEAL & START GAME ({totalRounds} {totalRounds === 1 ? 'ROUND' : 'ROUNDS'})
        </button>
      </div>
    </div>
  );
}
