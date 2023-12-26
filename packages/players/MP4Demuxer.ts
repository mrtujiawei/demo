import MP4Box from 'mp4box';
import MP4FileSink from './MP4FileSink';

class MP4Demuxer {
  #onConfig: any = null;
  #onChunk: any = null;
  #file: any = null;

  constructor(uri: string, { onConfig, onChunk, setStatus }: any) {
    this.#onConfig = onConfig;
    this.#onChunk = onChunk;
    this.#file = MP4Box.createFile();
    this.#file.onError = (error: any) => setStatus('demux', error);
    this.#file.onReady = this.#onReady.bind(this);
    this.#file.onSamples = this.#onSamples.bind(this);

    const fileSink = new MP4FileSink(this.#file);

    fetch(uri).then((response) => {
      response.body?.pipeTo(
        new WritableStream(fileSink, {
          highWaterMark: 2,
        })
      );
    });
  }

  #description(track: any) {
    const trak = this.#file.getTrackById(track.id);
    const DataStream = MP4Box.DataStream;
    for (const entry of trak.mdia.minf.stbl.stsd.entries) {
      const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C;

      if (box) {
        const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN);
        box.write(stream);
        // Remove the box header
        return new Uint8Array(stream.buffer, 8);
      }
    }
    throw new Error('avcC, hvcC, vpcC, or av1C box not found');
  }

  #onReady(info: any) {
    const track = info.videoTracks[0];

    this.#onConfig({
      codec: track.codec.startsWith('vp08') ? 'vp08' : track.codec,
      codeHeight: track.video.height,
      codeWidth: track.video.width,
      description: this.#description(track),
    });

    this.#file.setExtractionOptions(track.id);
    this.#file.start();
  }

  #onSamples(track_id: any, ref: any, samples: any) {
    for (const sample of samples) {
      this.#onChunk(
        new EncodedVideoChunk({
          type: sample.is_sync ? 'key' : 'delta',
          timestamp: (1e6 * sample.cts) / sample.timescale,
          duration: (1e6 * sample.duration) / sample.timescale,
          data: sample.data,
        })
      );
    }
  }
}

export default MP4Demuxer;
