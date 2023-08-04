import { getElementId } from '@/helpers/other';
import { TBlendMode, TPaint } from '@pda/types/dtif';
import { RemoveFunctions, Watcher } from '../../Watcher';
import { D3Node } from '../../nodes';
import { Fill } from '../Fill';

export class Paint {
  protected readonly _type: string;

  // Base paint mixin
  protected _opacity: number;
  protected _blendMode: TBlendMode;
  protected _isVisible: boolean;

  protected readonly _watcher: Watcher<TWatchedPaint>;
  protected readonly _fill: () => Fill;

  // D3
  protected _d3Node: D3Node | null;

  constructor(paint: TPaint, fill: Fill, options: TPaintOptions = {}) {
    const { type = 'paint' } = options;
    this._opacity = paint.opacity;
    this._blendMode = paint.blendMode;
    this._isVisible = paint.isVisible;
    this._watcher = new Watcher();
    this._fill = () => fill;
    this._type = type;
    this._d3Node = null; // Set by sub class
  }

  // ============================================================================
  // Getter & Setter
  // ============================================================================

  public get fill() {
    return this._fill();
  }

  // ============================================================================
  // D3
  // ============================================================================

  protected getD3NodeId(category?: string, isDefinition = false) {
    return getElementId({
      id: this.fill.node.id,
      type: this._type,
      category,
      isDefinition,
    });
  }

  public static async createPaintWrapperD3Node(
    parent: D3Node,
    props: { paint: TPaint; id: string }
  ) {
    const { id, paint } = props;

    // Create node root element
    const rootWrapperNode = parent.append('g', {
      id,
      styles: {
        display: paint.isVisible ? 'block' : 'none',
        opacity: paint.opacity,
      },
    });

    return rootWrapperNode;
  }
}

type TWatchedPaint = RemoveFunctions<Paint>;

export type TPaintOptions = {
  type?: string;
};
