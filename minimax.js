function isWinner(board, player) {
    for (let i = 0; i < rows; i++) {
        if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
            return true;
        }
        if (board[0][i] === player && board[1][i] === player && board[2][i] === player) {
            return true;
        }
    }

    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
        return true;
    }
    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
        return true;
    }

    return false;
}

function isBoardFull(board) {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === '') {
                return false;
            }
        }
    }
    return true;
}

function evaluate(board, player) {
    if (isWinner(board, player)) {
        return 10;
    } else if (isWinner(board, player === 'X' ? 'O' : 'X')) {
        return -10;
    } else {
        return 0;
    }
}

// Hàm Minimax
function minimax(board, depth, isMaximizing, player) {
    let score = evaluate(board, player);

    if (score === 10 || score === -10) {
        return score;
    }

    if (isBoardFull(board)) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (board[i][j] === '') {
                    board[i][j] = player;
                    bestScore = Math.max(bestScore, minimax(board, depth + 1, !isMaximizing, player));
                    board[i][j] = '';
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (board[i][j] === '') {
                    board[i][j] = player === 'X' ? 'O' : 'X';
                    bestScore = Math.min(bestScore, minimax(board, depth + 1, !isMaximizing, player));
                    board[i][j] = '';
                }
            }
        }
        return bestScore;
    }
}

function findBestMove(board, player) {
    let bestMove = { row: -1, col: -1 };
    let bestScore = -Infinity;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === '') {
                board[i][j] = player;
                let score = minimax(board, 0, false, player);
                board[i][j] = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove.row = i;
                    bestMove.col = j;
                }
            }
        }
    }

    return bestMove;
}