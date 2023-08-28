import * as XXH from 'xxhashjs';

export function h64(data: unknown): string {
  let stringifiedData: string;

  if (typeof data === 'string') {
    stringifiedData = data;
  } else if (Array.isArray(data)) {
    stringifiedData = data.join('-');
  } else {
    stringifiedData = JSON.stringify(data);
  }

  const hash = XXH.h64(stringifiedData, 0xabcd);
  return hash.toString(16);
}
