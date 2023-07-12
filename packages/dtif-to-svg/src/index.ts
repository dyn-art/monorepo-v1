import { d3 } from './d3';

export async function dtifToSVG() {
  const svg = (await d3())
    .select('body')
    .append('svg')
    .attr('width', 500)
    .attr('height', 500);

  const defs = svg.append('defs');

  const gradient = defs
    .append('linearGradient')
    .attr('id', 'gradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '100%');

  gradient.append('stop').attr('offset', '0%').attr('stop-color', 'blue');

  gradient.append('stop').attr('offset', '100%').attr('stop-color', 'red');

  for (let i = 0; i < 100; i++) {
    svg
      .append('rect')
      .attr('x', i * 5)
      .attr('y', i * 5)
      .attr('width', 50)
      .attr('height', 50)
      .attr('fill', 'url(#gradient)');
  }

  return (await d3()).select('body').html();
}
