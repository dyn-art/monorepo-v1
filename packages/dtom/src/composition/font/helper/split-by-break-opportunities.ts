import LineBreaker from 'linebreak';
import { segmentText } from './segment-text';

/**
 * Splits text by break opportunities based on the given word break rule.
 *
 * @param text The input string content.
 * @param wordBreak The word break rule.
 * @returns An array of objects containing the word and its required break.
 */
export async function splitByBreakOpportunities(
  text: string,
  wordBreak: TWordBreak = 'uax-14'
): Promise<TWord[]> {
  switch (wordBreak) {
    case 'break-all':
      return breakAll(text);
    case 'keep-all':
      return keepAll(text);
    default:
      return defaultBreak(text);
  }
}

async function breakAll(content: string): Promise<TWord[]> {
  const words = await segmentText(content, 'grapheme');
  return words.map((word) => ({ word, requiredBreak: false }));
}

async function keepAll(content: string): Promise<TWord[]> {
  const words = await segmentText(content, 'word');
  return words.map((word) => ({ word, requiredBreak: false }));
}

// https://www.npmjs.com/package/linebreak
function defaultBreak(content: string): TWord[] {
  const breaker = new LineBreaker(content);
  const result: { word: string; requiredBreak: boolean }[] = [];
  let lastBreakPoint = 0;
  let nextBreak = breaker.nextBreak();

  while (nextBreak) {
    const word = content.slice(lastBreakPoint, nextBreak.position);
    result.push({ word, requiredBreak: nextBreak.required });

    lastBreakPoint = nextBreak.position;
    nextBreak = breaker.nextBreak();
  }

  return result;
}

export type TWordBreak = 'break-all' | 'keep-all' | 'uax-14';
export type TWord = { word: string; requiredBreak: boolean };
