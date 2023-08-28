
const score = {
    wins: 0,
    losses: 0,
    ties: 0,
};

function pickComputerMove() {
    const randomNumber = Math.random();

    let computerMove = '';

    if (randomNumber >= 0  && randomNumber < 1 / 3) {
        computerMove = 'Rock';
    }
    else if (randomNumber >= 1/3  && randomNumber < 2 / 3) {
        computerMove = 'Paper';
    }
    if (randomNumber >= 2/3  && randomNumber < 1) {
        computerMove = 'Scissors';
    }

    return computerMove;
}

function playGame(playerMove) {
    const computerMove = pickComputerMove();

    let result = '';

    if (playerMove == 'Rock') {
        if (computerMove == 'Rock') {
            result = 'Tie';
        }
        else if (computerMove == 'Paper') {
            result = 'YOU LOSSE';
        }
    
        else{
            result = 'YOU WIN';
        } 

    }

    else if (playerMove == 'Paper') {
        const computerMove = pickComputerMove();

        if (computerMove == 'Rock') {
            result = 'YOU WIN';
        }
        else if (computerMove == 'Paper') {
            result = 'Tie';
        }

        else{
            result = 'YOU LOSSE';
        }
    }

    else{
        const computerMove = pickComputerMove();

        if (computerMove == 'Rock') {
            result = 'YOU LOSSE';
        }
        else if (computerMove == 'Paper') {
            result = 'YOU WIN';
        }

        else{
            result = 'Tie';
        }
    }

    if (result === 'YOU WIN') {
        score.wins += 1;
    }

    else if (result === 'YOU LOSSE') {
        score.losses += 1;
    }

    else{
        score.ties += 1;
    }

    alert(`YOU picked ${playerMove}. Computer picked ${computerMove}. ${result}
Wins: ${score.wins}, losses: ${score.losses}, ties: ${score.ties}`);
}

function resetScroe() {
    score.wins = 0;
    score.losses = 0;
    score.ties = 0;
}