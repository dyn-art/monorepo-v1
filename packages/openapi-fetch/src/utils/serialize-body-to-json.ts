/**
 * Serializes an object into a JSON string.
 *
 * @param {any} body - An object to be serialized
 * @returns {string} - Returns serialized JSON string
 */
export function serializeBodyToJson(body: any): string {
  try {
    return JSON.stringify(body);
  } catch (error) {
    return body;
  }
}
