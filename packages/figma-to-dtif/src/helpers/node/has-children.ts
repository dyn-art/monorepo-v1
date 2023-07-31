export function hasChildren(obj: any): obj is ChildrenMixin {
  return obj != null && typeof obj === 'object' && 'children' in obj;
}
