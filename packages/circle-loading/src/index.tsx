import './index.less';

const start = new Date().getTime();
const animte = () => {
  const current = new Date().getTime();
  const percent = (((current - start) / 1000) % 15) / 15;
  const value = 2 * 3.1415 * 95 * percent;

  document.body.innerHTML = `
    <div class="progress-circle">
      <svg width="200" height="200">
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="rgba(0, 0, 0, 0.2)"
          stroke-width="10"
        />
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="#fff"
          stroke-linecap="round"
          stroke-width="10"
          stroke-dasharray="${value}, 1000"
          class="progress-value"
        />
      </svg>
    </div>
  `;
  requestAnimationFrame(animte);
};
requestAnimationFrame(animte);
