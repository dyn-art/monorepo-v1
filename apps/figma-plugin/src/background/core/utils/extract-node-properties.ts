export function extractNodeProperties<
  TNode extends SceneNode,
  TNodePropertyKeys extends keyof TNode
>(
  node: TNode,
  properties: TNodePropertyKeys[]
): Pick<TNode, TNodePropertyKeys> {
  const serializableNode: Partial<Pick<TNode, TNodePropertyKeys>> = {};

  for (const property of properties) {
    const value = node[property];
    if (value !== null && value !== undefined && typeof value !== 'function') {
      serializableNode[property] = value;
    }
  }

  return serializableNode as Pick<TNode, TNodePropertyKeys>;
}
