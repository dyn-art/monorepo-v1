import fs, { Dirent } from 'fs';

export function getFilePaths(dir: string, suffixes: string[]): string[] {
  let fileNames: string[] = [];
  const files: Dirent[] = fs.readdirSync(dir, {
    withFileTypes: true, // Allows to detect folders (via isDirectory())
  });

  for (const file of files) {
    // Handle directory
    if (file.isDirectory()) {
      fileNames = [
        ...fileNames,
        ...getFilePaths(`${dir}/${file.name}`, suffixes),
      ];
      continue;
    }

    // Handle file with suffix (e.g. ['.js', '.ts'])
    for (const suffix of suffixes) {
      if (file.name.endsWith(suffix)) {
        fileNames.push(`${dir}/${file.name}`);
        break;
      }
    }
  }

  return fileNames;
}
