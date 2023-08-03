import { Composition } from './Composition';
import { TTransformNodeOptions } from './types';

export async function toComposition(
  node: FrameNode,
  options: TTransformNodeOptions
) {
  const composition = new Composition(node);
  return composition.transform(options);
}
