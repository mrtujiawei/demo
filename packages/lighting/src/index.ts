import './index.less';

const container = document.createElement('div');
container.className = 'container';

container.innerHTML = `
  <div class="card" style="--clr: #0f0;"></div>
  <div class="card" style="--clr: #ff0"></div>
`;

document.body.appendChild(container);

const cards = document.querySelectorAll<HTMLDivElement>('.card');
cards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    console.log({ pageX: e.pageX, cardOffsetLeft: card.offsetLeft });
    let x = e.pageX - card.offsetLeft;
    let y = e.pageY - card.offsetTop;
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  });
});
