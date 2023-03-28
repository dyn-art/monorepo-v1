import path from 'path';

export function getWebpackBundleLocation(): string {
  return path.join(__dirname, '../bundle');
}
