import { RawFetchClientThrow } from '@pda/openapi-fetch';
import { d3 } from './d3';

import * as opentype from 'opentype.js';

const fetchClient = new RawFetchClientThrow();

async function loadFont(url: string): Promise<opentype.Font> {
  const buffer = await fetchClient.getThrow<ArrayBuffer>(url, {
    parseAs: 'arrayBuffer',
  });
  return opentype.parse(buffer);
}

export async function renderText(url: string, input: string, fontSize = 72) {
  const font = await loadFont(url);

  const textSvg = font.getPath(input, 0, 150, fontSize);
  const path = textSvg.toPathData(2);
  const textBB = textSvg.getBoundingBox();
  const width = textBB.x2 - textBB.x1;
  const height = textBB.y2 - textBB.y1;

  const svg = (await d3()).create('svg').attr('viewBox', [0, 0, width, height]);

  svg.append('path').attr('d', path);

  return svg.node()?.outerHTML;
}
