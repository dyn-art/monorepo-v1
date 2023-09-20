export function getBucketURLFromHash(hash: string): string {
  // TODO: add url as env
  return `https://dyn-bucket.fra1.digitaloceanspaces.com/${hash}`;
}
