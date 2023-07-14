import { TD3SVGElementSelection } from '@/types';
import { appendAttributes } from './append-attributes';

export async function appendClipPath<GClipElementProps>(
  parent: TD3SVGElementSelection,
  props: {
    clipPathId: string;
    clipElement: TClipElement<GClipElementProps>;
  }
) {
  // Create element
  const defsElement = parent.append('defs');

  // Append children
  await appendClipPathElement<GClipElementProps>(defsElement, props);

  return defsElement;
}

async function appendClipPathElement<GClipElementProps>(
  parent: TD3SVGElementSelection,
  props: {
    clipPathId: string;
    clipElement: TClipElement<GClipElementProps>;
  }
) {
  const { clipPathId, clipElement } = props;

  // Create element
  const clipPathElement = parent.append('clipPath');
  appendAttributes(clipPathElement, { id: clipPathId });

  // Append children
  await clipElement.callback(clipPathElement, clipElement.props);

  return clipPathElement;
}

export type TClipElementCallback<GClipElementProps> = (
  parent: TD3SVGElementSelection,
  props: GClipElementProps
) => Promise<TD3SVGElementSelection>;

export type TClipElement<GClipElementProps> = {
  props: GClipElementProps;
  callback: TClipElementCallback<GClipElementProps>;
};
