import React from 'react';
import '../style/GameResult.css';

export default function GameResult({ moves, result }) {
  return (
    <div className="game-result">
      {moves && <p className="moves-text">{moves}</p>}
      {result && <p className={`result-text ${result.toLowerCase().replace(' ', '-')}`}>{result}</p>}
    </div>
  );
}
