export function log(...data: any[]) {
  if (typeof data[0] === 'string') {
    data[0] = `PDA: ${data[0]}`;
  }
  console.log(...data);
}
