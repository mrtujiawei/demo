import './styles.less';

const canvas = document.createElement('canvas');

const fontSize = 60;
const txt = 'jekka-lab.cn';

const context = canvas.getContext('2d')!;

canvas.width = 420;
canvas.height = 300;

context.font = `800 ${fontSize}px serif`;
context.fillStyle = 'rgba(210, 212, 213, 1)';
context.textBaseline = 'bottom';

context.rotate((-30 * Math.PI) / 180);

context.fillText(txt, -60, 200);

document.body.append(canvas);
