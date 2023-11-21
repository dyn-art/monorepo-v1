export function getElementId(props: {
  type: string;
  index?: number;
  id: string;
  category?: string;
  isDefinition?: boolean;
}) {
  const { type, index, id, category, isDefinition = false } = props;
  return `${type}${index != null ? index : ''}_${
    category != null ? `${category}_` : ''
  }${id}${isDefinition ? `_def` : ''}`;
}
