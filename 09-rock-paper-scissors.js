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
