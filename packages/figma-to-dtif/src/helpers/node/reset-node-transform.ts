export function resetNodeTransform(node: SceneNode): SceneNode {
  if ('x' in node) {
    node.x = 0;
  }
  if ('y' in node) {
    node.y = 0;
  }
  if ('rotation' in node) {
    node.rotation = 0;
  }
  node.relativeTransform = [
    [1, 0, 0],
    [0, 1, 0],
  ];
  return node;
}
