import * as CryptoJS from 'crypto-js';

export function sha256(data: unknown): string {
  let stringifiedData: string;

  if (typeof data === 'string') {
    stringifiedData = data;
  } else if (Array.isArray(data)) {
    stringifiedData = data.join('-');
  } else {
    stringifiedData = JSON.stringify(data);
  }

  const hash = CryptoJS.SHA256(stringifiedData);
  return hash.toString(CryptoJS.enc.Hex);
}
