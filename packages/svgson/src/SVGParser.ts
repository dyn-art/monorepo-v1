import { XMLParser } from 'fast-xml-parser';

export class SVGParser {
  private readonly _parser: XMLParser;
  private static readonly ATTRIBUTE_NAME_PREFIX = '@_';

  constructor() {
    this._parser = new XMLParser({
      attributeNamePrefix: SVGParser.ATTRIBUTE_NAME_PREFIX,
      ignoreAttributes: false,
    });
  }

  public parse(xml: string) {
    // Parse the SVG-XML into a JavaScript object
    const jsonObject = this._parser.parse(xml);

    // Throw error if no root SVG node found -> no valid SVG
    if (typeof jsonObject['svg'] !== 'object') {
      throw new Error(); // TODO: custom error
    }

    // Convert the SVG jsonObject into a better to process node
    return this.parseRawElement(jsonObject.svg, 'svg');
  }

  private parseRawElement(rawElement: TElement, name: string): TNode {
    const node: TNode = {
      type: name,
      attributes: {},
      children: [],
    };

    for (const key in rawElement) {
      const rawElementProp = rawElement[key];

      // If property is an actual property, add it to the nodes properties
      if (
        key.startsWith(SVGParser.ATTRIBUTE_NAME_PREFIX) &&
        typeof rawElementProp === 'string'
      ) {
        const formattedKey = key.replace(SVGParser.ATTRIBUTE_NAME_PREFIX, '');
        node.attributes[formattedKey] = rawElementProp;
      }

      // If property is a text child, add it to the value
      else if (key === '#text' && typeof rawElementProp === 'string') {
        node.value = rawElementProp;
      }

      // If the property is an array, create a new child node for each item in the array
      else if (Array.isArray(rawElementProp)) {
        node.children.push(
          ...rawElementProp.map((child) => {
            return this.parseRawElement(child, key);
          })
        );
      }

      // If the property is an plain object, create a new child node for the property
      else if (rawElementProp != null && typeof rawElementProp === 'object') {
        node.children.push(this.parseRawElement(rawElementProp, key));
      }

      // Log warning if property couldn't be resolved
      else {
        // TODO: warn log
      }
    }

    return node;
  }
}

type TNode = {
  type: string;
  value?: string; // Text value
  attributes: { [key: string]: string };
  children: TNode[];
};

type TElement = { [key: string]: string | TElement[] | TElement };
