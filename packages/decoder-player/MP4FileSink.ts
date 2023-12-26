class MP4FileSink {
  private file: any = null;
  private offset: any = 0;

  constructor(file: any) {
    this.file = file;
  }

  write(chunk: Buffer) {
    const buffer: any = new ArrayBuffer(chunk.byteLength);
    new Uint8Array(buffer).set(chunk);

    // 记录位置
    buffer.fileStart = this.offset;
    this.offset += buffer.byteLength;

    this.file.appendBuffer(buffer);
  }

  close() {
    this.file.flush();
  }
}

export default MP4FileSink;
