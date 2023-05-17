/**
 * Generates a random SHA256 like id.
 *
 * @returns A string representation of the generated SHA256 like id.
 */
export function randomSHA256Like(): string {
  const hexChars = '0123456789abcdef';
  const length = 64; // SHA256 has a length of 64 hex chars
  let randomId = '';

  for (let i = 0; i < length; i++) {
    randomId += hexChars[Math.floor(Math.random() * hexChars.length)];
  }

  return randomId;
}
