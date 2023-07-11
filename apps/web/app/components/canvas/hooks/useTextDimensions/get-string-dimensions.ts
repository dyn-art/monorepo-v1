import memoize from 'lodash.memoize';

const MEASUREMENT_ELEMENT_ID = '__pda_svg_text_measurement_id';

function getStringDimensions(
  str: string,
  style: Record<string, any> = {}
): { width: number; height: number } | null {
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

    return {
      width: textElement.getComputedTextLength(),
      height: textElement.getBBox().height,
    };
  } catch (error) {
    return null;
  }
}

const memoized: any = memoize(
  getStringDimensions,
  (str, style) => `${str}_${JSON.stringify(style)}`
);

export default memoized;
