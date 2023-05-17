import CryptoJS from 'crypto-js';

export function sha256(data: Uint8Array | string): string {
  const hash = CryptoJS.SHA256(
    typeof data === 'string' ? data : data.join('-')
  );
  return hash.toString(CryptoJS.enc.Hex);
}
