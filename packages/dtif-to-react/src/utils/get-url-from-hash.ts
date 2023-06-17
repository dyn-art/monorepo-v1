export function getS3BucketURLFromHash(hash: string): string {
  // TODO: add url as env
  return `https://pda-bucket.fra1.digitaloceanspaces.com/${hash}`;
}
