const board = document.getElementById('board');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const modeBtn = document.getElementById('modeBtn');

const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let squares = Array(9).fill('');
let xTurn = true;
let gameOver = false;
let vsAi = true;

function render() {
  board.innerHTML = '';
  squares.forEach((val, i) => {
    const el = document.createElement('button');
    el.className = 'ttt-cell ' + (val.toLowerCase());
    el.disabled = !!val || gameOver;
    el.textContent = val;
    el.dataset.index = i;
    el.addEventListener('click', () => onMove(i));
    board.appendChild(el);
  });
}

function setStatus(text) {
  status.textContent = text;
}

function checkWin(symbol) {
  return WIN_COMBOS.some((combo) => combo.every((i) => squares[i] === symbol));
}

function checkDraw() {
  return squares.every((v) => v);
}

function endGame(symbol) {
  gameOver = true;
  if (symbol) {
    setStatus(`${symbol} wins!`);
  } else {
    setStatus('Draw!');
  }
  render();
}

function afterMove() {
  if (checkWin('X')) return endGame('X');
  if (checkWin('O')) return endGame('O');
  if (checkDraw()) return endGame(null);
  xTurn = !xTurn;
  setStatus(xTurn ? "Player X's turn" : "Player O's turn");
  render();

  if (!gameOver && vsAi && !xTurn) {
    setTimeout(aiMove, 320);
  }
}

function onMove(i) {
  if (gameOver || squares[i]) return;
  squares[i] = xTurn ? 'X' : 'O';
  render();
  afterMove();
}

function aiMove() {
  if (gameOver) return;

  const empty = squares.map((v, i) => v === '' ? i : null).filter((v) => v !== null);
  if (!empty.length) return;

  const pick = (() => {
    for (const symbol of ['O', 'X']) {
      for (const i of empty) {
        squares[i] = symbol;
        if (checkWin(symbol)) {
          squares[i] = '';
          return i;
        }
        squares[i] = '';
      }
    }
    const center = 4;
    if (empty.includes(center)) return center;

    const corners = [0,2,6,8].filter((i) => empty.includes(i));
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

    return empty[Math.floor(Math.random() * empty.length)];
  })();

  squares[pick] = 'O';
  render();
  afterMove();
}

restartBtn.addEventListener('click', () => {
  squares = Array(9).fill('');
  xTurn = true;
  gameOver = false;
  setStatus("Player X's turn");
  render();

  if (vsAi && !xTurn) {
    setTimeout(aiMove, 320);
  }
});

modeBtn.addEventListener('click', () => {
  vsAi = !vsAi;
  modeBtn.textContent = vsAi ? 'Mode: 1 Player' : 'Mode: 2 Players';
  restartBtn.click();
});

render();
setStatus("Player X's turn");
