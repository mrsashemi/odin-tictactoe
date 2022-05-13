// Use a revealing module pattern to create the gameboard, X 0 Symbols, and a CPU
const gameBoard = (function() {

    // create an array to represent the 3x3 grid
    const gameBoard = [
        '', '', '',
        '', '', '',
        '', '', ''
        ];
    
    // cache the dom and select the gameboard container
    board = document.querySelector('.gameBoard');
    

    // render tictactoe square divs from array and append to gameboard container
    function _render() {
        let i = 0; 

        gameBoard.forEach(e => {
            const ticTacSquare = document.createElement('div');
            ticTacSquare.className = `ticTacSquare square${i}`;
            this.board.appendChild(ticTacSquare);
            ticTacSquare.textContent = i;
            i++;
        });
    };

    _render();
    
    // bind event listener to container
    board.addEventListener('click', _addTicTacValue);

    //
    function nextMove() {
        let rando = Math.floor(Math.random()*10);

        if (rando < 7) {
            ai.bestMove(gameBoard)
        } else {
            ai.nextTurn(gameBoard)
        }
    }
    
    // use event delegation to add X or O to tic tac toe grid
    function _addTicTacValue(e) {
        const target = e.target;

        if(target.matches('div') && gameBoard[target.textContent] == '') {
            gameBoard[target.textContent] = ticTacToe.player[0].marker;
            target.textContent = ticTacToe.player[0].marker;
            target.style.color = 'black';


            let result = ticTacToe.findWinner(gameBoard);
            ticTacToe.showResult(result);
            //ai.nextTurn(gameBoard);
        }
    }
})();



// Use a factory function to create player 1 and 2 objects
const players = function(user, marker) {
    return {
        user,
        marker
    };
};



// Use a module to control the AI
const ai = (function() {
     
    // Use the minimax algorithm to find the optimal move. Start by creating a function that selects the optimal move
     function bestMove(board) {
        let bestScore = -Infinity;
        let move;

        for (let i = 0; i < 9; i++) {
            // Check to see if a board space is open and call minimax to find the best score
            if (board[i] == '') {
                board[i] = ticTacToe.player[1].marker;
                let score = minimax(board, 0, false);
                board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                };
            };
        };
        // Set ai marker
        let boardSpace = document.querySelector(`.square${move}`)

        board[move] = ticTacToe.player[1].marker;
        boardSpace.textContent = ticTacToe.player[1].marker;
        boardSpace.style.color = 'black';
    }

    // Base scoring off whether P1 selects X or O. Since the ai is maximizing, it will always have the positive score
    let scores;

    function setScores() {
        if (ticTacToe.player[0].marker == 'X') {
            scores = {'X': -10, 'O': 10, 'tie': 0}
        } else {
            scores = {'X': 10, 'O': -10, 'tie': 0}
        }
    }
    
    // Create minimax function
    function minimax(boardPos, depth, isMaximizing) {
        setScores();

        // find winning gameBoard set up for terminal condition
        let result = ticTacToe.findWinner(boardPos);
        if (result !== undefined) {
            return scores[result];
        }

        // Check all possible spots for both maximizing and minimizing players
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                // check if space is open
                if (boardPos[i] == '') {
                    boardPos[i] = ticTacToe.player[1].marker;
                    let score = minimax(boardPos, depth + 1, false);
                    boardPos[i] = ''
                    bestScore = Math.max(score,bestScore);
                };
            };
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                // check if space is open
                if (boardPos[i] == '') {
                    boardPos[i] = ticTacToe.player[0].marker;
                    let score = minimax(boardPos, depth + 1, true);
                    boardPos[i] = '';
                    bestScore = Math.min(score,bestScore);
                };
            };
            return bestScore;
        }
    }

    // Use a random move generator to create an easy OR different difficulties
    function nextTurn(board) {
        let available = [];

        // use a for loop to generate the available spaces 
        for (let i = 0; i < 9; i++) {
            if (board[i] == '') {
                available.push(i);
            };
        };

        // based on availability, cpu will randomly place an X or O
        let rando = Math.floor(Math.random()*available.length);
        let boardSpace = document.querySelector(`.square${available[rando]}`);

        if (available.length > 0) {
            board[available[rando]] = ticTacToe.player[1].marker;
            boardSpace.textContent = ticTacToe.player[1].marker;
            boardSpace.style.color = 'black';
        }
    }; 

    // reveal
    return {bestMove, nextTurn}
})();



// Use another module to control the game
const ticTacToe = (function() {

    // create an array containing winning combinations
    const ticTacToe = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // cache dom
    let board = document.querySelector('.gameBoard');
    let buttons = document.querySelector('.buttons');
    let xButton = document.querySelector('.xButton');
    let oButton = document.querySelector('.oButton');
    let results = document.querySelector('.results');

    // bind event listener to buttons
    xButton.addEventListener('click', _symbolXSelect);
    oButton.addEventListener('click', _symbolOSelect);

    // Depending on which button is selected, assign player 1 and 2 to a player array
    let player = [];

    function _symbolXSelect() { 
       buttons.style.display = 'none';
       board.style["pointer-events"] = 'all';

       // Create player object ad set to the turn of their next move
       let p = [players("P1", "X", 1), players("P2", "O")];
       player.push(...p);
    };

    function _symbolOSelect() {
        buttons.style.display = 'none';
        board.style["pointer-events"] = 'all';

        // Create player object ad set to the turn of their next move
        let p = [players("P1", "O", 1), players("P2", "X")];
        player.push(...p);
    };

    // Iterate through the winning combinations array and compare against the xoArray to find the winner
    function findWinner(arr) {
        let winner;

        // check to see if all spaces are filled for a draw
        let drawCheck = arr.every(e => {
            return (e == 'X' || e == 'O');
        })

        ticTacToe.forEach(win => {
            if (arr[win[0]] == player[0].marker && arr[win[1]] == player[0].marker && arr[win[2]] == player[0].marker) {
                winner = player[0].marker;
            } else if (arr[win[0]] == player[1].marker && arr[win[1]] == player[1].marker && arr[win[2]] == player[1].marker) {
                winner = player[1].marker;
            } else if (drawCheck && winner != player[0].marker && winner != player[1].marker) {
                winner = 'tie';
            }
        });

        return winner;
    };


    // display results
    function showResult(result) {
        if (result === player[0].marker) {
            results.textContent = "P1 Wins!";
        } else if (result === player[1].marker) {
            results.textContent = "P2 Wins!";
        } else if (result === 'tie') {
            results.textContent = "It's a Draw!";
        };
    };

    // reveal 
    return {findWinner, showResult, player};
})();
