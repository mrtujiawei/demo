/**
 *
 * @filename packages/audio-visualzation/src/canvas.tsx
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-09-12 14:12:35
 */

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d')!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.appendChild(canvas);

export const render = async (uint8Array: Uint8Array) => {
  const { width, height } = canvas;

  context.clearRect(0, 0, width, height);

  context.fillStyle = 'rgb(255, 0, 255)';

  const barWidth = width / uint8Array.length / 1.5;
  for (let i = 0; i < uint8Array.length; i++) {
    const value = uint8Array[i] / 255;
    const barHeight = (value * height) / 2.2 || 0;
    const x1 = i * barWidth + width / 2;
    const x2 = width / 2 - (i + 1) * barWidth;
    const y = height / 2 - barHeight;

    context.fillRect(x1, y, barWidth - 2, barHeight);
    context.fillRect(x2, y, barWidth - 2, barHeight);
  }
};
