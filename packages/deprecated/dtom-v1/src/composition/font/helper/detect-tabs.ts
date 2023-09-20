/**
 * Detect the first occurrence of tabs (\t) in the given text.
 *
 * @param text - The text to detect tabs in.
 * @returns An object indicating whether tabs where detected
 * and if so the tab count and starting index.
 */
export function detectTabs(text: string):
  | {
      detectedTab: false;
    }
  | {
      detectedTab: true;
      index: number;
      tabCount: number;
    } {
  const result = /(\t)+/.exec(text);
  if (result == null) {
    return { detectedTab: false };
  } else {
    return {
      detectedTab: true,
      index: result.index,
      tabCount: result[0].length,
    };
  }
}
