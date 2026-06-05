(() => {
  const board = document.getElementById('board');
  const status = document.getElementById('status');
  const restartBtn = document.getElementById('restartBtn');

  const EMOJIS = ['🐶','🐱','🦊','🐼','🐨','🦄','🐸','🐙'];
  let cards = [];
  let revealed = [];
  let matched = new Set();
  let moves = 0;
  let timer = null;
  let seconds = 0;
  let waiting = false;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function updateStatus() {
    status.textContent = `Moves: ${moves} · Time: ${seconds}s`;
  }

  function startTimer() {
    if (timer) return;
    timer = setInterval(() => {
      seconds += 1;
      updateStatus();
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timer);
    timer = null;
  }

  function resetState() {
    stopTimer();
    matched.clear();
    revealed = [];
    moves = 0;
    seconds = 0;
    waiting = false;
    cards = shuffle([...EMOJIS, ...EMOJIS].map((value, idx) => ({ value, idx })));
    updateStatus();
  }

  function buildBoard() {
    board.innerHTML = '';
    cards.forEach((card, position) => {
      const button = document.createElement('button');
      button.className = 'memory-cell';
      button.dataset.position = position;
      button.dataset.value = card.value;
      button.setAttribute('aria-label', 'Reveal card');
      button.type = 'button';
      board.appendChild(button);
      button.addEventListener('click', () => reveal(position, button, card.value));
    });
  }

  function reveal(position, button, value) {
    if (waiting) return;
    if (matched.has(position)) return;
    if (revealed.some(item => item.position === position)) return;

    button.textContent = value;
    button.classList.add('flipped', 'matched');
    revealed.push({ position, button });

    startTimer();

    if (revealed.length !== 2) return;

    moves += 1;
    updateStatus();

    const [a, b] = revealed;
    if (a.button.dataset.value === b.button.dataset.value) {
      matched.add(a.position);
      matched.add(b.position);
      revealed = [];
      if (matched.size === cards.length) {
        stopTimer();
        setTimeout(() => alert(`You won in ${moves} moves and ${seconds}s!`), 320);
      }
      return;
    }

    waiting = true;
    setTimeout(() => {
      a.button.classList.remove('flipped', 'matched');
      a.button.textContent = '';
      b.button.classList.remove('flipped', 'matched');
      b.button.textContent = '';
      revealed = [];
      waiting = false;
    }, 520);
  }

  restartBtn.addEventListener('click', () => {
    resetState();
    buildBoard();
  });

  resetState();
  buildBoard();
})();
