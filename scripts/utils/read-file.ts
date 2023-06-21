import { pathToFileURL } from 'url';

async function importFresh(filePath: string) {
  const cacheBustingModulePath = `${pathToFileURL(filePath)}`;
  return (await import(cacheBustingModulePath)).default;
}

export async function readFile<T = unknown>(
  filePath: string
): Promise<T | null> {
  try {
    return await importFresh(filePath);
  } catch (error) {
    // do nothing
  }
  return null;
}
