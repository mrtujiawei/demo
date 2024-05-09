class Message {
  time = new Date();
  arrayBuffer!: ArrayBuffer;
  fileType!: string;
  constructor(public code: number, public message: string) {}

  setArrayBuffer(arrayBuffer: ArrayBuffer) {
    this.arrayBuffer = arrayBuffer;
  }

  setFileType(fileType: string) {
    this.fileType = fileType;
  }

  getClassName() {
    if (this.code == 0) {
      return 'message-system';
    }
    return 'message-user';
  }
}

export default Message;
