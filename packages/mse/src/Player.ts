import MP4Box, { MP4BoxInfo } from 'mp4box';
import { Lock } from '@mrtujiawei/utils';

class MP4Player {
  private mediaSource: MediaSource = new MediaSource();
  private mp4box = MP4Box.createFile();

  // 单个 segment 帧数
  private nbSamples = 1;

  private lock = new Lock();

  static isSupport() {
    return 'MediaSource' in window;
  }

  constructor() {
    this.mp4box.onReady = async (info) => this.onReady(info);
    this.mp4box.onSegment = (id, sourceBuffer, buffer, sampleNum) =>
      this.onSegment(id, sourceBuffer, buffer, sampleNum);
  }

  createURL() {
    const src = URL.createObjectURL(this.mediaSource);
    this.lock.lock();
    this.mediaSource.addEventListener(
      'sourceopen',
      () => {
        URL.revokeObjectURL(src);
        this.lock.unlock();
      },
      { once: true }
    );
    return src;
  }

  /**
   * 元数据被解析时触发
   */
  async onReady(info: MP4BoxInfo) {
    await this.lock.lock();
    this.mediaSource.duration = Math.floor(info.duration / 1000);

    info.tracks.forEach((track) => {
      const mime = `video/mp4; codecs="${track.codec}"`;
      if (MediaSource.isTypeSupported(mime)) {
        try {
          const sourceBuffer = this.mediaSource.addSourceBuffer(mime);
          this.mp4box.setSegmentOptions(track.id, sourceBuffer, {
            nbSamples: this.nbSamples,
          });
        } catch (e) {
          console.error('Not support codecs', e);
        }
      }
    });

    const initSegs = this.mp4box.initializeSegmentation();
    let pendingInits = 0;
    for (var i = 0; i < initSegs.length; i++) {
      // @ts-ignore
      const sb = initSegs[i].user;
      sb.addEventListener('updateend', () => {
        pendingInits--;
        if (pendingInits === 0) {
          this.mp4box.start();
        }
        const sourceBuffer = sb;
        const mediaSource = this.mediaSource;
        if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
          mediaSource.endOfStream();
        }
      });
      sb.appendBuffer(initSegs[i].buffer);
      pendingInits++;
    }
    this.lock.unlock();
  }

  /**
   * 每生成一个segment 都会触发一次
   * 必须等上一个片段处理完后才能 append 下一个
   *
   * @param id track id
   * @param sourceBuffer 调用的 sourceBuffer
   * @param buffer 该片段的数据
   * @param _sampleNum 片段编号
   */
  private async onSegment(
    _id: number,
    sourceBuffer: SourceBuffer,
    buffer: ArrayBuffer,
    _sampleNum: number
  ) {
    await this.lock.lock();
    sourceBuffer.appendBuffer(buffer);
    sourceBuffer.addEventListener(
      'updateend',
      () => {
        this.lock.unlock();
      },
      { once: true }
    );
  }

  appendBuffer(buffer: CustomerBuffer) {
    this.mp4box.appendBuffer(buffer);
  }
}

export default MP4Player;
