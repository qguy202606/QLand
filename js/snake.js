const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');
const pauseText = document.getElementById('pauseText');

const state = {
  tileCount: 18,
  initialSpeed: 115,
  snake: null,
  food: null,
  dir: { x: 1, y: 0 },
  nextDir: { x: 1, y: 0 },
  size: 18,
  running: false,
  lost: false,
  loopId: null,
  score: 0,
};

const $ = (sel) => document.querySelector(sel);

function sizeCanvas() {
  const maxSize = Math.min(window.innerWidth - 32, 540);
  const tile = Math.floor(maxSize / state.tileCount);
  state.size = tile;
  canvas.width = tile * state.tileCount;
  canvas.height = tile * state.tileCount;
}

function initalize() {
  const mid = Math.floor(state.tileCount / 2);
  state.snake = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];
  state.dir = { x: 1, y: 0 };
  state.nextDir = { x: 1, y: 0 };
  state.score = 0;
  state.lost = false;
  placeFood();
  setStatus(`Score: ${state.score}`);
  pauseText.textContent = 'Playing';
}

function placeFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * state.tileCount),
      y: Math.floor(Math.random() * state.tileCount),
    };
  } while (state.snake.some((seg) => seg.x === pos.x && seg.y === pos.y));
  state.food = pos;
}

function setStatus(text) {
  statusEl.textContent = text;
}

function draw() {
  const { size, tileCount, snake, food } = state;
  ctx.fillStyle = '#0b1422';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#64ffda';
  snake.forEach((seg) => {
    ctx.fillRect(seg.x * size + 1, seg.y * size + 1, size - 2, size - 2);
  });

  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(
    food.x * size + size / 2,
    food.y * size + size / 2,
    size / 2 - 2,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

function step() {
  if (!state.running || state.lost) return;

  state.dir = { ...state.nextDir };
  const head = {
    x: state.snake[0].x + state.dir.x,
    y: state.snake[0].y + state.dir.y,
  };

  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= state.tileCount ||
    head.y >= state.tileCount ||
    state.snake.some((seg) => seg.x === head.x && seg.y === head.y)
  ) {
    state.lost = true;
    state.running = false;
    pauseText.textContent = 'Game Over';
    setStatus(`Game Over — Score: ${state.score}`);
    return;
  }

  state.snake.unshift(head);

  if (head.x === state.food.x && head.y === state.food.y) {
    state.score += 1;
    setStatus(`Score: ${state.score}`);
    placeFood();
  } else {
    state.snake.pop();
  }
  draw();
}

function startPause() {
  if (state.lost) {
    initalize();
    state.running = true;
    pauseText.textContent = 'Playing';
    clearInterval(state.loopId);
    state.loopId = setInterval(step, state.initialSpeed);
    draw();
    return;
  }
  state.running = !state.running;
  pauseText.textContent = state.running ? 'Playing' : 'Paused';
  if (state.running) {
    clearInterval(state.loopId);
    state.loopId = setInterval(step, state.initialSpeed);
  }
}

function changeDir(x, y) {
  if (!state.running) return;
  const dir = state.dir;
  if (x !== 0 && dir.x !== 0) return;
  if (y !== 0 && dir.y !== 0) return;
  state.nextDir = { x, y };
}

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
      changeDir(0, -1);
      e.preventDefault();
      break;
    case 'ArrowDown':
    case 's':
      changeDir(0, 1);
      e.preventDefault();
      break;
    case 'ArrowLeft':
    case 'a':
      changeDir(-1, 0);
      e.preventDefault();
      break;
    case 'ArrowRight':
    case 'd':
      changeDir(1, 0);
      e.preventDefault();
      break;
    case ' ':
      startPause();
      e.preventDefault();
      break;
  }
});

document.getElementById('btnUp').addEventListener('click', () => changeDir(0, -1));
document.getElementById('btnDown').addEventListener('click', () => changeDir(0, 1));
document.getElementById('btnLeft').addEventListener('click', () => changeDir(-1, 0));
document.getElementById('btnRight').addEventListener('click', () => changeDir(1, 0));
$('#restartBtn').addEventListener('click', () => {
  clearInterval(state.loopId);
  initalize();
  state.running = true;
  pauseText.textContent = 'Playing';
  state.loopId = setInterval(step, state.initialSpeed);
  draw();
});
window.addEventListener('resize', () => {
  sizeCanvas();
  draw();
});

sizeCanvas();
initalize();
draw();
setTimeout(() => {
  state.loopId = setInterval(step, state.initialSpeed);
  state.running = true;
  pauseText.textContent = 'Playing';
}, 400);
