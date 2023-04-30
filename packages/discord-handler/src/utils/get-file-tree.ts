import fs, { Dirent } from 'fs';

// TODO: find cache busting mechanism that works with NodeJs
async function importFresh(filePath: string) {
  const cacheBustingModulePath = `${filePath}`;
  return (await import(cacheBustingModulePath)).default;
}

export async function readFile<T = unknown>(
  filePath: string
): Promise<T | null> {
  try {
    return await importFresh(filePath);
  } catch (error) {
    console.error(`Failed to resolve file at path: '${filePath}'`, error);
  }
  return null;
}

export function readDir(dirPath: string): Dirent[] {
  try {
    return fs.readdirSync(dirPath, {
      withFileTypes: true, // Allows to detect folders (via isDirectory())
    });
  } catch (error) {
    console.error(`Failed to resolve directory at path: '${dirPath}'`, error);
  }
  return [];
}

export async function getFilesTree(
  path: string,
  config: { suffixes?: string[]; toIgnoreSuffixes?: string[] } = {}
): Promise<TDirectory> {
  const { suffixes = ['.js', '.ts'], toIgnoreSuffixes = ['.d.ts'] } = config;
  const fileTree: TDirectory = {
    type: 'directory',
    name: path.replace(/^.*[\\\\/]/, ''), // Replace everything in front of the last '/'
    path,
    content: [],
  };
  const files = readDir(path);

  for (const file of files) {
    // Handle directory
    if (file.isDirectory()) {
      const directory = await getFilesTree(`${path}/${file.name}`, {
        suffixes,
        toIgnoreSuffixes,
      });
      fileTree.content.push(directory);
      continue;
    }

    // Handle file with suffix (e.g. ['.js', '.ts'])
    if (
      (suffixes.length === 0 ||
        suffixes.some((suffix) => file.name.endsWith(suffix))) &&
      (toIgnoreSuffixes.length === 0 ||
        !toIgnoreSuffixes.some((toIgnoreSuffix) =>
          file.name.endsWith(toIgnoreSuffix)
        ))
    ) {
      const filePath = `${path}/${file.name}`;
      const fileContent = await readFile(filePath);
      fileTree.content.push({
        type: 'file',
        name: filePath
          .replace(/^.*[\\\\/]/, '') // Replace everything in front of the last '/'
          .replace(/\..*$/, ''), // Replace everything after the last '.' (-> '.ts')
        path: filePath,
        content: fileContent,
      });
    }
  }

  return fileTree;
}

export function flattenFileTree(
  fileTree: TDirectory,
  ignorePrefix = true
): TFile[] {
  const files: TFile[] = [];
  for (const content of fileTree.content) {
    if (content.type === 'directory') {
      const updatedDirectory = ignorePrefix
        ? content
        : {
            ...content,
            name: `${fileTree.name}.${content.name}`,
          };
      files.push(...flattenFileTree(updatedDirectory, false));
    } else if (content.type === 'file') {
      const updatedFile = ignorePrefix
        ? content
        : {
            ...content,
            name: `${fileTree.name}.${content.name}`,
          };
      files.push(updatedFile);
    }
  }
  return files;
}

export type TFile<T = unknown> = {
  type: 'file';
  name: string;
  path: string;
  content: T;
};

export type TDirectory = {
  type: 'directory';
  name: string;
  path: string;
  content: (TFile | TDirectory)[];
};
