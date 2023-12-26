import Canvas2DRenderer from './Canvas2DRenderer';
import MP4Demuxer from './MP4Demuxer';

let pendingStatus: any = null;

function statusAnimationFrame() {
  pendingStatus = null;
}

function setStatus(type: string, message: string) {
  if (pendingStatus) {
    pendingStatus[type] = message;
  } else {
    pendingStatus = { [type]: message };
    requestAnimationFrame(statusAnimationFrame);
  }
}

let renderer: any = null;
let pendingFrame: any[] = [];
let startTime: any = null;
let frameCount: any = 0;
let onPlayChange: any;

function renderFreame(frame: any) {
  if (pendingFrame.length == 0) {
    requestAnimationFrame(renderAnimationFrame);
  }
  pendingFrame.push(frame);
}

function renderAnimationFrame() {
  const frame = pendingFrame.shift();
  renderer.draw(frame);
  frame.close();
  if (pendingFrame.length > 0) {
    onPlayChange(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(renderAnimationFrame);
    });
  } else {
    onPlayChange(false);
  }
}

function start({ dataUri, rendererName, canvas, onStatusChange }: {
  dataUri: string;
  rendererName: string;
  canvas: HTMLCanvasElement;
  onStatusChange: (status: boolean) => void;
}) {
  onPlayChange = onStatusChange;
  switch (rendererName) {
    case '2d':
    default:
      renderer = new Canvas2DRenderer(canvas);
      break;
  }

  const decoder = new VideoDecoder({
    output(frame) {
      if (startTime == null) {
        startTime = performance.now();
      } else {
        const elapsed = (performance.now() - startTime) / 1000;
        const fps = ++frameCount / elapsed;
        setStatus('render', `${fps.toFixed(0)} fps`);
      }
      renderFreame(frame);
    },
    error(e) {
      setStatus('decode', e.message);
    },
  });

  new MP4Demuxer(dataUri, {
    onConfig(config: any) {
      setStatus(
        'decode',
        `${config.codec} @ ${config.codedWidth}x${config.codedHeight}`
      );
      decoder.configure(config);
    },
    onChunk(chunk: any) {
      decoder.decode(chunk);
    },
    setStatus,
  });
}

export default start;
