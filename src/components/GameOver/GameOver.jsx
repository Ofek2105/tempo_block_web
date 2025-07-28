import React from 'react';
import { useGameLogic } from '../../hooks/useGameLogic';
import './GameOver.css';

const GameOver = () => {
  const { gameState, restartGame } = useGameLogic();

  if (!gameState.gameOver) {
    return null;
  }

  return (
    <div className="game-over-overlay">
      <div className="game-over-modal">
        <h2 className="game-over-title">CORE BREACHED</h2>
        <p className="game-over-stat">Final Score: <span className="stat-value">{gameState.score}</span></p>
        <p className="game-over-stat">Waves Survived: <span className="stat-value">{gameState.wave - 1}</span></p>
        <button className="restart-button" onClick={restartGame}>
          REINITIALIZE DEFENSES
        </button>
      </div>
    </div>
  );
};

export default GameOver;