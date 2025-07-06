import React from 'react';
import '../style/ChoiceButtons.css';
import rockImage from '../assets/images/rock.png';
import paperImage from '../assets/images/paper.jpg';
import scissorsImage from '../assets/images/scissors.png';

export default function ChoiceButtons({ playGame, disabled = false }) {
  return (
    <div className="choice-buttons">
      <div 
        className={`choice-item ${disabled ? 'disabled' : ''}`} 
        onClick={() => !disabled && playGame('Rock')}
      >
        <img src={rockImage} alt="Rock" className="choice-image" />
        <span className="choice-label">Rock</span>
      </div>
      <div 
        className={`choice-item ${disabled ? 'disabled' : ''}`} 
        onClick={() => !disabled && playGame('Paper')}
      >
        <img src={paperImage} alt="Paper" className="choice-image" />
        <span className="choice-label">Paper</span>
      </div>
      <div 
        className={`choice-item ${disabled ? 'disabled' : ''}`} 
        onClick={() => !disabled && playGame('Scissors')}
      >
        <img src={scissorsImage} alt="Scissors" className="choice-image" />
        <span className="choice-label">Scissors</span>
      </div>
    </div>
  );
}
