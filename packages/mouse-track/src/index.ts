import { Random } from '@mrtujiawei/utils';
import './styles.css';

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d')!;
context.lineWidth = 2;
context.globalAlpha = 0.5;

/**
 * 鼠标位置
 */
const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

/**
 * 点数
 */
const count = 100;

/**
 * 点
 */
const circles: Circle[] = [];

/**
 * 获取颜色
 */
const getColor = () => {
  let color = '#';

  for (let i = 0; i < 3; i++) {
    const value = Random.getRandomNumber(0, 1 << 8);
    color += value.toString(16).padStart(2, '0');
  }

  return color;
};

const resize = () => {
  canvas.height = innerHeight;
  canvas.width = innerWidth;
  for (let i = 0; i < count; i++) {
    circles[i] = new Circle(mouse.x, mouse.y, 4, getColor(), 0.02);
  }
};

class Circle {
  theta = Random.getRandomFloat(0, Math.PI * 2);
  t = Random.getRandomFloat(0, 150);

  constructor(
    // 坐标位置
    public x: number,
    public y: number,
    // 半径
    public r: number,
    // 颜色
    public color: string,
    // 角度变化量
    public s: number
  ) {}

  // 每次画的是直线，但是偏移一定的角度 s
  draw() {
    // 开始位置
    const ls = {
      x: this.x,
      y: this.y,
    };
    this.theta += this.s;
    this.x = mouse.x + Math.cos(this.theta) * this.t;
    this.y = mouse.y + Math.sin(this.theta) * this.t;
    context.beginPath();
    context.lineWidth = this.r;
    context.strokeStyle = this.color;
    context.moveTo(ls.x, ls.y);
    context.lineTo(this.x, this.y);
    context.stroke();
    context.closePath();
  }
}

const animate = () => {
  requestAnimationFrame(animate);
  context.fillStyle = 'rgba(0, 0, 0, 0.05)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  circles.forEach((e) => e.draw());
};

addEventListener('resize', resize);
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

document.body.appendChild(canvas);
resize();
animate();
