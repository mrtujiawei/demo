import { packArrayBuffer, unpackArrayBuffer } from '@mrtujiawei/utils';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const createTextMessage = async (content: string) => {
  return packArrayBuffer(
    encoder.encode(content),
    JSON.stringify({
      type: 'text',
    })
  );
};

export const createFileMessage = async (file: File) => {
  return packArrayBuffer(
    await file.arrayBuffer(),
    JSON.stringify({
      type: 'file',
      fileType: file.type,
      name: file.name,
    })
  );
};

export const parseMessage = async (message: Blob) => {
  const result = unpackArrayBuffer(await message.arrayBuffer());
  const metadata = JSON.parse(result.metadata);

  if (metadata.type == 'text') {
    return {
      type: metadata.type,
      metadata,
      content: decoder.decode(result.arrayBuffer),
    };
  }

  return {
    type: metadata.type,
    metadata,
    content: result.arrayBuffer,
  };
};
