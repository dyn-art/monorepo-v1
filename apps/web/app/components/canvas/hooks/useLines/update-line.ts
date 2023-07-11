import { TLine } from '.';

export function updateLine(
  line: TLine,
  word: string,
  wordWidth: number,
  wordHeight: number,
  spaceWidth: number,
  isLastWord: boolean
) {
  line.words.push(word);
  // Update line width
  line.width = line.width + wordWidth + (isLastWord ? 0 : spaceWidth);
  // Update average line height
  line.height =
    (line.height * (line.words.length - 1) + wordHeight) / line.words.length;
}
