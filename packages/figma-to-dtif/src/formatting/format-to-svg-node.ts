import {
  ENodeTypes,
  TEffect,
  TSVGNode,
  TSVGNodeExported,
  TSVGNodeInline,
} from '@pda/dtif-types';
import { svgParser } from '@pda/svgson';
import { logger } from '../logger';
import { TSVGCompatibleNode, TSVGOptions } from '../types';
import {
  convert2DMatrixTo3DMatrix,
  exportAndUploadNode,
  exportNodeCloned,
} from '../utils';

export async function formatToSvgNode(
  node: TSVGCompatibleNode,
  options: TSVGOptions = {}
): Promise<TSVGNode> {
  const {
    inline = true,
    exportOptions: { svgToRaster = false, uploadStaticData } = {},
  } = options;

  const baseNodeProperties: Partial<TSVGNode> = {
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
  if (inline) {
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
      uploadStaticData,
      exportSettings: { format: svgToRaster ? 'JPG' : 'SVG' },
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
