

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
        alert(`YOU picked ${playerMove}. Computer picked ${computerMove}. ${result}`);
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

        alert(`YOU picked Paper. Computer picked ${computerMove}. ${result}`);
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

        alert(`YOU picked Scissors. Computer picked ${computerMove}. ${result}`);
    }
}