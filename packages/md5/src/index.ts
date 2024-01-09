import md5 from 'md5';

const container = document.createElement('container');
const input = document.createElement('input');
const button = document.createElement('button');
const result = document.createElement('div');

button.innerHTML = 'md5';

container.appendChild(input);
container.appendChild(button);
container.appendChild(result);

button.addEventListener('click', () => {
  result.innerHTML = md5(input.value)
});

document.body.appendChild(container);
