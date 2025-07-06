import React, { useState, useEffect } from 'react';
import ChoiceButtons from './ChoiceButtons';
import GameResult from './GameResult';
import ScoreBoard from './ScoreBoard';
import MultiplayerScoreBoard from './MultiplayerScoreBoard';
import OpeningScreen from './OpeningScreen';
import '../style/AppGame.css';
import { saveGameResult, saveUserScore, getUserScore, updatePlayerActivity, createPlayer, createMultiplayerGame, getMultiplayerGame, updateMultiplayerScore, getMultiplayerScore } from '../firebase/firestore';

export default function AppGame() {
  const [score, setScore] = useState({ wins: 0, losses: 0, ties: 0 });
  const [result, setResult] = useState('');
  const [moves, setMoves] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [gameMode, setGameMode] = useState(null); // 'vsPC', 'player1', 'player2'
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [multiplayerScore, setMultiplayerScore] = useState({ player1Wins: 0, player2Wins: 0, draws: 0 });
  const [pollInterval, setPollInterval] = useState(null);

  const options = ['Rock', 'Paper', 'Scissors'];

  const handlePlayerSelect = async (selectedMode) => {
    try {
      let newPlayerData;
      
      if (selectedMode === 'vsPC') {
        // Generate unique user ID for PC mode
        const userId = 'user_' + Math.random().toString(36).substr(2, 9);
        newPlayerData = {
          userId: userId,
          playerNumber: 1,
          gameMode: 'vsPC',
          wins: 0,
          losses: 0,
          ties: 0
        };
        await createPlayer(userId, newPlayerData);
      } else if (selectedMode === 'player1') {
        newPlayerData = {
          userId: 'player1_fixed_id',
          playerNumber: 1,
          playerId: 'player1',
          gameMode: 'multiplayer',
          wins: 0,
          losses: 0,
          ties: 0
        };
      } else if (selectedMode === 'player2') {
        newPlayerData = {
          userId: 'player2_fixed_id',
          playerNumber: 2,
          playerId: 'player2',
          gameMode: 'multiplayer',
          wins: 0,
          losses: 0,
          ties: 0
        };
      }
      
      // Update local state
      setPlayerData(newPlayerData);
      setGameMode(selectedMode);
      setGameStarted(true);
      
      console.log(`${selectedMode} selected with data:`, newPlayerData);
    } catch (error) {
      console.error('Error selecting game mode:', error);
    }
  };

  // Load user score on component mount
  useEffect(() => {
    if (playerData && gameStarted && gameMode === 'vsPC') {
      loadUserScore();
      // Update player activity
      updatePlayerActivity(playerData.userId);
    } else if (playerData && gameStarted && gameMode !== 'vsPC') {
      // Load multiplayer score
      loadMultiplayerScore();
    }
  }, [playerData, gameStarted, gameMode]);

  const loadMultiplayerScore = async () => {
    try {
      const gameId = 'multiplayer_game_1';
      const score = await getMultiplayerScore(gameId);
      setMultiplayerScore(score);
    } catch (error) {
      console.error('Error loading multiplayer score:', error);
    }
  };

  const loadUserScore = async () => {
    try {
      setIsLoading(true);
      const userData = await getUserScore(playerData.userId);
      if (userData) {
        setScore({
          wins: userData.wins || 0,
          losses: userData.losses || 0,
          ties: userData.ties || 0
        });
      } else {
        // Use initial player data if no saved score
        setScore({
          wins: playerData.wins || 0,
          losses: playerData.losses || 0,
          ties: playerData.ties || 0
        });
      }
    } catch (error) {
      console.error('Error loading user score:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickComputerMove = () => {
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  };

  const playGame = async (playerMove) => {
    if (gameMode === 'vsPC') {
      // Original PC game logic
      const computerMove = pickComputerMove();
      let gameResult = '';
      let newScore = { ...score };

      if (playerMove === computerMove) {
        gameResult = 'Tie';
        newScore.ties += 1;
      } else if (
        (playerMove === 'Rock' && computerMove === 'Scissors') ||
        (playerMove === 'Paper' && computerMove === 'Rock') ||
        (playerMove === 'Scissors' && computerMove === 'Paper')
      ) {
        gameResult = 'YOU WIN';
        newScore.wins += 1;
      } else {
        gameResult = 'YOU LOSE';
        newScore.losses += 1;
      }

      // Update local state
      setScore(newScore);
      setMoves(`You picked ${playerMove}, Computer picked ${computerMove}`);
      setResult(gameResult);

      // Save to Firestore
      try {
        await saveGameResult({
          playerMove,
          computerMove,
          result: gameResult,
          userId: playerData.userId,
          playerNumber: playerData.playerNumber
        });
        await saveUserScore(playerData.userId, newScore);
      } catch (error) {
        console.error('Error saving game data:', error);
      }
    } else {
      // Multiplayer logic
      try {
        setWaitingForOpponent(true);
        const gameId = 'multiplayer_game_1';
        
        // Save player's move
        const gameData = await createMultiplayerGame(gameId, {
          playerId: playerData.playerId,
          move: playerMove
        });
        
        // Check if both players have made moves immediately
        if (gameData.player1Move && gameData.player2Move) {
          // Both players have moved, show result immediately
          setMoves(`You picked ${playerMove}, calculating result...`);
          await handleGameResult(gameId, playerMove, gameData);
        } else {
          // Only one player has moved, wait for opponent
          setMoves(`You picked ${playerMove}, waiting for opponent...`);
          setResult('Waiting for opponent...');
          
          // Start polling for opponent's move
          startPolling(gameId, playerMove);
        }
        
      } catch (error) {
        console.error('Error in multiplayer game:', error);
        setWaitingForOpponent(false);
        setResult('Error occurred. Please try again.');
      }
    }
  };

  const startPolling = (gameId, playerMove) => {
    // Clear any existing polling interval
    if (pollInterval) {
      clearInterval(pollInterval);
    }

    const newPollInterval = setInterval(async () => {
      try {
        const updatedGame = await getMultiplayerGame(gameId);
        
        // Check if both players have made their moves
        if (updatedGame && updatedGame.player1Move && updatedGame.player2Move) {
          // Clear the interval immediately
          clearInterval(newPollInterval);
          setPollInterval(null);
          
          // Process the game result
          await handleGameResult(gameId, playerMove, updatedGame);
        }
      } catch (error) {
        console.error('Error polling for opponent:', error);
        clearInterval(newPollInterval);
        setPollInterval(null);
        setWaitingForOpponent(false);
        setResult('Error occurred. Please try again.');
      }
    }, 500); // Poll every 500ms for faster response

    setPollInterval(newPollInterval);
  };

  const handleGameResult = async (gameId, playerMove, gameData) => {
    try {
      const player1Move = gameData.player1Move;
      const player2Move = gameData.player2Move;
      
      let gameResult = '';
      let scoreResult = '';
      
      // Determine the winner
      if (player1Move === player2Move) {
        gameResult = 'Tie';
        scoreResult = 'draw';
      } else if (
        (player1Move === 'Rock' && player2Move === 'Scissors') ||
        (player1Move === 'Paper' && player2Move === 'Rock') ||
        (player1Move === 'Scissors' && player2Move === 'Paper')
      ) {
        gameResult = playerData.playerId === 'player1' ? 'YOU WIN' : 'YOU LOSE';
        scoreResult = 'player1';
      } else {
        gameResult = playerData.playerId === 'player1' ? 'YOU LOSE' : 'YOU WIN';
        scoreResult = 'player2';
      }
      
      const opponentMove = playerData.playerId === 'player1' ? player2Move : player1Move;
      
      // Update UI state immediately
      setMoves(`You: ${playerMove}, Opponent: ${opponentMove}`);
      setResult(gameResult);
      setWaitingForOpponent(false);
      
      // Update score in Firestore
      const updatedScore = await updateMultiplayerScore(gameId, scoreResult);
      setMultiplayerScore(updatedScore);
      
      // Auto-start new round after 2 seconds
      setTimeout(() => {
        setResult('');
        setMoves('');
        setWaitingForOpponent(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error handling game result:', error);
      setWaitingForOpponent(false);
      setResult('Error processing result. Please try again.');
    }
  };

  const resetScore = async () => {
    // Clear any existing polling interval
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }

    if (gameMode === 'vsPC') {
      const resetScoreData = { wins: 0, losses: 0, ties: 0 };
      setScore(resetScoreData);
      setResult('');
      setMoves('');

      // Update Firestore
      try {
        await saveUserScore(playerData.userId, resetScoreData);
      } catch (error) {
        console.error('Error resetting score:', error);
      }
    } else {
      // For multiplayer, reset the current round and ensure buttons are enabled
      setResult('');
      setMoves('');
      setWaitingForOpponent(false);
    }
  };

  // Cleanup polling interval on component unmount
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);

  if (!gameStarted) {
    return <OpeningScreen onPlayerSelect={handlePlayerSelect} />;
  }

  return (
    <div className="app-game">
      <div className="game-container">
        <h1 className="game-title">🎮 Rock Paper Scissors 🎮</h1>
        <p className="game-subtitle">Choose your weapon!</p>
        <div className="player-info">
          <span className="player-badge">
            {gameMode === 'vsPC' ? 'VS Computer' : `Player ${playerData?.playerNumber}`}
          </span>
          {gameMode !== 'vsPC' && (
            <span className="game-mode-badge">Multiplayer Mode</span>
          )}
        </div>
        {isLoading ? (
          <p>Loading your score...</p>
        ) : (
          <>
            <ChoiceButtons playGame={playGame} disabled={waitingForOpponent} />
            <GameResult moves={moves} result={result} />
            {gameMode === 'vsPC' ? (
              <ScoreBoard score={score} resetScore={resetScore} />
            ) : (
              <MultiplayerScoreBoard score={multiplayerScore} />
            )}
            <p className="user-id">User ID: {playerData?.userId}</p>
          </>
        )}
      </div>
    </div>
  );
}
