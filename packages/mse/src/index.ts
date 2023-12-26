import './styles.less';
import Player from './Player';
import Loader from './Loader';

const createVideo = () => {
  const video = document.createElement('video');
  video.controls = true;
  return video;
};

const createStartButton = () => {
  const button = document.createElement('button');
  button.innerHTML = '点我播放';
  button.className = 'start-btn';
  return button;
};

const video = createVideo();
const startButton = createStartButton();
document.body.appendChild(video);
document.body.appendChild(startButton);

const videoURLs = [
  '/fmp4.mp4',
  '/1.mp4',
  'https://d2fhr2h6dufnb0.cloudfront.net/backend/storage/upload/hareel_20231114195555_dc2et1PPAY.mp4',
  'https://d2fhr2h6dufnb0.cloudfront.net/backend/storage/upload/hareel_20231113112817_4puv8XlccN.mp4',
  'https://d2fhr2h6dufnb0.cloudfront.net/backend/storage/upload/hareel_20231114115143_JwcajVmcsl.mp4',
];
const videoURL = videoURLs[3];

function initEventListener() {
  startButton.addEventListener('click', () => {
    video.currentTime = 0;
    video.play();
  });
  video.addEventListener('durationchange', () => {
    if (video.paused) {
      video.currentTime = 0;
    }
  });
}

async function main() {
  initEventListener();

  const player = new Player();
  if (Player.isSupport()) {
    video.src = player.createURL();
    const loader = new Loader(videoURL);
    let buffer = await loader.load();
    while (buffer) {
      player.appendBuffer(buffer);
      buffer = await loader.load();
    }
  } else {
    console.log('不支持 MSE');
  }
}

main();
