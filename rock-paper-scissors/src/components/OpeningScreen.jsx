import React, { useState } from 'react';
import '../style/OpeningScreen.css';

export default function OpeningScreen({ onPlayerSelect }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlayerSelect = async (playerNumber) => {
    setSelectedPlayer(playerNumber);
    setIsLoading(true);
    
    try {
      await onPlayerSelect(playerNumber);
    } catch (error) {
      console.error('Error selecting player:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="opening-screen">
      <div className="opening-container">
        <h1 className="opening-title">🎮 Rock Paper Scissors 🎮</h1>
        <h2 className="opening-subtitle">Welcome to the Game!</h2>
        <p className="opening-description">
          Choose your game mode to start playing
        </p>
        
        <div className="player-selection">
          <div 
            className={`player-card ${selectedPlayer === 'vsPC' ? 'selected' : ''}`}
            onClick={() => !isLoading && handlePlayerSelect('vsPC')}
          >
            <div className="player-icon">🤖</div>
            <h3>VS Computer</h3>
            <p>Play against the computer</p>
          </div>
          
          <div 
            className={`player-card ${selectedPlayer === 'player1' ? 'selected' : ''}`}
            onClick={() => !isLoading && handlePlayerSelect('player1')}
          >
            <div className="player-icon">👤</div>
            <h3>Player 1</h3>
            <p>Join as Player 1</p>
          </div>
          
          <div 
            className={`player-card ${selectedPlayer === 'player2' ? 'selected' : ''}`}
            onClick={() => !isLoading && handlePlayerSelect('player2')}
          >
            <div className="player-icon">👥</div>
            <h3>Player 2</h3>
            <p>Join as Player 2</p>
          </div>
        </div>
        
        {isLoading && (
          <div className="loading-message">
            <p>Setting up your game...</p>
          </div>
        )}
      </div>
    </div>
  );
}
