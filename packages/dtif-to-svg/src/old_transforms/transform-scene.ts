import d3 from '@/d3';
import { appendAttributes, appendCSS } from '@/helpers/d3';
import { TScene } from '@pda/types/dtif';
import { TD3SVGElementSelection } from '../types';
import { appendNode } from './append-node';

export async function transformScene(scene: TScene) {
  // Create element
  const svg = (await d3()).create('svg');
  appendAttributes(svg, {
    version: '1.1',
    xmlns: 'http://www.w3.org/2000/svg',
    width: scene.width,
    height: scene.height,
    fill: 'none',
    viewBox: [0, 0, scene.width, scene.height],
  });
  appendCSS(svg, {
    printColorAdjust: 'exact',
  });

  // Append children
  appendDescElement(svg, { desc: scene.name });
  await appendNode(svg, { node: scene.root });

  return svg;
}

function appendDescElement(
  parent: TD3SVGElementSelection,
  props: { desc: string }
) {
  return parent.append('desc').text(props.desc);
}
