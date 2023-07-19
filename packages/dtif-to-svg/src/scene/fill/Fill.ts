import { TFillsMixin } from '@pda/types/dtif';
import { appendPaint } from '../append';
import { D3Node, ShapeNode } from '../nodes';
import { Paint } from './paint';

export class Fill {
  private readonly _paints: Paint[] = [];
  private readonly _node: () => ShapeNode;

  // Init
  private _forInit: {
    paints: TFillsMixin['fills'];
  } | null;

  constructor(paints: TFillsMixin['fills'], node: ShapeNode) {
    this._forInit = {
      paints,
    };
    this._node = () => node;
  }

  public async init(parent: D3Node) {
    if (this._forInit == null) {
      return this;
    }
    const { paints } = this._forInit;

    // Append paints
    await Promise.all(
      paints.map(async (dtifPaint) => {
        // Create paint
        const paint = await appendPaint(parent, {
          fill: this,
          paint: dtifPaint,
        });
        if (paint != null) {
          // Add paint to fill
          this._paints.push(paint);
        }
      })
    );

    this._forInit = null;
    return this;
  }

  // ============================================================================
  // Getter & Setter
  // ============================================================================

  public get paints() {
    return this._paints;
  }

  public get node() {
    return this._node();
  }

  // ============================================================================
  // D3
  // ============================================================================

  public static async createFillWrapperD3Node(
    parent: D3Node,
    props: { id: string; clipPathId: string }
  ) {
    const { id, clipPathId } = props;

    // Create fill wrapper element
    // and set 'children' property to null because any children
    // appended to this wrapper are not considered in the context of the current node anymore
    const fillWrapperNode = parent.append('g', {
      id,
      attributes: {
        clipPath: `url(#${clipPathId})`,
      },
      children: null,
    });

    return fillWrapperNode;
  }
}
