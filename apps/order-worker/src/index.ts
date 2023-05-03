import { renderByCompositionName } from '@pda/product-renderer';

async function run() {
  const { outputPath, clear } = await renderByCompositionName(
    'spotify-player-v1',
    'png'
  );
  console.log(outputPath);
}
run();
