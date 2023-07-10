import memoize from 'lodash.memoize';

const MEASUREMENT_ELEMENT_ID = '__pda_svg_text_measurement_id';

function getStringWidth(str: string, style: Record<string, any> = {}): number {
  try {
    // Get text element from DOM, if it doesn't exist yet create it
    let textElement = document.getElementById(
      MEASUREMENT_ELEMENT_ID
    ) as SVGTextElement | null;
    if (!textElement) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.width = '0';
      svg.style.height = '0';
      svg.style.position = 'absolute';
      svg.style.top = '-100%';
      svg.style.left = '-100%';
      textElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text'
      );
      textElement.setAttribute('id', MEASUREMENT_ELEMENT_ID);
      svg.appendChild(textElement);
      document.body.appendChild(svg);
    }

    // Assign style and text content to the text element
    Object.assign(textElement.style, style);
    textElement.textContent = str;

    return textElement.getComputedTextLength();
  } catch (error) {
    return 0;
  }
}

const memoized: any = memoize(
  getStringWidth,
  (str, style) => `${str}_${JSON.stringify(style)}`
);

export default memoized;
