import { useState, useEffect } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { RoundEntry } from './components/RoundEntry';
import { Scoreboard } from './components/Scoreboard';
import { GameResult } from './components/GameResult';
import type { GameState, Player, Round } from './types';
import { Moon, Sun, RotateCcw, ArrowLeft, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'callbreak_game_state_v1';
const THEME_KEY = 'callbreak_theme_v1';

const initialGameState: GameState = {
  phase: 'setup',
  players: [],
  rounds: [],
  totalRounds: 5,
  theme: 'dark',
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [savedGame, setSavedGame] = useState<GameState | null>(null);
  const [editingRoundIndex, setEditingRoundIndex] = useState<number | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Load theme and state from LocalStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
      const themeToUse = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState) as GameState;
        if (parsed.players && parsed.players.length > 0) {
          setSavedGame(parsed);
          // If the user refreshed while playing or finished, stay on that screen
          if (parsed.phase === 'playing' || parsed.phase === 'finished') {
            setGameState({ ...parsed, theme: themeToUse });
          } else {
            setGameState(prev => ({ ...prev, theme: themeToUse }));
          }
        } else {
          setGameState(prev => ({ ...prev, theme: themeToUse }));
        }
      } else {
        setGameState(prev => ({ ...prev, theme: themeToUse }));
      }
      document.documentElement.setAttribute('data-theme', themeToUse);
    } catch (e) {
      console.error('Failed to load saved state:', e);
    } finally {
      setIsReady(true);
    }
  }, []);

  // Save to LocalStorage whenever gameState changes
  useEffect(() => {
    if (!isReady) return;
    try {
      if (gameState.players && gameState.players.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
        setSavedGame(gameState);
      }
      localStorage.setItem(THEME_KEY, gameState.theme);
      document.documentElement.setAttribute('data-theme', gameState.theme);
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }, [gameState, isReady]);

  const handleStartGame = (players: Player[], totalRounds: number) => {
    const newState: GameState = {
      ...gameState,
      phase: 'playing',
      players,
      totalRounds,
      rounds: [],
    };
    setGameState(newState);
    setSavedGame(newState);
    setEditingRoundIndex(null);
  };

  const handleContinueGame = () => {
    if (savedGame) {
      setGameState({
        ...savedGame,
        phase: savedGame.rounds.length >= savedGame.totalRounds ? 'finished' : 'playing',
        theme: gameState.theme,
      });
    }
  };

  const handleDiscardSavedGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedGame(null);
    setGameState(prev => ({
      ...initialGameState,
      theme: prev.theme,
    }));
  };

  const handleSubmitRound = (round: Round) => {
    setGameState(prev => {
      let updatedRounds = [...prev.rounds];
      if (editingRoundIndex !== null) {
        updatedRounds[editingRoundIndex] = round;
      } else {
        updatedRounds.push(round);
      }

      const isFinished = updatedRounds.length >= prev.totalRounds;
      return {
        ...prev,
        rounds: updatedRounds,
        phase: isFinished ? 'finished' : 'playing',
      };
    });
    setEditingRoundIndex(null);
  };

  const handleEditRound = (roundIndex: number) => {
    setEditingRoundIndex(roundIndex);
    if (gameState.phase === 'finished') {
      setGameState(prev => ({ ...prev, phase: 'playing' }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingRoundIndex(null);
    if (gameState.rounds.length >= gameState.totalRounds) {
      setGameState(prev => ({ ...prev, phase: 'finished' }));
    }
  };

  const handleBackToSetup = () => {
    if (editingRoundIndex !== null) {
      handleCancelEdit();
      return;
    }

    if (window.confirm('Go back to Setup? Your current game will remain saved and can be resumed at any time.')) {
      setGameState(prev => ({
        ...prev,
        phase: 'setup',
      }));
    }
  };

  const handleEditPreviousRound = () => {
    if (gameState.rounds.length > 0) {
      handleEditRound(gameState.rounds.length - 1);
    }
  };

  const handleResetGame = () => {
    if (window.confirm('Are you sure you want to reset and start a new game? All current scores will be cleared.')) {
      handleDiscardSavedGame();
    }
  };

  const toggleTheme = () => {
    setGameState(prev => {
      const nextTheme = prev.theme === 'light' ? 'dark' : 'light';
      return { ...prev, theme: nextTheme };
    });
  };

  if (!isReady) {
    return null;
  }

  const currentRoundNum = editingRoundIndex !== null ? editingRoundIndex + 1 : gameState.rounds.length + 1;
  const initialRoundData = editingRoundIndex !== null ? gameState.rounds[editingRoundIndex] : undefined;

  return (
    <div className="app-container">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {gameState.phase !== 'setup' && (
            <button
              type="button"
              className="btn secondary nav-back-btn"
              onClick={handleBackToSetup}
              title={editingRoundIndex !== null ? 'Back to Current Game' : 'Back to Setup'}
              aria-label="Go Back"
            >
              <ArrowLeft size={18} />
              <span className="back-text">{editingRoundIndex !== null ? 'Cancel' : 'Setup'}</span>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="/logo.png"
              alt="Logo"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                objectFit: 'cover',
                border: '1px solid var(--accent-gold)',
                boxShadow: '0 2px 8px var(--gold-glow)',
              }}
              onError={(e) => {
                // If image fails to load, hide it gracefully
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <h1 style={{ margin: 0, fontSize: '19px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                Call Break
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Score Calculator</span>
                {gameState.phase !== 'setup' && (
                  <span className="autosave-tag">
                    <CheckCircle2 size={11} /> Saved
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {gameState.phase !== 'setup' && (
            <button
              type="button"
              className="btn secondary header-action-btn"
              onClick={handleResetGame}
              title="Reset Game"
            >
              <RotateCcw size={15} />
              <span className="reset-text">Reset</span>
            </button>
          )}

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
          >
            {gameState.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      <main>
        {gameState.phase === 'setup' && (
          <SetupScreen
            onStartGame={handleStartGame}
            savedGame={savedGame}
            onContinueGame={handleContinueGame}
            onDiscardSavedGame={handleDiscardSavedGame}
          />
        )}

        {gameState.phase === 'playing' && (
          <>
            <RoundEntry
              key={currentRoundNum}
              players={gameState.players}
              currentRoundNumber={currentRoundNum}
              totalRounds={gameState.totalRounds}
              initialRoundData={initialRoundData}
              onSubmitRound={handleSubmitRound}
              isEditing={editingRoundIndex !== null}
              onCancelEdit={editingRoundIndex !== null ? handleCancelEdit : undefined}
              onEditPreviousRound={gameState.rounds.length > 0 && editingRoundIndex === null ? handleEditPreviousRound : undefined}
            />

            {gameState.rounds.length > 0 && (
              <div style={{ marginTop: '28px' }}>
                <Scoreboard
                  players={gameState.players}
                  rounds={gameState.rounds}
                  onEditRound={handleEditRound}
                />
              </div>
            )}
          </>
        )}

        {gameState.phase === 'finished' && (
          <>
            <GameResult
              players={gameState.players}
              rounds={gameState.rounds}
              onNewGame={handleResetGame}
            />

            <div style={{ marginTop: '28px' }}>
              <Scoreboard
                players={gameState.players}
                rounds={gameState.rounds}
                onEditRound={handleEditRound}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
