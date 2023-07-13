import d3 from '@/d3';
import { applyCSSToD3 } from '@/helpers/d3';
import { TScene } from '@pda/types/dtif';
import { TD3SVGElementSelection } from '../types';
import { appendNode } from './append-node';

export async function transformScene(scene: TScene) {
  // Create element
  const svg = (await d3())
    .create('svg')
    .attr('version', '1.1')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('width', scene.width)
    .attr('height', scene.height)
    .attr('fill', 'none')
    .attr('viewBox', [0, 0, scene.width, scene.height]);

  // Apply styles
  applyCSSToD3(svg, {
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
