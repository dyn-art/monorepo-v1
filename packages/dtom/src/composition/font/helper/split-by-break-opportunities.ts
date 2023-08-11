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
  wordBreak: TTextBreak = 'uax-14'
): Promise<TTextSegment[]> {
  switch (wordBreak) {
    case 'break-all':
      return breakAll(text);
    case 'keep-all':
      return keepAll(text);
    default:
      return defaultBreak(text);
  }
}

async function breakAll(content: string): Promise<TTextSegment[]> {
  const segments = await segmentText(content, 'grapheme');
  return segments.map((segment) => ({ segment, requiredBreak: false }));
}

async function keepAll(content: string): Promise<TTextSegment[]> {
  const segments = await segmentText(content, 'word');
  return segments.map((segment) => ({ segment, requiredBreak: false }));
}

// https://www.npmjs.com/package/linebreak
function defaultBreak(content: string): TTextSegment[] {
  const breaker = new LineBreaker(content);
  const textSegments: TTextSegment[] = [];
  let lastBreakPoint = 0;
  let nextBreak = breaker.nextBreak();

  while (nextBreak) {
    const segment = content.slice(lastBreakPoint, nextBreak.position);
    textSegments.push({ segment, requiredBreak: nextBreak.required });

    lastBreakPoint = nextBreak.position;
    nextBreak = breaker.nextBreak();
  }

  return textSegments;
}

export type TTextBreak = 'break-all' | 'keep-all' | 'uax-14';
export type TTextSegment = { segment: string; requiredBreak: boolean };
