import { TD3SVGElementSelection } from '@/types';
import {
  TEffectsMixin,
  TFillsMixin,
  TGeometryMixin,
  TRectangleCornerMixin,
  TRectangleNode,
} from '@pda/types/dtif';
import { Node } from './Node';

export class Rectangle extends Node {
  private readonly _cornerMixin: TRectangleCornerMixin;
  private readonly _fillsMixin: TFillsMixin;
  private readonly _effectsMixin: TEffectsMixin;
  private readonly _geometryMixin: TGeometryMixin;

  constructor(parent: TD3SVGElementSelection, node: TRectangleNode) {
    super(parent, node);
  }
}
