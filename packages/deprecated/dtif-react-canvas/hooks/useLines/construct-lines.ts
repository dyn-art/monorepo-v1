import { TLine } from '.';
import { TWordWithWidth } from '../useTextDimensions';

export function constructLines(props: {
  spaceWidth: number;
  lines: TWordWithWidth[][];
  width: number;
}): TLine[] {
  const { spaceWidth, lines, width } = props;
  const wordsByLines: TLine[] = [];

  let lineIndex = 0;
  for (const line of lines) {
    let currentLine: TLine | null = null;

    // Check whether line includes words
    if (line.length > 0) {
      for (let i = 0; i < line.length; i++) {
        const { word, width: wordWidth, height: wordHeight } = line[i];
        const wordWithSpaceWidth = spaceWidth + wordWidth;

        // If there's no current line
        // or if word with space doesn't fit in the current line (e.g. if 'my' + ' name' doesn't fit),
        // create a new line
        if (
          currentLine == null ||
          currentLine.width + wordWithSpaceWidth > width
        ) {
          currentLine = {
            words: [word],
            width: wordWidth,
            height: wordHeight,
            x: 0,
            y: 0,
            index: lineIndex++,
          };
          wordsByLines.push(currentLine);
        }
        // If the word with space fits in the current line, add it
        else {
          currentLine.words.push(word);
          // Update line width
          currentLine.width = currentLine.width + wordWithSpaceWidth;
          // Update average line height
          currentLine.height =
            (currentLine.height * (currentLine.words.length - 1) + wordHeight) /
            currentLine.words.length;
        }
      }
    }
    // Other with its just a empty line break
    else {
      wordsByLines.push({
        words: [''],
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        index: lineIndex++,
      });
    }
  }

  return wordsByLines;
}
