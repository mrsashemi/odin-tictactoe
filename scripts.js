  ////////////////////////////////////////////////////////////
 // Use a revealing module pattern to create the gameboard //
////////////////////////////////////////////////////////////
const gameBoard = (function() {

    //// create an array to represent the 3x3 grid ////
    let gameBoard = [
        '', '', '',
        '', '', '',
        '', '', ''
        ];
    
    //// cache the dom ////
    let board = document.querySelector('.gameBoard');
    let gameResult = document.querySelector('.results')
    let modeSelect = document.querySelector('.modeSelect');
    let difficultySelect = document.querySelector('.difficultySelect')
    let markerSelect = document.querySelector('.markerSelect');
    let results = document.querySelector('.results');
    let reset = document.querySelector('.reset');

    //// render tictactoe square divs from array and append to gameboard container ////
    function _render() {
        let i = 0; 

        gameBoard.forEach(e => {
            const ticTacSquare = document.createElement('div');
            ticTacSquare.className = `ticTacSquare square${i}`;
            board.appendChild(ticTacSquare);
            ticTacSquare.textContent = i;
            i++;
        });
    };

    _render();
    
    //// bind event listener to container ////
    board.addEventListener('click', _addTicTacValue);
    reset.addEventListener('click', _resetGame);

    //// create a function to set the marker initially ////
    let marker;

    function setMarker() {
        marker = ticTacToe.player[0].marker;
    }

    //// use event delegation to add X or O to tic tac toe grid ////
    function _addTicTacValue(e) {
        const target = e.target;
        // check for winning result every move
        let result;

        if (target.matches('div') && gameBoard[target.textContent] == '') {
            gameBoard[target.textContent] = marker;
            target.textContent = marker;
            board.removeEventListener('click', _addTicTacValue);

            if (marker == ticTacToe.player[0].marker) {
                target.style.background = 'rgba(23, 153, 68, 0.25)';
                target.style.color = 'rgba(233, 227, 162, 0.65)';
                target.style['text-shadow'] = '0.15vmin 0.15vmin pink, -0.15vmin -0.15vmin maroon';
            } else if (marker == ticTacToe.player[1].marker) {
                target.style.background = 'rgba(167, 77, 77, 0.35)';
                target.style.color = 'rgba(233, 227, 162, 0.65)';
                target.style['text-shadow'] = '-0.15vmin -0.15vmin black, 0.15vmin 0.15vmin white';
            }

            result = ticTacToe.findWinner(gameBoard);
            ticTacToe.showResult(result);

            if (ticTacToe.player[1].type == 'ai' && gameResult.textContent == '') {
                // add delay to ai move for style
                setTimeout(() => {
                    ticTacToe.nextMove(gameBoard);
                    board.addEventListener('click', _addTicTacValue);
                }, 500);

            } else if (ticTacToe.player[1].type == 'human') {
                (marker == ticTacToe.player[0].marker) ? marker = ticTacToe.player[1].marker : marker = ticTacToe.player[0].marker;
                board.addEventListener('click', _addTicTacValue);
            }

            result = ticTacToe.findWinner(gameBoard);
            ticTacToe.showResult(result);
        }
    }

    //// reset the gameBoard ////
    function _resetGame() {
        while (board.firstChild) {
            board.removeChild(board.firstChild);
        }

        gameBoard = [
            '', '', '',
            '', '', '',
            '', '', ''
            ];

        modeSelect.style.display = 'block';
        difficultySelect.style.display = 'none';
        markerSelect.style.display = 'none';
        board.style["pointer-events"] = 'none';
        results.textContent = '';

        _render();
    }

    //// reveal ////
    return {setMarker};
})();


  /////////////////////////////////////////////////////////////
 // Use a factory function to create player 1 and 2 objects //
/////////////////////////////////////////////////////////////
const players = function(user, marker, type) {
    return {
        user,
        marker,
        type
    };
};


  ////////////////////////////////////
 // Use a module to control the AI //
////////////////////////////////////
const ai = (function() {
     
    //// Use the minimax algorithm to find the optimal move. Start by creating a function that selects the optimal move ////
    function bestMove(board) {
        let bestScore = -Infinity;
        let move;
        let result;

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
            } else {
                result = ticTacToe.findWinner(board);
                ticTacToe.showResult(result);
            }
        };
        // Set ai marker
        let boardSpace = document.querySelector(`.square${move}`)
        board[move] = ticTacToe.player[1].marker;
        boardSpace.textContent = ticTacToe.player[1].marker;
        boardSpace.style.background = 'rgba(167, 77, 77, 0.35)';
        boardSpace.style.color = 'rgba(233, 227, 162, 0.65)';
        boardSpace.style['text-shadow'] = '-0.15vmin -0.15vmin black, 0.15vmin 0.15vmin white';
        result = ticTacToe.findWinner(board);
        ticTacToe.showResult(result);
    }

    //// Base scoring off whether P1 selects X or O. Since the ai is maximizing, it will always have the positive score ////
    let scores;

    function setScores() {
        if (ticTacToe.player[0].marker == 'X') {
            scores = {'X': -10, 'O': 10, 'tie': 0}
        } else {
            scores = {'X': 10, 'O': -10, 'tie': 0}
        }
    }
    
    //// Create minimax function ////
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

    //// Use a random move generator to create an easy mode OR to introduce chance into different difficulties ////
    function nextTurn(board) {
        let result;
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
            boardSpace.style.background = 'rgba(167, 77, 77, 0.35)';
            boardSpace.style.color = 'rgba(233, 227, 162, 0.65)';
            boardSpace.style['text-shadow'] = '-0.15vmin -0.15vmin black, 0.15vmin 0.15vmin white';
        } else {
            result = ticTacToe.findWinner(board);
            ticTacToe.showResult(result);
        }
    }; 

    //// reveal ////
    return {bestMove, nextTurn}
})();


  ////////////////////////////////////////////
 // Use another module to control the game //
////////////////////////////////////////////
const ticTacToe = (function() {

    //// create an array containing winning combinations ////
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

    //// cache dom ////
    let board = document.querySelector('.gameBoard');
    let modeSelect = document.querySelector('.modeSelect');
    let playerVsPlayer = document.querySelector('.pvp');
    let playerVsComputer = document.querySelector('.pvc');
    let difficultySelect = document.querySelector('.difficultySelect')
    let easy = document.querySelector('.easy')
    let medium = document.querySelector('.medium')
    let hard = document.querySelector('.hard')
    let impossible = document.querySelector('.impossible')
    let markerSelect = document.querySelector('.markerSelect');
    let xButton = document.querySelector('.xButton');
    let oButton = document.querySelector('.oButton');
    let results = document.querySelector('.results');

    //// bind event listener to buttons ////
    playerVsComputer.addEventListener('click', _playerVsAi);
    playerVsPlayer.addEventListener('click', _playerVsP2);
    easy.addEventListener('click', _easyMode);
    medium.addEventListener('click', _mediumMode);
    hard.addEventListener('click', _hardMode);
    impossible.addEventListener('click', _impossibleMode);
    xButton.addEventListener('click', _symbolXSelect);
    oButton.addEventListener('click', _symbolOSelect);


    //// Set the gamemode depending on whether Player vs Player or Player vs Computer is Selected ////
    let player2;

    function _playerVsAi() {
        difficultySelect.style.display = 'block';
        modeSelect.style.display = 'none';

        player2 = 'ai';
    }

    function _playerVsP2() {
        markerSelect.style.display = 'block';
        modeSelect.style.display = 'none';

        player2 = 'human';
    }

    //// Set the difficulty if Player vs Computer ////
    let difficulty;

    function _easyMode() {
        difficultySelect.style.display = 'none';
        markerSelect.style.display = 'block';

        difficulty = 'easy';
    }

    function _mediumMode() {
        difficultySelect.style.display = 'none';
        markerSelect.style.display = 'block';

        difficulty = 'medium';
    }

    function _hardMode() {
        difficultySelect.style.display = 'none';
        markerSelect.style.display = 'block';

        difficulty = 'hard';
    }

    function _impossibleMode() {
        difficultySelect.style.display = 'none';
        markerSelect.style.display = 'block';

        difficulty = 'impossible';
    }

    //// Set the ai move based off the difficulty ////
    function nextMove(board) {
        let rando = Math.floor(Math.random()*10);

        if (difficulty == 'easy') {
            ai.nextTurn(board)
        } else if (difficulty == 'medium') {
            return (rando < 6) ? ai.nextTurn(board) : ai.bestMove(board);
        } else if (difficulty == 'hard') {
            return (rando < 8) ? ai.bestMove(board) : ai.nextTurn(board); 
        } else if (difficulty == 'impossible') {
            ai.bestMove(board)
        }
    }


    //// Depending on which button is selected, assign player 1 and 2 to a player array ////
    let player = [];

    function _symbolXSelect() { 
       markerSelect.style.display = 'none';
       board.style["pointer-events"] = 'all';

       // Create player object and set to the turn of their next move
       let p;

       if (player2 == 'human') {
           p = [players("P1", "X", "human"), players("P2", "O", "human")];
       } else if (player2 == 'ai') {
           p = [players("P1", "X", "human"), players("P2", "O", "ai")];
       }

       player.push(...p);
       gameBoard.setMarker();
    };

    function _symbolOSelect() {
        markerSelect.style.display = 'none';
        board.style["pointer-events"] = 'all';

        // Create player object and set to the turn of their next move
        let p;
        
        if (player2 == 'human') {
            p = [players("P1", "O", "human"), players("P2", "X", "human")];
        } else if (player2 == 'ai') {
            p = [players("P1", "O", "human"), players("P2", "X", "ai")];
        }
        
        player.push(...p);
        gameBoard.setMarker();
    };

    //// Iterate through the winning combinations array and compare against the xoArray to find the winner ////
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


    //// display results ////
    function showResult(result) {
        if (result === player[0].marker) {
            results.textContent = "P1 Wins!";
        } else if (result === player[1].marker) {
            results.textContent = "P2 Wins!";
        } else if (result === 'tie') {
            results.textContent = "It's a Draw!";
        };
    };

    //// reveal ////
    return {findWinner, showResult, nextMove, player};
})();
