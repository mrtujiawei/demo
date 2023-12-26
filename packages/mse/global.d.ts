declare module 'mp4box' {
  // 只写了需要用到的部分
  type Track = {
    codec: string;
    id: number;
  };

  export type MP4BoxInfo = {
    duration: number;
    tracks: Track[];
  };

  const mp4box = {
    createFile() {
      return {
        onSegment(
          id: number,
          sourceBuffer: SourceBuffer,
          buffer: ArrayBuffer,
          sampleNum: number
        ) {},
        onReady(info: MP4BoxInfo) {},
        setSegmentOptions(
          id: number,
          sourceBuffer: SourceBuffer,
          { nbSamples: number }
        ) {},
        initializeSegmentation() {
          return [] as any[];
        },
        start() {},
        appendBuffer(buffer: CustomerBuffer) {},
      };
    },
  };

  export default mp4box;
}

type CustomerBuffer = ArrayBuffer[] & {
  fileStart: number;
};
