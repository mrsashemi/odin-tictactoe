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
        ticTacToe.drawGame();
        return (symbol == 'X') ? changeSymbol('O') : changeSymbol('X');
    }

    // reveal
    return {changeSymbol}
})();



// Use a factory function to create player 1 and 2 objects
const players = function(user, marker, result) {
    return {
        user,
        marker,
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
    let buttons = document.querySelector('.buttons')
    let xButton = document.querySelector('.xButton')
    let oButton = document.querySelector('.oButton')

    // bind event listener to buttons
    xButton.addEventListener('click', symbolXSelect);
    oButton.addEventListener('click', symbolOSelect);

    // Depending on which button is selected, assign player 1 and 2 to a player array
    let player = [];

    function symbolXSelect() { 
       buttons.style.display = 'none'
       gameBoard.changeSymbol('X')
       let p = [players("P1", "X", ""), players("P2", "O", "")]
       player.push(...p);
    }

    function symbolOSelect() {
        buttons.style.display = 'none'
        gameBoard.changeSymbol('O')
        let p = [players("P1", "O", ""), players("P2", "X", "")]
       player.push(...p);
    }

    // create an array from the dynamically created ticTacSquares
    let xoArray = [...ticTacSquare];

    // iterate through the winning combinations array and compare against the xoArray to find the winner
    function findWinner() {
        ticTacToe.forEach(win => {
            if (xoArray[win[0]].textContent == player[0].marker && xoArray[win[1]].textContent == player[0].marker && xoArray[win[2]].textContent == player[0].marker) {
                console.log("player 1 wins")
                player[0].result = "winner"
            } else if (xoArray[win[0]].textContent == player[1].marker && xoArray[win[1]].textContent == player[1].marker && xoArray[win[2]].textContent == player[1].marker) {
                console.log("player 2 wins")
                player[1].result = "winner"
            }
        })
    }

    // use another function in the case of a draw
    function drawGame() {
        xoArray.every(e => {
            return (e.style.color == 'black') ? console.log("draw") : console.log("oops");
        })
    }


    // reveal 
    return {findWinner, drawGame, xoArray}
})();
