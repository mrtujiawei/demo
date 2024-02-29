import './index.less';

const container = document.createElement('div');
container.className = 'container';

const numEl = document.createElement('span');

numEl.className = 'num';

numEl.innerHTML = Array.from(
  { length: 10 },
  (_, i) => `<span class="item">${i}</span>`
).join('');

container.appendChild(numEl);

document.body.appendChild(container);

const button = document.createElement('button');

button.innerHTML = 'change';

button.onclick = () => {
  const value = Math.floor(Math.random() * 10);
  numEl.style.transform = `rotateX(-${value * 36}deg)`;
  button.innerHTML = `change: ${value}`;
};

document.body.appendChild(button);
