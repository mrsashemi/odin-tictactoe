// Use a revealing module pattern to create the gameboard
const gameBoard = (function() {
    // create an array to represent the 3x3 grid
    const gameBoard = [
            {id: 0, val: ""},
            {id: 1, val: ""},
            {id: 2, val: ""},
            {id: 3, val: ""},
            {id: 4, val: ""},
            {id: 5, val: ""},
            {id: 6, val: ""},
            {id: 7, val: ""},
            {id: 8, val: ""},
        ]
    
    // cache the dom and select the gameboard container
    board = document.querySelector('.gameBoard');

    // render tictactoe square divs from array and append to gameboard container
    function render() {
        gameBoard.forEach(e => {
            const ticTacSquare = document.createElement('div');
            ticTacSquare.className = `ticTacSquare square${e.id}`;
            this.board.appendChild(ticTacSquare);
            ticTacSquare.textContent = e.id;
        })
    }

    render();
    
    // bind event listener to container
    board.addEventListener('click', addTicTacValue);

    // declare a symbol(X or O) and a function to modify the symbol
    let symbol = '';

    function changeSymbol(val) {
        return symbol = val;
    }
    
    // use event delegation to add X or O to tic tac toe grid
    function addTicTacValue(e) {
        const target = e.target;

        if(target.matches('div')) {
            gameBoard[target.textContent].val = symbol;
            target.textContent = symbol;
            target.style.color = 'black';
        }
        ticTacToe.findWinner();
        ticTacToe.showResult();
        return (symbol == 'X') ? changeSymbol('O') : changeSymbol('X');
    }

    // reveal
    return {changeSymbol}
})();



// Use a factory function to create player 1 and 2 objects
const players = function(user, marker, turn, result) {
    return {
        user,
        marker,
        turn,
        result
    }
}



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
    ]

    // cache dom
    let ticTacSquare = document.querySelectorAll('.ticTacSquare')
    let board = document.querySelector('.gameBoard');
    let buttons = document.querySelector('.buttons')
    let xButton = document.querySelector('.xButton')
    let oButton = document.querySelector('.oButton')
    let showTurn = document.querySelector('.turn')
    let results = document.querySelector('.results')

    // create an array from the dynamically created ticTacSquares
    let xoArray = [...ticTacSquare];

    // bind event listener to buttons
    xButton.addEventListener('click', symbolXSelect);
    oButton.addEventListener('click', symbolOSelect);
    board.addEventListener('click', turnCount);

    // Depending on which button is selected, assign player 1 and 2 to a player array
    let player = [];

    function symbolXSelect() { 
       buttons.style.display = 'none'
       board.style["pointer-events"] = 'all'
       gameBoard.changeSymbol('X')
       // Set player turn to the turn of their next move
       let p = [players("P1", "X", 1, ""), players("P2", "O", 2, "")]
       player.push(...p);
    }

    function symbolOSelect() {
        buttons.style.display = 'none'
        board.style["pointer-events"] = 'all'
        gameBoard.changeSymbol('O')
        // Set player turn to the turn of their next move
        let p = [players("P1", "O", 1, ""), players("P2", "X", 2, "")]
       player.push(...p);
    }

    // Set player turn using event delegation
    function turnCount(e) {
        const target = e.target;
        // Player turn is set to the turn count of their next move, subtract by 1 to find the current turn
        if(target.matches('div') && target.textContent == player[0].marker ) {
            player[0].turn += 2
            showTurn.textContent = player[0].turn - 1
        } else if(target.matches('div') && target.textContent == player[1].marker ) {
            player[1].turn += 2
            showTurn.textContent = player[1].turn - 1
        }
    }


    // Create an AI if P2 is set to CPU
    let cpuMoveCount = [];

    function cpuMove() {
        for (let i = 0; i <= 8; i++) {
            let tile = xoArray[i].textContent;
            if (tile == "") {
                cpuMoveCount.push(i)
            }
        }
    }

    cpuMove();

    // iterate through the winning combinations array and compare against the xoArray to find the winner
    function findWinner() {
        ticTacToe.forEach(win => {
            if (xoArray[win[0]].textContent == player[0].marker && xoArray[win[1]].textContent == player[0].marker && xoArray[win[2]].textContent == player[0].marker) {
                player[0].result = "winner"
                showResult();
            } else if (xoArray[win[0]].textContent == player[1].marker && xoArray[win[1]].textContent == player[1].marker && xoArray[win[2]].textContent == player[1].marker) {
                player[1].result = "winner"
                showResult();
            }
        })
    }

    // display results
    function showResult() {
        if (player[0].result == "winner") {
            results.textContent = "P1 Wins!"
        } else if (player[1].result == "winner") {
            results.textContent = "P2 Wins!"
        } else if (player[1].turn == 10 && (player[0].result != "winner" && player[1].result != "winner")) {
            results.textContent = "It's a Draw!"
        }
    }

    // reveal 
    return {findWinner, showResult, cpuMoveCount}
})();
