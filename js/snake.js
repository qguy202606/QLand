(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const statusEl = document.getElementById('status');
  const pauseText = document.getElementById('pauseText');

  const TILE = 18;
  const SPEED = 115;

  let size = 18;
  let snake = [];
  let food = null;
  let dir = { x: 1, y: 0 };
  let nextDir = { x: 1, y: 0 };
  let running = false;
  let lost = false;
  let timer = null;
  let score = 0;

  function resize() {
    const max = Math.min(window.innerWidth - 32, 540);
    size = Math.floor(max / TILE);
    canvas.width = size * TILE;
    canvas.height = size * TILE;
  }

  function init() {
    const mid = Math.floor(TILE / 2);
    snake = [
      { x: mid, y: mid },
      { x: mid - 1, y: mid },
      { x: mid - 2, y: mid },
    ];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    lost = false;
    placeFood();
    statusEl.textContent = `Score: ${score}`;
    pauseText.textContent = 'Playing';
  }

  function placeFood() {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * TILE),
        y: Math.floor(Math.random() * TILE),
      };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    food = pos;
  }

  function draw() {
    ctx.fillStyle = '#0b1422';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#64ffda';
    snake.forEach(s => {
      ctx.fillRect(s.x * size + 1, s.y * size + 1, size - 2, size - 2);
    });

    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(
      food.x * size + size / 2,
      food.y * size + size / 2,
      size / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  function step() {
    if (!running || lost) return;

    dir = { x: nextDir.x, y: nextDir.y };
    const head = {
      x: snake[0].x + dir.x,
      y: snake[0].y + dir.y,
    };

    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= TILE ||
      head.y >= TILE ||
      snake.some(s => s.x === head.x && s.y === head.y)
    ) {
      lost = true;
      running = false;
      clearInterval(timer);
      timer = null;
      pauseText.textContent = 'Game Over';
      statusEl.textContent = `Game Over — Score: ${score}`;
      draw();
      return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 1;
      statusEl.textContent = `Score: ${score}`;
      placeFood();
    } else {
      snake.pop();
    }
    draw();
  }

  function setDir(x, y) {
    if (!running) return;
    if (x !== 0 && dir.x !== 0) return;
    if (y !== 0 && dir.y !== 0) return;
    nextDir = { x, y };
  }

  function togglePause() {
    if (lost) {
      init();
      running = true;
      timer = setInterval(step, SPEED);
      draw();
      return;
    }
    running = !running;
    pauseText.textContent = running ? 'Playing' : 'Paused';
    if (running) {
      timer = setInterval(step, SPEED);
    } else {
      clearInterval(timer);
      timer = null;
    }
  }

  function restart() {
    clearInterval(timer);
    timer = null;
    init();
    running = true;
    timer = setInterval(step, SPEED);
    draw();
  }

  window.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowUp': case 'w': setDir(0, -1); e.preventDefault(); break;
      case 'ArrowDown': case 's': setDir(0, 1); e.preventDefault(); break;
      case 'ArrowLeft': case 'a': setDir(-1, 0); e.preventDefault(); break;
      case 'ArrowRight': case 'd': setDir(1, 0); e.preventDefault(); break;
      case ' ': togglePause(); e.preventDefault(); break;
    }
  });

  document.getElementById('btnUp').addEventListener('click', () => setDir(0, -1));
  document.getElementById('btnDown').addEventListener('click', () => setDir(0, 1));
  document.getElementById('btnLeft').addEventListener('click', () => setDir(-1, 0));
  document.getElementById('btnRight').addEventListener('click', () => setDir(1, 0));
  document.getElementById('restartBtn').addEventListener('click', restart);
  document.getElementById('pauseBtn').addEventListener('click', togglePause);

  window.addEventListener('resize', () => { resize(); draw(); });

  resize();
  init();
  draw();

  setTimeout(() => {
    timer = setInterval(step, SPEED);
    running = true;
    pauseText.textContent = 'Playing';
  }, 200);
})();
