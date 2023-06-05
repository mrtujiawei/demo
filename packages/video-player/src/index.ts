import 'video.js/dist/video-js.min.css';
import './style.less';
import VideoJs from 'video.js';
import { urlParamsToObject } from '@mrtujiawei/utils';

const playURL = urlParamsToObject(window.location.search).playURL;
const videoEl = document.createElement('video') as HTMLVideoElement;

videoEl.controls = true;
videoEl.preload = 'auto';
videoEl.dataset.setup = '{}';
videoEl.className = 'video-js';

document.body.appendChild(videoEl);

VideoJs(videoEl, {
  bigPlayButton: true,
  textTrackDisplay: false,
  posterImage: false,
  errorDisplay: false,
  muted: true,
  autoplay: true,
  sources: [
    {
      src: playURL,
      type: 'application/x-mpegURL',
    },
  ],
});
