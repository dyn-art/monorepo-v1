export function getObjectPropertyKeys(obj: Record<string, any>) {
  const properties: string[] = [];
  for (const key in obj) {
    properties.push(key);
  }
  return properties;
}
