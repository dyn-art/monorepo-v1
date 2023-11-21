export function toArrayBuffer(
  data: ArrayBuffer | Uint8Array | Buffer
): ArrayBuffer {
  if ('buffer' in data) {
    // If data has a 'buffer' property, it's a Uint8Array or a Node.js Buffer.
    // Slice the buffer to get the correct portion.
    return data.buffer.slice(
      data.byteOffset,
      data.byteOffset + data.byteLength
    );
  }

  // If data is already an ArrayBuffer, return it directly
  return data as ArrayBuffer;
}
