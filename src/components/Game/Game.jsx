import React from 'react';
import GameCanvas from '../GameCanvas/GameCanvas';
import { soundManager } from '../../utils/soundManager';
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

      <div className="game-play-area">
        <div className="game-container">
            <GameCanvas />
        </div>
        <div className="game-instructions">
            <h2>Instructions</h2>
            <ul>
            <li><strong>Q</strong> – Fire Element <span style={{ color: 'red' }}>(Red)</span></li>
            <li><strong>W</strong> – Water Element <span style={{ color: 'lightblue' }}>(Blue)</span></li>
            <li><strong>E</strong> – Earth Element <span style={{ color: '#a0522d' }}>(Brown)</span></li>
            <li><strong>R</strong> – Air Element <span style={{ color: 'white' }}>(White)</span></li>
            <li>Move the mouse to rotate the shield</li>
            </ul>
        </div>
      </div>
      {/* <div className="game-controls">
        <p><strong>Controls:</strong> Move your mouse to aim the shield and protect the orb from incoming projectiles</p>
        <p>Survive as long as possible as waves become increasingly intense</p>
      </div> */}

      {/* Another Ad Space */}
      <div className="ad-space">Advertisement Space - 728x90</div>
    </div>
  );
};

export default Game;