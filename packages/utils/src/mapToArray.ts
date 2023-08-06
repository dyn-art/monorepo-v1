export function mapToArray<GKey, GValue>(
  map: Map<GKey, GValue>
): {
  key: GKey;
  value: GValue;
}[] {
  return Array.from(map, ([key, value]) => ({ key, value }));
}

export function mapToValueArray<GKey, GValue>(
  map: Map<GKey, GValue>
): GValue[] {
  return Array.from(map, ([, value]) => value);
}

export function mapToKeyArray<GKey, GValue>(map: Map<GKey, GValue>): GKey[] {
  return Array.from(map, ([key]) => key);
}
