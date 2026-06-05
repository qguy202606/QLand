(() => {
  const MOVES = ['rock', 'paper', 'scissors'];
  const scoreEl = document.getElementById('score');
  const resultEl = document.getElementById('result');
  const resetBtn = document.getElementById('resetBtn');
  const buttons = document.querySelectorAll('.rps-btn');

  let playerScore = 0;
  let cpuScore = 0;

  function updateScore() {
    scoreEl.textContent = `You: ${playerScore} · CPU: ${cpuScore}`;
  }

  function cpuMove() {
    return MOVES[Math.floor(Math.random() * MOVES.length)];
  }

  function resultText(player, cpu) {
    if (player === cpu) return "It's a draw!";
    if (
      (player === 'rock' && cpu === 'scissors') ||
      (player === 'paper' && cpu === 'rock') ||
      (player === 'scissors' && cpu === 'paper')
    ) {
      return 'You win!';
    }
    return 'CPU wins!';
  }

  function play(move) {
    const cpu = cpuMove();
    const result = resultText(move, cpu);
    resultEl.textContent = `You: ${move} · CPU: ${cpu} → ${result}`;
    if (result === 'You win!') playerScore += 1;
    if (result === 'CPU wins!') cpuScore += 1;
    updateScore();
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => play(btn.dataset.move));
  });

  resetBtn.addEventListener('click', () => {
    playerScore = 0;
    cpuScore = 0;
    updateScore();
    resultEl.textContent = 'Choose your move';
  });

  updateScore();
})();
