import { TContentType } from '../format-node-to-dtif';

export function getImageType(imageData?: Uint8Array): TContentType | null {
  if (imageData == null || imageData.length < 4) {
    return null;
  }

  // Try to detect image type based on first bytes
  const firstBytes = imageData.slice(0, 4);
  if (
    firstBytes[0] === 0x89 &&
    firstBytes[1] === 0x50 &&
    firstBytes[2] === 0x4e &&
    firstBytes[3] === 0x47
  ) {
    return {
      name: 'png',
      mimeType: 'image/png',
      ending: '.png',
    };
  }
  if (firstBytes[0] === 0xff && firstBytes[1] === 0xd8) {
    return {
      name: 'jpeg',
      mimeType: 'image/jpeg',
      ending: '.jpeg',
    };
  }
  if (
    firstBytes[0] === 0x47 &&
    firstBytes[1] === 0x49 &&
    firstBytes[2] === 0x46 &&
    firstBytes[3] === 0x38
  ) {
    return {
      name: 'gif',
      mimeType: 'image/gif',
      ending: '.gif',
    };
  }
  if (firstBytes[0] === 0x42 && firstBytes[1] === 0x4d) {
    return {
      name: 'bmp',
      mimeType: 'image/bmp',
      ending: '.bmp',
    };
  }
  if (
    firstBytes[0] === 0x49 &&
    firstBytes[1] === 0x49 &&
    firstBytes[2] === 0x2a &&
    firstBytes[3] === 0x00
  ) {
    return {
      name: 'tiff',
      mimeType: 'image/tiff',
      ending: '.tiff',
    };
  }

  // Try to detect image type based on text content
  const firstChars = decodeBytesToString(imageData.slice(0, 50)).trim();
  if (firstChars.startsWith('<svg')) {
    return {
      name: 'svg',
      mimeType: 'image/svg+xml',
      ending: '.svg',
    };
  }

  return null;
}

function decodeBytesToString(bytes: Uint8Array) {
  let decodedString = '';
  for (let i = 0; i < bytes.length; i++) {
    decodedString += String.fromCharCode(bytes[i]);
  }
  return decodedString;
}
