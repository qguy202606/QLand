(() => {
  const STATUS_MIN = 1;
  const STATUS_MAX = 100;
  let answer = Math.floor(Math.random() * STATUS_MAX) + 1;
  let attempts = 0;
  let solved = false;

  const input = document.getElementById('guessInput');
  const status = document.getElementById('status');
  const btn = document.getElementById('guessBtn');

  function updateStatus(message) {
    attempts += 1;
    status.textContent = `${message || ''} · Attempts: ${attempts}`;
  }

  btn.addEventListener('click', () => {
    if (solved) {
      answer = Math.floor(Math.random() * STATUS_MAX) + 1;
      attempts = 0;
      solved = false;
      input.value = '';
      updateStatus('New game started!');
      return;
    }
    const value = Number(input.value);
    if (!Number.isInteger(value) || value < STATUS_MIN || value > STATUS_MAX) {
      updateStatus('Please enter a valid number.');
      return;
    }
    if (value === answer) {
      solved = true;
      updateStatus('🎉 Correct! You won!');
    } else if (value < answer) {
      updateStatus('Higher ↗');
    } else {
      updateStatus('Lower ↘');
    }
    input.value = '';
    input.focus();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btn.click();
  });
})();
