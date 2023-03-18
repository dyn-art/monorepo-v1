import { getCompositions, renderStill } from '@remotion/renderer';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { getWebpackBundleLocation } from './bundler';
import { hashObject } from './utils';

async function getCompositionByName(
  compositionName: string,
  inputProps: Record<string, any> = {}
) {
  // Get compositions from webpack bundle
  const webpackBundleLocation = await getWebpackBundleLocation();
  const compositions = await getCompositions(webpackBundleLocation, {
    inputProps,
  });

  // Find composition
  const composition = compositions.find((c) => c.id === compositionName);

  return composition ?? null;
}

export async function renderByCompositionName(
  compositionName: string,
  imageFormat: 'jpeg' | 'png' = 'png',
  inputProps: Record<string, any> = {},
  dumpBrowserLogs = false
): Promise<{ outputPath: string; clear: () => Promise<void> }> {
  // Calculate a unique identifier for the image
  const hash = hashObject(
    JSON.stringify({
      compositionName,
      imageFormat,
      inputProps,
    })
  );

  const tempDir = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), 'remotion-')
  );
  const outputPath = `${path.join(tempDir, hash)}.${imageFormat}`;
  const webpackBundleLocation = await getWebpackBundleLocation();
  const composition = await getCompositionByName(compositionName, inputProps);

  // Render image to 'output' in temp dir
  if (composition != null) {
    await renderStill({
      composition,
      serveUrl: webpackBundleLocation,
      output: outputPath,
      inputProps,
      imageFormat,
      dumpBrowserLogs,
      scale: 3,
    });
  }

  return {
    outputPath,
    clear: async () => {
      // Delete file at output path
      await fs.promises.unlink(outputPath);
    },
  };
}
