/**
 *
 * @filename packages/audio-visualzation/src/index.tsx
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-09-12 11:24:09
 */

import './index.less';
import { render } from './canvas';
const audioContext = new AudioContext();

fetch('/a.m4a')
  .then((response) => response.arrayBuffer())
  .then((value) => {
    return audioContext.decodeAudioData(value);
  })
  .then((buffer) => {
    // const float32Array = new Float32Array(buffer.length);
    // buffer.copyFromChannel(float32Array, 1);
    // render(float32Array);

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    const bufferSource = audioContext.createBufferSource();
    bufferSource.buffer = buffer;

    bufferSource.connect(analyser);
    analyser.connect(audioContext.destination);

    console.log('inited');
    const handler = () => {
      bufferSource.start();
      document.body.removeEventListener('click', handler);

      const uint8Array = new Uint8Array(analyser.frequencyBinCount);
      const draw = () => {
        analyser.getByteFrequencyData(uint8Array);
        console.log(uint8Array);
        render(uint8Array);
        requestAnimationFrame(draw);
      };
      draw();
    };

    document.body.addEventListener('click', handler);
  });
