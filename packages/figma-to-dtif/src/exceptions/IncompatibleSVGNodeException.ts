import { NodeException } from './NodeException';

export class IncompatibleSVGNodeException extends NodeException {
  constructor(node: SceneNode) {
    super(`The node '${node.name}' can not be transformed into a SVG!`, node);
  }
}
