import fs, { Dirent } from 'fs';

export async function readFile<T = unknown>(filePath: string): Promise<T> {
  return await import(filePath);
}

export function readDir(dirPath: string): Dirent[] {
  return fs.readdirSync(dirPath, {
    withFileTypes: true, // Allows to detect folders (via isDirectory())
  });
}

export async function getFilesTree(
  path: string,
  suffixes: string[]
): Promise<TDirectory> {
  const fileTree: TDirectory = {
    type: 'directory',
    name: path.replace(/^.*[\\\\/]/, ''),
    path,
    content: [],
  };
  const files: Dirent[] = fs.readdirSync(path, {
    withFileTypes: true, // Allows to detect folders (via isDirectory())
  });

  for (const file of files) {
    // Handle directory
    if (file.isDirectory()) {
      const directory = await getFilesTree(`${path}/${file.name}`, suffixes);
      fileTree.content.push(directory);
      continue;
    }

    // Handle file with suffix (e.g. ['.js', '.ts'])
    for (const suffix of suffixes) {
      if (file.name.endsWith(suffix)) {
        const filePath = `${path}/${file.name}`;
        const fileContent = await readFile(filePath);
        fileTree.content.push({
          type: 'file',
          name: filePath.replace(/^.*[\\\\/]/, ''),
          path: filePath,
          content: fileContent,
        });
        break;
      }
    }
  }

  return fileTree;
}

type TFile<T = unknown> = {
  type: 'file';
  name: string;
  path: string;
  content: T;
};

type TDirectory = {
  type: 'directory';
  name: string;
  path: string;
  content: (TFile | TDirectory)[];
};
