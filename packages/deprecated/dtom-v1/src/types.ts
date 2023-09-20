import type { BaseType, Selection } from 'd3-selection';

export type TD3Selection<GElement extends BaseType> = Selection<
  GElement,
  undefined,
  null,
  undefined
>;

export type TD3SVGElementSelection = TD3Selection<SVGElement>;
