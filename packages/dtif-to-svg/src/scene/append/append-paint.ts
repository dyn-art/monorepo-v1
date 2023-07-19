import { TPaint } from '@pda/types/dtif';
import { Fill, SolidPaint } from '../fill';
import { Paint } from '../fill/paint/Paint';
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
