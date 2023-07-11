import { TLine } from '.';

export function createNewLine(
  word: string,
  wordWidth: number,
  wordHeight: number,
  index: number
): TLine {
  return {
    words: [word],
    width: wordWidth,
    height: wordHeight,
    x: 0,
    y: 0,
    index: index,
  };
}
