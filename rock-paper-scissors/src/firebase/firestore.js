import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  setDoc
} from 'firebase/firestore';
import { db } from './config';

// Create or update player data
export const createPlayer = async (userId, playerData) => {
  try {
    const playerRef = doc(db, 'players', userId);
    await setDoc(playerRef, {
      ...playerData,
      createdAt: new Date(),
      lastActive: new Date(),
    });
    console.log('Player created with ID: ', userId);
    return userId;
  } catch (error) {
    console.error('Error creating player: ', error);
    throw error;
  }
};

// Get player data
export const getPlayer = async (userId) => {
  try {
    const playerRef = doc(db, 'players', userId);
    const playerSnap = await getDoc(playerRef);
    
    if (playerSnap.exists()) {
      return playerSnap.data();
    } else {
      console.log('No player data found');
      return null;
    }
  } catch (error) {
    console.error('Error getting player data: ', error);
    throw error;
  }
};

// Update player's last active time
export const updatePlayerActivity = async (userId) => {
  try {
    const playerRef = doc(db, 'players', userId);
    await updateDoc(playerRef, {
      lastActive: new Date(),
    });
  } catch (error) {
    console.error('Error updating player activity: ', error);
    throw error;
  }
};

// Save game result to Firestore
export const saveGameResult = async (gameData) => {
  try {
    const docRef = await addDoc(collection(db, 'games'), {
      ...gameData,
      timestamp: new Date(),
    });
    console.log('Game saved with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding game: ', error);
    throw error;
  }
};

// Save or update user score
export const saveUserScore = async (userId, scoreData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...scoreData,
      lastUpdated: new Date(),
    });
    console.log('User score updated');
  } catch (error) {
    console.error('Error updating score: ', error);
    throw error;
  }
};

// Get user score
export const getUserScore = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log('No user data found');
      return null;
    }
  } catch (error) {
    console.error('Error getting user score: ', error);
    throw error;
  }
};

// Get top scores (leaderboard)
export const getTopScores = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'users'), 
      orderBy('wins', 'desc'), 
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const topScores = [];
    
    querySnapshot.forEach((doc) => {
      topScores.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return topScores;
  } catch (error) {
    console.error('Error getting top scores: ', error);
    throw error;
  }
};

// Get recent games
export const getRecentGames = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'games'), 
      orderBy('timestamp', 'desc'), 
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const recentGames = [];
    
    querySnapshot.forEach((doc) => {
      recentGames.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return recentGames;
  } catch (error) {
    console.error('Error getting recent games: ', error);
    throw error;
  }
};

// Create or join a multiplayer game
export const createMultiplayerGame = async (gameId, playerData) => {
  try {
    const gameRef = doc(db, 'multiplayerGames', gameId);
    const gameSnap = await getDoc(gameRef);
    
    if (gameSnap.exists()) {
      // Game exists, add player move
      const gameData = gameSnap.data();
      const updatedGame = {
        ...gameData,
        [`${playerData.playerId}Move`]: playerData.move,
        [`${playerData.playerId}Timestamp`]: new Date(),
        lastUpdated: new Date(),
      };
      
      await updateDoc(gameRef, updatedGame);
      return updatedGame;
    } else {
      // Create new game
      const newGame = {
        gameId: gameId,
        [`${playerData.playerId}Move`]: playerData.move,
        [`${playerData.playerId}Timestamp`]: new Date(),
        createdAt: new Date(),
        lastUpdated: new Date(),
        status: 'waiting'
      };
      
      await setDoc(gameRef, newGame);
      return newGame;
    }
  } catch (error) {
    console.error('Error creating/updating multiplayer game: ', error);
    throw error;
  }
};

// Get multiplayer game data
export const getMultiplayerGame = async (gameId) => {
  try {
    const gameRef = doc(db, 'multiplayerGames', gameId);
    const gameSnap = await getDoc(gameRef);
    
    if (gameSnap.exists()) {
      const gameData = gameSnap.data();
      return gameData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting multiplayer game: ', error);
    throw error;
  }
};

// Update multiplayer game score
export const updateMultiplayerScore = async (gameId, result) => {
  try {
    const gameRef = doc(db, 'multiplayerGames', gameId);
    const gameSnap = await getDoc(gameRef);
    
    if (gameSnap.exists()) {
      const gameData = gameSnap.data();
      const currentScore = {
        player1Wins: gameData.player1Wins || 0,
        player2Wins: gameData.player2Wins || 0,
        draws: gameData.draws || 0
      };
      
      // Update score based on result
      if (result === 'player1') {
        currentScore.player1Wins += 1;
      } else if (result === 'player2') {
        currentScore.player2Wins += 1;
      } else if (result === 'draw') {
        currentScore.draws += 1;
      }
      
      // Reset moves for new round and update score
      await updateDoc(gameRef, {
        ...currentScore,
        player1Move: null,
        player2Move: null,
        player1Timestamp: null,
        player2Timestamp: null,
        lastUpdated: new Date(),
        roundNumber: (gameData.roundNumber || 0) + 1
      });
      
      return currentScore;
    }
  } catch (error) {
    console.error('Error updating multiplayer score: ', error);
    throw error;
  }
};

// Get multiplayer game score
export const getMultiplayerScore = async (gameId) => {
  try {
    const gameRef = doc(db, 'multiplayerGames', gameId);
    const gameSnap = await getDoc(gameRef);
    
    if (gameSnap.exists()) {
      const gameData = gameSnap.data();
      return {
        player1Wins: gameData.player1Wins || 0,
        player2Wins: gameData.player2Wins || 0,
        draws: gameData.draws || 0,
        roundNumber: gameData.roundNumber || 0
      };
    } else {
      return {
        player1Wins: 0,
        player2Wins: 0,
        draws: 0,
        roundNumber: 0
      };
    }
  } catch (error) {
    console.error('Error getting multiplayer score: ', error);
    throw error;
  }
};
