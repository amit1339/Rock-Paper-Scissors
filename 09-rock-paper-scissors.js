const score = {
    wins: 0,
    losses: 0,
    ties: 0,
};

const moves = ["Rock", "Paper", "Scissors"];

// Helper function to pick a random move for the computer
function pickComputerMove() {
    const randomIndex = Math.floor(Math.random() * moves.length);
    return moves[randomIndex];
}

// Event listeners for button clicks
document.getElementById("rock-button").addEventListener("click", () => playGame("Rock"));
document.getElementById("paper-button").addEventListener("click", () => playGame("Paper"));
document.getElementById("scissors-button").addEventListener("click", () => playGame("Scissors"));
document.getElementById("reset-button").addEventListener("click", resetScore);

function playGame(playerMove) {
    const computerMove = pickComputerMove();

    let result = "";

    if (playerMove === computerMove) {
        result = "Tie";
    } else if (
        (playerMove === "Rock" && computerMove === "Scissors") ||
        (playerMove === "Paper" && computerMove === "Rock") ||
        (playerMove === "Scissors" && computerMove === "Paper")
    ) {
        result = "YOU WIN";
        score.wins += 1;
    } else {
        result = "YOU LOSE";
        score.losses += 1;
    }

    updateMove(playerMove, computerMove);
    updateScore();
    updateResult(result);
}

function resetScore() {
    score.wins = 0;
    score.losses = 0;
    score.ties = 0;
    updateScore();
}

function updateMove(playerMove, computerMove) {
    document.querySelector(".js-moves").textContent = `YOU picked ${playerMove} - Computer picked ${computerMove}.`;
}

function updateResult(result) {
    document.querySelector(".js-result").textContent = result;
}

function updateScore() {
    document.querySelector(".js-score").textContent = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

function MakeCounter() {
    let count = 0;
    return {
        increment: () => {
            count += 1;
            console.log(`Count: ${count}`);
        }
    }
}

function factorial(n) {
    let result = n;
    while (n > 1) {
        result *= n - 1;
        n -= 1;
    }
    return result;
}

function isAnagram(s, t) {
    if (s.length !== t.length) {
        return false;
    }
    let charCount = new Map();
    for (let char of s) {
        charCount.set(char, (charCount.get(char) || 0) + 1);
    }
    for (let char of t) {
        if (!charCount.has(char) || charCount.get(char) === 0) {
            return false;
        }
        charCount.set(char, charCount.get(char) - 1);
    }
    return true;
    
}

function topKFrequent(nums,k)
{
    let charCount = new Map();
    for (let num of nums) {
        charCount.set(num, (charCount.get(num) || 0) + 1);
    }
    charCount = new Map([...charCount.entries()].sort((a, b) => b[1] - a[1]));
    return Array.from(charCount.keys()).slice(0, k);
}


console.log(isAnagram("anagram", "nagaram")); // Output: true
console.log(isAnagram("rat", "car")); // Output: false
console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2)); // Output: [1, 2]