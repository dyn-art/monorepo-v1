import { bundle as bundleRemotion } from '@remotion/bundler';
import path from 'path';
import { webpackOverride } from '../ui/webpack-override';

const ENTRY = path.join(__dirname, '../ui/src/index.ts');
const OUT = path.join(__dirname, '../bundle');

async function run() {
  // Bundle Remotion via Webpack
  const remotionPath = path.resolve(ENTRY);
  const onProgress = (progress) => {
    console.log(`Webpack bundling progress: ${progress}%`);
  };
  const bundleLocation = await bundleRemotion({
    entryPoint: remotionPath,
    onProgress,
    webpackOverride: (config) => webpackOverride(config),
    enableCaching: true,
    outDir: OUT,
  });

  console.log(
    `Created new Webpack bundle of remotion renders at '${bundleLocation}'`
  );
}

run();
