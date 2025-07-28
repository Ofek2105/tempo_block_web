import React from 'react';
import GameCanvas from '../GameCanvas/GameCanvas';

import GameOver from '../GameOver/GameOver';
import './Game.css';


const Game = () => {
  return (
    <div className="game-wrapper">
      <div className="game-header">
        <h1 className="game-title">ORB DEFENDER</h1>
        <p className="game-subtitle">Protect the core at all costs</p>
      </div>

      {/* Ad Space */}
      <div className="ad-space">Advertisement Space - 728x90</div>

      <div className="game-container">
        <GameCanvas />
        <GameOver />
      </div>

      <div className="game-controls">
        <p><strong>Controls:</strong> Move your mouse to aim the shield and protect the orb from incoming projectiles</p>
        <p>Survive as long as possible as waves become increasingly intense</p>
      </div>

      {/* Another Ad Space */}
      <div className="ad-space">Advertisement Space - 728x90</div>
    </div>
  );
};

export default Game;