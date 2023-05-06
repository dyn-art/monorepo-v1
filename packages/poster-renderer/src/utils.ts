import crypto from 'crypto';

export function hashObject(obj: unknown): string {
  return crypto.createHash('md5').update(JSON.stringify(obj)).digest('hex');
}
