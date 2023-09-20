import { NodeException } from './NodeException';

export class UnsupportedFigmaPaintException extends NodeException {
  constructor(paint: Paint, node: SceneNode) {
    super(
      `The Figma paint of the type '${paint.type}' in node '${node.name}' is not supported yet!`,
      node
    );
  }
}
