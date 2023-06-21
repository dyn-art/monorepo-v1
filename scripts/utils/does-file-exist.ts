import fs from 'fs';

export function doesFileExist(path: string): boolean {
  try {
    return fs.existsSync(path);
  } catch (error) {
    // do nothing
  }
  return false;
}
