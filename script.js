sessionStorage.setItem("score-x", 0);
sessionStorage.setItem("score-o", 0);
sessionStorage.setItem("score-d", 0);

const defaultSymbol = "";
const symbolX = "X";
const symbolO = "O";

const symbol = {
  symbolX: "X",
  symbolO: "O",
  defaultSymbol: "",
  symbolDraw: "d",
};
const player = { player1: "P1", player2: "P2", computer: "C" };

var playerXPoint = 0;
var playerOPoint = 0;
var currSymbol = "X";

isStart = false;
var isPlayWithComputer = false;
var currTurn = player.player1;

var isOver = false;

const winningConditions = [
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [0, 2],
    [1, 1],
    [2, 0],
  ],
];

//Board
const rows = 3;
const cols = 3;
var boardGame = Array(rows)
  .fill()
  .map(() => Array(cols).fill(defaultSymbol));

function setDefaultScore() {
  $("#score-x > h2 > span").text(sessionStorage.getItem("score-x"));
  $("#score-d > h2 > span").text(sessionStorage.getItem("score-d"));
  $("#score-o > h2 > span").text(sessionStorage.getItem("score-o"));
}

function resetScore() {
  sessionStorage.setItem("score-x",0);
  sessionStorage.setItem("score-d",0);
  sessionStorage.setItem("score-o",0);
}

function isBoardFull(boardGame) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (boardGame[i][j] === "") {
        return false; // Có ô trống
      }
    }
  }
  return true; // Không có ô trống
}

function CreateBoard() {
  let board = $("#board");
  for (let x = 0; x < boardGame.length; x++) {
    let row = $("<tr></tr>");
    for (let y = 0; y < boardGame[x].length; y++) {
      let cell = $("<td></td>").text(boardGame[x][y]);
      cell.attr("data-x", x);
      cell.attr("data-y", y);
      row.append(cell);
    }
    board.append(row);
  }
}

function CleanBoard() {
  for (let x = 0; x < boardGame.length; x++) {
    for (let y = 0; y < boardGame[x].length; y++) {
      var td = $('#board td[data-x="' + x + '"][data-y="' + y + '"]');
      td.text(defaultSymbol);
      td.removeClass();
      boardGame[x][y] = defaultSymbol;
    }
  }
  //If turn computer, compute move first
  ComputerFirstMove();
}

function CheckWin() {
  for (const condition of winningConditions) {
    const [a, b, c] = condition;
    const [aX, aY] = a;
    const [bX, bY] = b;
    const [cX, cY] = c;

    if (
      boardGame[aX][aY] !== defaultSymbol &&
      boardGame[aX][aY] === boardGame[bX][bY] &&
      boardGame[aX][aY] === boardGame[cX][cY]
    ) {
      return boardGame[aX][aY];
    }
  }
}

function SwapTurnPlayer() {
  currTurn = currTurn === player.player1 ? player.computer : player.player1;
}
function SwapSymbol() {
  currSymbol = currSymbol === symbol.symbolX ? symbol.symbolO : symbol.symbolX;
}

function UpdateScore(player, setScore) {
  let score = parseInt(sessionStorage.getItem("score-" + player)) || 0;
  score++;
  sessionStorage.setItem("score-" + player, score);
  setScore.text(score);
}

function CheckStateGame() {
  let isWin = CheckWin();

  let winSymbol = isWin === symbol.symbolX ? symbol.symbolX : symbol.symbolO;
  let setScore = $(`#score-${winSymbol.toLowerCase()} > h2 > span`);
  let setScoreD = $(`#score-d > h2 > span`);

  if (isWin) {
    alert(isWin + " Win!");
    UpdateScore(winSymbol.toLowerCase(), setScore);
    CleanBoard();
    return;
  }
  //Check board full
  if (isBoardFull(boardGame)) {
    alert("Match Draw!");
    UpdateScore(symbol.symbolDraw, setScoreD);
    CleanBoard();
  }
}

function ComputerFirstMove() {
  if (currTurn === player.computer) {
    currSymbol = symbol.symbolX;
    var computerStep = findBestMove(boardGame, currSymbol);
    if (computerStep.row === -1 || computerStep.col === -1) return;
    const cell = $(
      `#board td[data-x="${computerStep.row}"][data-y="${computerStep.col}"]`
    );
    Move(currSymbol, computerStep.row, computerStep.col);
    cell.text(currSymbol);
    cell.addClass("color-" + currSymbol.toLowerCase() + "-td");

    // Swap turn and symbol
    currTurn = player.player1;
    currSymbol = symbolO;
  }
}

function PlayWithComputer(clickedCell) {
  if (isStart === true) {
    if (clickedCell.text() === defaultSymbol) {
      if (currTurn === player.player1) {
        // Turn of player
        const cellX = parseInt(clickedCell.attr("data-x"));
        const cellY = parseInt(clickedCell.attr("data-y"));

        clickedCell.text(currSymbol);
        Move(currSymbol, cellX, cellY);
        clickedCell.addClass("color-" + currSymbol.toLowerCase() + "-td");

        SwapSymbol();
        currTurn = player.computer;
      }
      if (currTurn == player.computer) {
        var computerStep = findBestMove(boardGame, currSymbol);
        if (computerStep.row == -1 || computerStep.col == -1) return;

        let computerCell = $(
          `#board td[data-x="${computerStep.row}"][data-y="${computerStep.col}"]`
        );

        Move(currSymbol, computerStep.row, computerStep.col);
        computerCell.text(currSymbol);
        computerCell.addClass("color-" + currSymbol.toLowerCase() + "-td");

        SwapSymbol();
        currTurn = player.player1;
      }
    }
  }
}

function PlayWithPlayer(clickedCell) {
  const cellX = parseInt(clickedCell.attr("data-x"));
  const cellY = parseInt(clickedCell.attr("data-y"));
  if (currSymbol === symbol.symbolX) {
    clickedCell.text(symbol.symbolX);
    Move(symbol.symbolX, cellX, cellY);
    clickedCell.addClass("color-x-td");
    SwapSymbol();
  } else {
    clickedCell.html(symbolO);
    Move(symbolO, cellX, cellY);
    clickedCell.addClass("color-o-td");
    SwapSymbol();
  }
}

function Move(symbol, px, py) {
  boardGame[px][py] = symbol;
}

function setColor(element) {
  element.addClass("");
}

$(document).ready(function () {
  CreateBoard();
  setDefaultScore();

  $("#board td").click(function (e) {
    e.preventdefault;
    if (isStart === true) {
      if ($(this).text() === defaultSymbol) {
        if (isPlayWithComputer) {
          PlayWithComputer($(this));
        } else {
          PlayWithPlayer($(this));
        }
      }
    }

    setTimeout(function () {
      CheckStateGame();
    }, 100);
  });

  $("#TwoPlayer").click(function () {
    isStart = true;
    resetScore();
    setDefaultScore();
    alert("Start Game!");
  });

  $("#Computer").click(function () {
    isStart = true;
    isPlayWithComputer = true;
    resetScore();
    setDefaultScore();
    alert("Start Game!");
  });

  $("#Chatgpt").click(function () {
    alert("Comming soon!");
  });
});
