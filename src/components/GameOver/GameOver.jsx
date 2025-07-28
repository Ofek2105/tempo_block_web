
import './GameOver.css';

const GameOver = ({ score, wave, onRestart }) => {
  return (
    <div className="game-over-overlay">
      <div className="game-over-modal">
        <h2 className="game-over-title">CORE BREACHED</h2>
        <p className="game-over-stat">Final Score: <span className="stat-value">{score}</span></p>
        <p className="game-over-stat">Waves Survived: <span className="stat-value">{wave - 1}</span></p>
        <button className="restart-button" onClick={onRestart}>
          REINITIALIZE DEFENSES
        </button>
      </div>
    </div>
  );
};

export default GameOver;