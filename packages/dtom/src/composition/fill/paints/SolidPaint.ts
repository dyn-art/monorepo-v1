import { rgbToCSS } from '@/helpers/css';
import { TRGB, TSolidPaint } from '@pda/types/dtif';
import colorConvert from 'color-convert';
import { RemoveFunctions, Watcher } from '../../Watcher';
import { D3Node, ShapeNode } from '../../nodes';
import { Fill } from '../Fill';
import { Paint } from './Paint';

export class SolidPaint extends Paint {
  private _color: TRGB;

  // D3 ids
  private readonly _d3RootNodeId: string;
  private readonly _d3PaintNodeId: string;

  protected readonly _watcher: Watcher<TWatchedSolidPaint>;

  // Init
  private _forInit: {
    paint: TSolidPaint;
  } | null;

  constructor(paint: TSolidPaint, fill: Fill) {
    super(paint, fill, { type: 'solid' });
    this._forInit = {
      paint,
    };
    this._color = paint.color;

    // Define D3 node ids
    this._d3RootNodeId = this.getD3NodeId();
    this._d3PaintNodeId = this.getD3NodeId('paint');
  }

  public async init(parent: D3Node) {
    if (this._forInit == null) {
      return this;
    }
    const { paint } = this._forInit;

    // Create D3 node
    this._d3Node = await SolidPaint.createD3Node(parent, {
      paint,
      node: this.fill.node,
      ids: {
        rootNodeId: this._d3RootNodeId,
        paintNodeId: this._d3PaintNodeId,
      },
    });

    this._forInit = null;
    return this;
  }

  // ============================================================================
  // Getter & Setter
  // ============================================================================

  public get color() {
    return this._color;
  }

  public set color(value: TRGB) {
    this._color = value;
    this._d3Node?.getChildNodeById(this._d3PaintNodeId)?.updateStyles({
      fill: rgbToCSS(value),
    });
    this._watcher.notify('color', value);
  }

  public getHex() {
    return `#${colorConvert.rgb.hex([
      Math.round(this._color.r * 255),
      Math.round(this._color.g * 255),
      Math.round(this._color.b * 255),
    ])}`;
  }

  public setHex(value: `#${string}`) {
    const rgb = colorConvert.hex.rgb(value.replace('#', ''));
    this.color = {
      r: Math.round(rgb[0] / 255),
      g: Math.round(rgb[1] / 255),
      b: Math.round(rgb[2] / 255),
    };
  }

  // ============================================================================
  // D3
  // ============================================================================

  public static async createD3Node(
    parent: D3Node,
    props: {
      paint: TSolidPaint;
      node: ShapeNode;
      ids: {
        rootNodeId: string;
        paintNodeId: string;
      };
    }
  ) {
    const {
      ids: { rootNodeId, paintNodeId },
      paint,
      node,
    } = props;

    // Create root element
    const root = await Paint.createPaintWrapperD3Node(parent, {
      id: rootNodeId,
      paint,
    });

    // Create paint element
    root.append('rect', {
      id: paintNodeId,
      attributes: {
        height: node.height,
        width: node.width,
      },
      styles: {
        fill: rgbToCSS(paint.color),
      },
    });

    return root;
  }
}

type TWatchedSolidPaint = RemoveFunctions<SolidPaint>;
