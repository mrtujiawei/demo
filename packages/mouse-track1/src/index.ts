import { Random } from '@mrtujiawei/utils';
import './styles.css';

class Point {
  public radius = 1;
  public delta = 0.2;
  public color = this.getColor();

  constructor(
    public x: number,
    public y: number,
    public context: CanvasRenderingContext2D
  ) {}

  draw() {
    if (this.radius > 20) {
      this.radius = 1;
      this.x = mouse.x;
      this.y = mouse.y;
    }
    this.radius += this.delta;
    this.context.beginPath();
    this.context.strokeStyle = this.color;
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.context.stroke();
  }

  getColor() {
    let color = '#';

    for (let i = 0; i < 3; i++) {
      const value = Random.getRandomNumber(0, 1 << 8);
      color += value.toString(16).padStart(2, '0');
    }

    return color;
  }
}

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d')!;

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerHeight / 2,
  y: innerWidth / 2,
};

const points: Point[] = [];

context.globalAlpha = 0.5;

const render = () => {
  requestAnimationFrame(render);
  console.log(points.length);
  if (points.length < 100) {
    points.push(new Point(mouse.x, mouse.y, context));
  }
  context.fillStyle = 'rgba(0, 0, 0, 0.05)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  points.forEach((point) => point.draw());
};

document.body.appendChild(canvas);
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});
render();
