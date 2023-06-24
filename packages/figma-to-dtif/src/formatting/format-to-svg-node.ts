import {
  ENodeTypes,
  TEffect,
  TSVGNode,
  TSVGNodeExported,
  TSVGNodeInline,
} from '@pda/dtif-types';
import { svgParser } from '@pda/svgson';
import { logger } from '../logger';
import { TSVGCompatibleNode } from '../types';
import {
  convert2DMatrixTo3DMatrix,
  exportAndUploadNode,
  exportNodeCloned,
} from '../utils';
import { TFormatNodeOptions } from './format-frame-to-scene';

export async function formatToSvgNode(
  node: TSVGCompatibleNode,
  options: TFormatNodeOptions
): Promise<TSVGNode> {
  const baseNodeProperties = {
    type: ENodeTypes.SVG,
    // BaseNode mixin
    id: node.id,
    name: node.name,
    // SceneNode mixin
    isLocked: node.locked,
    isVisible: node.visible,
    // Layout mixin
    height: node.height,
    width: node.width,
    relativeTransform: convert2DMatrixTo3DMatrix(node.relativeTransform),
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    effects: node.effects as TEffect[],
  };
  let svgNode: TSVGNode;

  // Handle inline SVG
  if (options.inlineSVG) {
    const rawUint8Array = await exportNodeCloned(node, { format: 'SVG' });
    const raw = new TextDecoder().decode(rawUint8Array);
    const svgObject = svgParser.parse(raw);
    svgNode = {
      exported: false,
      attributes: svgObject.attributes,
      children: svgObject.children,
      ...baseNodeProperties,
    } as TSVGNodeInline;
  }

  // Handle to export SVG
  else {
    const { hash, data, uploaded } = await exportAndUploadNode(node, {
      uploadStaticData: options.uploadStaticData,
      exportSettings: { format: 'SVG' },
    });
    svgNode = {
      exported: true,
      format: 'SVG',
      hash,
      inline: uploaded ? undefined : data,
      ...baseNodeProperties,
    } as TSVGNodeExported;
  }

  logger.success(`Formatted '${node.type}' node '${node.name}' to SVG.`);

  return svgNode;
}
