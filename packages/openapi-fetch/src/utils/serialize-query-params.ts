/**
 * Serializes an object into URL query parameters.
 *
 * @param {Record<string, any>} queryParams - An object to be serialized
 * @returns {string} - Returns serialized query parameters
 */
export function serializeQueryParams(
  queryParams: Record<string, any> = {}
): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  }
  return searchParams.toString();
}
