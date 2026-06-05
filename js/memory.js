const board = document.getElementById('board');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

const emojis = ['🐶','🐱','🦊','🐼','🐨','🦄','🐸','🐙'];
let cards = [];
let revealed = [];
let matched = new Set();
let moves = 0;
let timer = null;
let seconds = 0;
let isWaiting = false;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startTimer() {
  if (timer) return;
  timer = setInterval(() => {
    seconds += 1;
    renderStatus();
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

function renderStatus() {
  status.textContent = `Moves: ${moves} · Time: ${seconds}s`;
}

function buildBoard() {
  board.innerHTML = '';
  cards.forEach((card, pos) => {
    const el = document.createElement('button');
    el.className = 'memory-cell';
    el.dataset.pos = pos;
    el.dataset.emoji = card.value;
    el.setAttribute('aria-label', 'Hide card');
    el.type = 'button';
    board.appendChild(el);
    el.addEventListener('click', () => onReveal(pos, el, card.value));
  });
}

function onReveal(pos, el, value) {
  if (isWaiting) return;
  if (matched.has(pos)) return;
  if (revealed.some((entry) => entry.pos === pos)) return;

  el.textContent = value;
  el.classList.add('flipped');
  el.classList.add('matched');
  revealed.push({ pos, el });

  if (revealed.length !== 2) return;

  moves += 1;
  renderStatus();

  const [first, second] = revealed;

  if (first.el.dataset.emoji === second.el.dataset.emoji) {
    matched.add(first.pos);
    matched.add(second.pos);
    revealed = [];

    if (matched.size === cards.length) {
      stopTimer();
      setTimeout(() => {
        alert(`You won in ${moves} moves and ${seconds}s!`);
      }, 320);
    }
    return;
  }

  isWaiting = true;
  startTimer();
  setTimeout(() => {
    first.el.classList.remove('flipped', 'matched');
    first.el.textContent = '';
    second.el.classList.remove('flipped', 'matched');
    second.el.textContent = '';
    revealed = [];
    isWaiting = false;
  }, 520);
}

restartBtn.addEventListener('click', () => {
  stopTimer();
  matched.clear();
  revealed = [];
  moves = 0;
  seconds = 0;
  isWaiting = false;
  cards = shuffle([...emojis, ...emojis].map((value, index) => ({ value, index })));
  renderStatus();
  buildBoard();
});

restartBtn.click();
