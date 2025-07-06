import React from 'react';
import '../style/MultiplayerScoreBoard.css';

export default function MultiplayerScoreBoard({ score }) {
  return (
    <div className="multiplayer-scoreboard">
      <div className="score-container">
        <div className="score-item player1-wins">
          <span className="score-label">Player 1 Wins</span>
          <span className="score-value">{score.player1Wins}</span>
        </div>
        <div className="score-item draws">
          <span className="score-label">Draws</span>
          <span className="score-value">{score.draws}</span>
        </div>
        <div className="score-item player2-wins">
          <span className="score-label">Player 2 Wins</span>
          <span className="score-value">{score.player2Wins}</span>
        </div>
      </div>
    </div>
  );
}
