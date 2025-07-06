import React from 'react';
import '../style/ScoreBoard.css';

export default function ScoreBoard({ score, resetScore }) {
  return (
    <div className="scoreboard">
      <div className="score-container">
        <div className="score-item wins">
          <span className="score-label">Wins</span>
          <span className="score-value">{score.wins}</span>
        </div>
        <div className="score-item losses">
          <span className="score-label">Losses</span>
          <span className="score-value">{score.losses}</span>
        </div>
        <div className="score-item ties">
          <span className="score-label">Ties</span>
          <span className="score-value">{score.ties}</span>
        </div>
      </div>
      <button className="reset-button" onClick={resetScore}>
        Reset Game
      </button>
    </div>
  );
}
