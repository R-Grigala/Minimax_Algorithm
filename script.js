// Initialize the original game board, human player ('O'), AI player ('X'), and winning combinations.
let origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

// Select all cells in the game board
const cells = document.querySelectorAll('.cell');

// Start the game by initializing the board and adding click event listeners to cells
startGame();

function startGame() {
    // Hide the endgame message
    document.querySelector(".endgame").style.display = "none";

    // Create an array to represent the original game board with empty cells
    origBoard = Array.from(Array(9).keys());

    // Reset each cell's content and background color, and add click event listeners
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.removeProperty('background-color');
        cell.addEventListener('click', turnClick, false);
    });
}

// Handle the player's move when a cell is clicked
function turnClick(square) {
    if (typeof origBoard[square.target.id] == 'number') {
        // If the clicked cell is empty, make the human player's move
        turn(square.target.id, huPlayer);

        // Check for a tie, and if the game is not tied, make the AI's move
        if (!checkTie()) turn(bestSpot(), aiPlayer);
    }
}

// Make a move on the board
function turn(squareId, player) {
    // Update the board and display the player's symbol in the clicked cell
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;

    // Check if the current move results in a win
    let gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
}

// Check if a player has won
function checkWin(board, player) {
    // Find the indices of the cells played by the current player
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    
    // Check if any winning combination is satisfied
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

// Handle the end of the game
function gameOver(gameWon) {
    // Highlight the winning combination cells
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? "blue" : "red";
    }

    // Remove click event listeners from cells
    cells.forEach(cell => cell.removeEventListener('click', turnClick, false));

    // Display the winner message
    declareWinner(gameWon.player == huPlayer ? "You Win!" : "You Lose!");
}

// Display the endgame message
function declareWinner(who) {
    document.querySelector(".endgame").style.display = "flex";
    document.querySelector(".endgame .text").innerText = who;
}

// Find the first available empty cell for the AI's move
function bestSpot() {
    return minimax(origBoard, aiPlayer).index;
}

// Find all empty cells on the board
function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

// Check if the game is tied
function checkTie() {
    if (emptySquares().length == 0) {
        // If all cells are filled and no winner, declare a tie
        cells.forEach(cell => {
            cell.style.backgroundColor = "green";
            cell.removeEventListener('click', turnClick, false);
        });
        declareWinner("It's a Tie!");
        return true;
    }
    return false;
}

// The minimax algorithm for AI decision-making with alpha-beta pruning
function minimax(newBoard, player, depth = 0, alpha = -Infinity, beta = Infinity) {
    var availSpots = emptySquares(newBoard);

    // Base cases: check for win, loss, or tie
    if (checkWin(newBoard, huPlayer)) {
        return { score: -10 + depth };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 - depth };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    // Recursively evaluate possible moves and their scores
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        // Recursively calculate score for the opponent's move
        var result;
        if (player === aiPlayer) {
            result = minimax(newBoard, huPlayer, depth + 1, alpha, beta);
            move.score = result.score;
            alpha = Math.max(alpha, result.score);
        } else {
            result = minimax(newBoard, aiPlayer, depth + 1, alpha, beta);
            move.score = result.score;
            beta = Math.min(beta, result.score);
        }

        // Undo the move to explore other possibilities
        newBoard[availSpots[i]] = move.index;

        // Store the move and its score
        moves.push(move);

        // Alpha-beta pruning
        if (alpha >= beta) {
            break;
        }
    }

    // Choose the best move based on the player
    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -Infinity;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = Infinity;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}
