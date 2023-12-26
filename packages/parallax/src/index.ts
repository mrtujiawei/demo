import './index.css';
const scrollBox = document.createElement('div');
scrollBox.className = 'scroll-box';
const sections: HTMLElement[] = [];

const ArrayImg = ['1.jpg', '2.jpg', '3.jpg'];
const createSection = (className: string, id: number) => {
  const section = document.createElement('section');
  section.className = className;
  section.dataset.id = id.toString();
  section.innerHTML = ArrayImg[id];
  return section;
};

sections.push(
  createSection('prev', 0),
  createSection('cur', 1),
  createSection('next', 2)
);

sections.forEach((section) => {
  scrollBox.appendChild(section);
});

document.body.appendChild(scrollBox);

let curId = Number(sections[1].dataset.id);
let scrolling = false;

const createScrollImg = (curId: number) => {
  const prevId = curId == 0 ? ArrayImg.length - 1 : curId - 1;
  const nextId = curId == ArrayImg.length - 1 ? 0 : curId + 1;
  sections[1].innerHTML = ArrayImg[curId];
  sections[0].innerHTML = ArrayImg[prevId];
  sections[2].innerHTML = ArrayImg[nextId];
};

const scroll = (prevOrNext: HTMLElement, cur: HTMLElement) => {
  prevOrNext.style.transition = 'height 1s';
  prevOrNext.style.height = '100vh';
  setTimeout(() => {
    prevOrNext.style.transition = 'none';
    cur.innerHTML = ArrayImg[curId];
    prevOrNext.style.height = '0';
    createScrollImg(Number(curId));
    setTimeout(() => {
      scrolling = false;
    }, 100);
  }, 1000);
};

window.addEventListener('wheel', (event) => {
  if (scrolling) {
    return;
  }
  scrolling = true;
  if (event.deltaY < 0) {
    curId--;
    if (curId < 0) {
      curId = ArrayImg.length - 1;
    }
    scroll(sections[0], sections[1]);
  } else if (event.deltaY > 0) {
    curId = (curId + 1) % ArrayImg.length;
    scroll(sections[2], sections[1]);
  }
});
