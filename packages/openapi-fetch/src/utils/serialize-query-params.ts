/**
 * Serializes an object into URL query parameters.
 *
 * @param {Record<string, any>} queryParams - An object to be serialized
 * @returns {string} - Returns serialized query parameters
 */
export function serializeQueryParams(queryParams = {}) {
  if (typeof URLSearchParams === 'function') {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    }
    return searchParams.toString();
  } else {
    // Fallback for environments that do not support URLSearchParams
    return Object.entries(queryParams)
      .filter(([, value]) => value != null)
      .map(
        ([key, value]) =>
          encodeURIComponent(key) + '=' + encodeURIComponent(String(value))
      )
      .join('&');
  }
}
