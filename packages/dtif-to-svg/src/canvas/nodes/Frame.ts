import { TD3SVGElementSelection } from '@/types';
import {
  TEffectsMixin,
  TFillsMixin,
  TFrameNode,
  TGeometryMixin,
  TRectangleCornerMixin,
} from '@pda/types/dtif';
import { Scene } from '../Scene';
import { Node } from './Node';

export class Frame extends Node<Frame> {
  // Mixins
  private readonly _cornerMixin: TRectangleCornerMixin;
  private readonly _fillsMixin: TFillsMixin;
  private readonly _effectsMixin: TEffectsMixin;
  private readonly _geometryMixin: TGeometryMixin;

  private readonly _childrenIds: string[];

  // D3 ids
  private readonly _d3RootNodeId: string;
  private readonly _d3ContentClipPathId: string;
  private readonly _d3ContentClipPathDefsNodeId: string;
  private readonly _d3ContentClippedShapeNodeId: string;
  private readonly _d3FillClipPathId: string;
  private readonly _d3FillClipPathDefsNodeId: string;
  private readonly _d3FillClippedShapeNodeId: string;
  private readonly _d3ContentNodeId: string;
  private readonly _d3ChildrenNodeId: string;

  constructor(parent: TD3SVGElementSelection, node: TFrameNode, scene: Scene) {
    super(node, scene, { type: 'frame' });

    // Apply mixins
    this._cornerMixin = {
      bottomLeftRadius: node.bottomLeftRadius,
      bottomRightRadius: node.bottomRightRadius,
      topLeftRadius: node.topLeftRadius,
      topRightRadius: node.topRightRadius,
    };
    this._fillsMixin = {
      fills: node.fills,
    };
    this._effectsMixin = {
      effects: node.effects,
    };
    this._geometryMixin = {
      fillGeometry: node.fillGeometry,
      strokeGeometry: node.strokeGeometry,
    };

    // Define D3 node ids
    this._d3RootNodeId = this.getD3NodeId();
    this._d3ContentClipPathId = this.getD3NodeId('content-clip', true);
    this._d3ContentClipPathDefsNodeId = this.getD3NodeId('content-defs');
    this._d3ContentClippedShapeNodeId = this.getD3NodeId(
      'content-clipped-shape'
    );
    this._d3FillClipPathId = this.getD3NodeId('fill-clip', true);
    this._d3FillClipPathDefsNodeId = this.getD3NodeId('fill-defs');
    this._d3FillClippedShapeNodeId = this.getD3NodeId('fill-clipped-shape');
    this._d3ContentNodeId = this.getD3NodeId('content');
    this._d3ChildrenNodeId = this.getD3NodeId('children');

    // Create D3 node
    Frame.createD3Node(parent, {
      node,
      ids: {
        rootNodeId: this._d3RootNodeId,
        contentClipPathId: this._d3ContentClipPathId,
        contentClipPathDefsNodeId: this._d3ContentClipPathDefsNodeId,
        contentClippedShapeNodeId: this._d3ContentClippedShapeNodeId,
        fillClipPathId: this._d3FillClipPathId,
        fillClipPathDefsNodeId: this._d3FillClipPathDefsNodeId,
        fillClippedShapeNodeId: this._d3FillClippedShapeNodeId,
        contentNodeId: this._d3ContentNodeId,
        childrenNodeId: this._d3ChildrenNodeId,
      },
    });
  }

  // ============================================================================
  // Getter & Setter
  // ============================================================================

  // ============================================================================
  // D3
  // ============================================================================

  public static async createD3Node(
    parent: TD3SVGElementSelection,
    props: {
      node: TFrameNode;
      ids: {
        rootNodeId: string;
        contentClipPathId: string;
        contentClipPathDefsNodeId: string;
        contentClippedShapeNodeId: string;
        fillClipPathId: string;
        fillClipPathDefsNodeId: string;
        fillClippedShapeNodeId: string;
        contentNodeId: string;
        childrenNodeId: string;
      };
    }
  ) {
    const {
      ids: {
        rootNodeId,
        contentClipPathId,
        contentClipPathDefsNodeId,
        contentClippedShapeNodeId,
        fillClipPathId,
        fillClipPathDefsNodeId,
        fillClippedShapeNodeId,
        contentNodeId,
        childrenNodeId,
      },
      node,
    } = props;

    // Create root element
    const root = Node.createRootD3Node(parent, {
      node: props.node,
      id: rootNodeId,
    });

    // Create content element
    const contentNode = root.append('g', {
      id: contentNodeId,
      attributes: {
        clipPath: node.clipsContent ? `url(#${contentClipPathId})` : undefined,
      },
    });

    // Create fill clip path element
    const fillClipPathDefsNode = contentNode.append('defs', {
      id: fillClipPathDefsNodeId,
    });
    const fillClipPathNode = fillClipPathDefsNode.append('clipPath', {
      id: fillClipPathId,
    });
    fillClipPathNode.append('rect', {
      id: fillClippedShapeNodeId,
      attributes: {
        width: node.width,
        height: node.height,
      },
    });

    // Create fill element
    // TODO:

    // Create child elements
    const childrenNode = root.append('g', { id: childrenNodeId });
    node.children.map((child) => {
      // TODO:
    });

    // Create content clip path element
    if (node.clipsContent) {
      const contentClipPathDefsNode = contentNode.append('defs', {
        id: contentClipPathDefsNodeId,
      });
      const contentClipPathNode = contentClipPathDefsNode.append('clipPath', {
        id: fillClipPathId,
      });
      contentClipPathNode.append('rect', {
        id: contentClippedShapeNodeId,
        attributes: {
          width: node.width,
          height: node.height,
        },
      });
    }
  }
}
