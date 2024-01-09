import './index.less';

const container = document.createElement('div');
container.className = 'container';

const cursor = document.createElement('cursor');
cursor.className = 'cursor';

for (let i = 0; i < 150; i++) {
  const box = document.createElement('span');
  container.appendChild(box);
}

window.onmousemove = (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
};

document.body.appendChild(container);
document.body.appendChild(cursor);
