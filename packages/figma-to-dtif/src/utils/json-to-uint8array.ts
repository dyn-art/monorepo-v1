export function stringToUint8Array(value: string): Uint8Array {
  const uint8Array = new Uint8Array(value.length);
  for (let i = 0; i < value.length; i++) {
    uint8Array[i] = value.charCodeAt(i);
  }
  return uint8Array;
}
