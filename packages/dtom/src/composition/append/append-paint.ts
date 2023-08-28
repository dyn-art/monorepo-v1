import { TPaint } from '@dyn/types/dtif';
import { Fill, Paint, SolidPaint } from '../fill';
import { D3Node } from '../nodes';

export async function appendPaint(
  parent: D3Node,
  props: { paint: TPaint; fill: Fill }
): Promise<Paint | null> {
  const { paint, fill } = props;
  switch (paint.type) {
    case 'SOLID':
      return new SolidPaint(paint, fill).init(parent);
    default:
      return null;
  }
}
