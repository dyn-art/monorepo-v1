// TODO: change to digitalocean bucket as drive restricts automated requests
export function getBucketPath(fileName: string): string {
  return `https://pda-bucket.fra1.cdn.digitaloceanspaces.com/${fileName}`;
}
