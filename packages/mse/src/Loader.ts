import axios from 'axios';

const K = 1024;
const DEFAULT_CHUNK_SIZE = 50 * K;
const DEFAULT_REQUEST_TIMEOUT = 1000 * 10;

class Loader {
  private readonly url: string;
  private readonly chunkSize: number;
  private contentLength: number = Number.MAX_SAFE_INTEGER;
  private chunkIndex: number = 0;
  private requestTimeout: number;

  /**
   * @param url 资源地址
   * @param options.chunkSize 每次下载的大小
   */
  constructor(
    url: string,
    options?: {
      chunkSize?: number;
      requestTimeout?: number;
    }
  ) {
    this.url = url;
    this.chunkSize = options?.chunkSize ?? DEFAULT_CHUNK_SIZE;
    this.requestTimeout = options?.requestTimeout ?? DEFAULT_REQUEST_TIMEOUT;
  }

  private getRange(chunkIndex: number): [number, number] {
    const start = chunkIndex * this.chunkSize;
    const end = Math.min(start + this.chunkSize - 1, this.contentLength);

    return [start, end];
  }

  private updateContentLength(contentRange: string) {
    if (!contentRange) {
      return;
    }
    const contentLength = contentRange.split('/').pop() || '';
    if (/^\d+$/.test(contentLength)) {
      this.contentLength = Number(contentLength);
    }
  }

  private async request(range: [number, number]) {
    const data = await axios.get<CustomerBuffer>(this.url, {
      responseType: 'arraybuffer',
      headers: {
        range: `bytes=${range[0]}-${range[1]}`,
      },
      timeout: this.requestTimeout,
    });
    data.data.fileStart = range[0];
    this.updateContentLength(data.headers['content-range']);
    return data.data;
  }

  async load() {
    const range = this.getRange(this.chunkIndex);
    if (range[0] >= this.contentLength) {
      return null;
    }
    const buffer = await this.request(range);
    this.chunkIndex++;
    return buffer;
  }
}

export default Loader;
