import { Yoga, yoga } from '@/yoga';
import { TComposition, TTextNode, TVector } from '@pda/types/dtif';
import { Composition } from '../Composition';
import { RemoveFunctions, Watcher } from '../Watcher';
import { Fill } from '../fill';
import {
  Space,
  TTextSegment,
  Typeface,
  detectTabs,
  segmentText,
} from '../font';
import { CompositionNode, D3Node, ShapeNode } from './base';

export class Text extends ShapeNode {
  private _textAlignHorizontal: TTextNode['textAlignHorizontal'];
  private _textAlignVertical: TTextNode['textAlignVertical'];
  private _fontSize: TTextNode['fontSize'];
  private _letterSpacing: TTextNode['letterSpacing'];
  private _lineHeight: TTextNode['lineHeight'];
  private _characters: TTextNode['characters'];
  private _typeface: Typeface | null;

  private _tabSize = 8;
  private _tabWidth: number;
  private _relativeLetterSpacing: number;
  private _relativeLineHeight: number;

  // Yoga
  private readonly _yogaNode: ReturnType<Yoga['Node']['create']>;

  // D3 ids
  private readonly _d3RootNodeId: string;
  private readonly _d3FillClipPathId: string;
  private readonly _d3FillClipPathDefsNodeId: string;
  private readonly _d3FillClippedShapeNodeId: string;
  private readonly _d3FillNodeId: string;

  protected readonly _watcher: Watcher<TWatchedTextNode>;

  // Init
  private _forInit: {
    node: TTextNode;
  } | null;

  constructor(id: string, node: TTextNode, composition: Composition) {
    super(id, node, composition, { type: 'text' });
    this._forInit = {
      node,
    };

    this._textAlignHorizontal = node.textAlignHorizontal;
    this._textAlignVertical = node.textAlignVertical;
    this._fontSize = node.fontSize;
    this._letterSpacing = node.letterSpacing;
    this._lineHeight = node.lineHeight;
    this._characters = node.characters;

    this._relativeLetterSpacing = this.getRelativeLetterSpacing(
      node.letterSpacing
    );
    this._relativeLineHeight = this.getRelativeLineHeight(node.lineHeight);

    this._yogaNode = this.createYogaNode(
      this._textAlignHorizontal,
      this._textAlignVertical
    );
    this._typeface =
      node.typefaceId != null
        ? composition.fontManager.getTypefaceById(node.typefaceId)
        : null;

    // Define D3 node ids
    this._d3RootNodeId = this.getD3NodeId();
  }

  public async init(parent: D3Node, dtifComposition: TComposition) {
    if (this._forInit == null) {
      return this;
    }
    const { node } = this._forInit;

    if (node.typefaceId != null) {
      // Get typeface (was loaded during Composition initialization)
      const typeface = this.composition.fontManager.getTypefaceById(
        node.typefaceId
      );

      if (typeface != null) {
        this._typeface = typeface;

        // Calculate tab width
        const spaceWidth =
          typeface.measureGrapheme(Space, {
            fontSize: this._fontSize,
            relativeLetterSpacing: this._relativeLetterSpacing,
          }) ?? this._fontSize;
        this._tabWidth = spaceWidth * this._tabSize;
      }
    }

    // Create D3 node
    this._d3Node = await Text.createD3Node(parent, {
      node,
      ids: {
        rootNodeId: this._d3RootNodeId,
        fillClipPathId: this._d3FillClipPathId,
        fillClipPathDefsNodeId: this._d3FillClipPathDefsNodeId,
        fillClippedShapeNodeId: this._d3FillClippedShapeNodeId,
        fillNodeId: this._d3FillNodeId,
      },
    });

    // Retrieve fill wrapper node
    const fillWrapperNode = this._d3Node?.getChildNodeById(this._d3FillNodeId);
    if (fillWrapperNode == null) {
      return this;
    }
    // and append fill paints
    this._fill.init(fillWrapperNode, dtifComposition);

    this._forInit = null;
    return this;
  }

  // ============================================================================
  // Getter & Setter
  // ============================================================================

  public getWatcher() {
    return this._watcher;
  }

  public get characters() {
    return this._characters;
  }

  // ============================================================================
  // Helper
  // ============================================================================

  public getRelativeLetterSpacing(
    letterSpacing: TTextNode['letterSpacing']
  ): number {
    switch (letterSpacing.unit) {
      case 'PIXELS':
        return letterSpacing.value / this._fontSize;
      case 'PERCENT':
        return letterSpacing.value / 100;
      case 'AUTO':
        return 0;
    }
  }

  public getRelativeLineHeight(lineHeight: TTextNode['lineHeight']): number {
    switch (lineHeight.unit) {
      case 'PIXELS':
        return lineHeight.value / this._fontSize;
      case 'PERCENT':
        return lineHeight.value / 100;
      case 'AUTO':
        return 1.2;
    }
  }

  public async measureText(text: string) {
    return this._typeface?.measureText(text, {
      fontSize: this._fontSize,
      relativeLetterSpacing: this._relativeLetterSpacing,
    }) as unknown as number;
  }

  /**
   * Calculates the width of the given text considering the presence of tabs (\t).
   *
   * @param text - The text to calculate the width from.
   * @param options - Options
   * @returns The width of the text taking into account the tabs.
   */
  private async getTextWidthConsideringTabs(
    text: string,
    options: {
      currentLineWidth?: number;
    } = {}
  ): Promise<number> {
    const { currentLineWidth = 0 } = options;
    let textWidth = 0;
    if (text.length === 0 || this._typeface == null) {
      return 0;
    }

    const tabs = detectTabs(text);

    // If tabs are detected in the text
    // NOTE: A current limitation is that the text can only contain one group of consecutive tabs
    if (tabs.detectedTab) {
      const { index, tabCount } = tabs;

      // Separate the text at the detected tab position
      const textBeforeTab = text.slice(0, index);
      const textAfterTab = text.slice(index + tabCount);
      const textWidthBeforeTab = await this.measureText(textBeforeTab);
      const textWidthAfterTab = await this.measureText(textAfterTab);

      // Calculate the effective width after considering the tabs.
      // We add the `currentWidth` to the `textWidthBeforeTab` to ensure
      // that the tabbed text is correctly positioned relative to any
      // preceding content. This allows tabs to be aligned consistently
      // across multiple lines or after any preceding text.
      // https://marketsplash.com/tutorials/cpp/how-to-do-tabs-in-cplusplus/
      const totalWidthBeforeTab = textWidthBeforeTab + currentLineWidth;
      const previousTabStopsCount = Math.floor(
        totalWidthBeforeTab / this._tabWidth
      );
      const tabMoveDistance =
        this._tabWidth === 0
          ? textWidthBeforeTab
          : (previousTabStopsCount + tabCount) * this._tabWidth;
      textWidth = tabMoveDistance + textWidthAfterTab;
    }
    // If the text doesn't contain any tabs
    else {
      textWidth = await this.measureText(text);
    }

    return textWidth;
  }

  /**
   * Calculates the width of the trailing whitespace of the given text.
   *
   * @param text - Text to calculate the trailing whitespace from.
   * @param options - Options
   * @returns Width of the trailing whitespace.
   */
  public async calculateTrailingWhitespaceWidth(
    text: string,
    options: { textWidth?: number } = {}
  ) {
    const { textWidth = await this.measureText(text) } = options;
    const widthWithoutTrailingWhitespace =
      text.trimEnd() === text
        ? textWidth
        : await this.measureText(text.trimEnd());
    return textWidth - widthWithoutTrailingWhitespace;
  }

  public async textLayout(
    textSegments: TTextSegment[],
    width: number,
    options: TTextLayoutOptions = {}
  ): Promise<TTextLayoutResult | null> {
    const { allowBreakWord = false, allowSoftWrap = true } = options;
    if (this._typeface == null) {
      return null;
    }
    let segments = [...textSegments];

    // Obtain baseline and height properties from the typeface
    const typefaceBaseline = this._typeface.getBaseline(
      this._fontSize,
      this._relativeLineHeight
    );
    const typefaceHeight = this._typeface.getHeight(
      this._fontSize,
      this._relativeLineHeight
    );

    // Layout properties
    let height = 0;
    let maxWidth = 0;

    // Line properties
    const lines: TTextLayoutLine[] = [];
    let currentLine = this.initLine();

    // Process each text segment
    let segmentIndex = 0;
    while (segmentIndex < segments.length) {
      const segment = segments[segmentIndex].segment;
      const forceBreak = segments[segmentIndex].requiredBreak;

      // Calculate segment width and trailing whitespace
      const segmentWidth = await this.getTextWidthConsideringTabs(segment, {
        currentLineWidth: currentLine.width,
      });
      const trailingWhitespaceWidth =
        await this.calculateTrailingWhitespaceWidth(segment, {
          textWidth: width,
        });

      const willWrap = this.shouldTextSegmentWrap({
        segmentWidth,
        containerWidth: width,
        firstChar: segment[0],
        allowSoftWrap,
        currentLineWidth: currentLine.width,
        trailingWhitespaceWidth,
      });

      // Handle word breaking if required
      if (
        this.needToBreakTextSegment({
          segmentWidth: segmentWidth,
          containerWidth: width,
          willWrap,
          forceBreak,
          allowBreakWord,
        })
      ) {
        // Break the word into multiple segments and continue the loop
        segments = await this.handleTextSegmentBreak({
          segment: segment,
          segmentIndex: segmentIndex,
          segments,
        });

        // Start a new line
        lines.push(currentLine);
        height += currentLine.height;
        currentLine = this.initLine();

        continue;
      }

      // Handle line breaking/wrapping
      if (forceBreak || willWrap) {
        // Start a new line
        lines.push(currentLine);
        height += currentLine.height;
        currentLine = this.initLine({
          width: segmentWidth,
          height: segmentWidth > 0 ? typefaceHeight : 0,
          baselineOffset: segmentWidth > 0 ? typefaceBaseline : 0,
          segments: [],
        });

        // If it's naturally broken, we update the max width.
        // Since if there are multiple lines, the width should fit the
        // container.
        if (!forceBreak) {
          maxWidth = Math.max(maxWidth, width);
        }
      }
      // It fits into the current line.
      else {
        currentLine.width += segmentWidth;
      }

      // Calculate the maximum width encountered
      maxWidth = Math.max(maxWidth, currentLine.width);

      // Add the segment to the current line
      this.processTextSegment({
        line: currentLine,
        height,
        segment,
        segmentWidth,
        typeface: this._typeface,
        typefaceHeight,
      });

      segmentIndex++;
    }

    return { width: maxWidth, height, lines };
  }

  // Initializes and returns the properties for a new line
  private initLine(
    initialValues: {
      width?: number;
      height?: number;
      baselineOffset?: number;
      segments?: TTextLayoutSegment[];
    } = {}
  ): TTextLayoutLine {
    const {
      width = 0,
      height = 0,
      baselineOffset = 0,
      segments = [],
    } = initialValues;
    return {
      width,
      height,
      baselineOffset,
      segments,
    };
  }

  // Determines whether the segment should wrap to the next line.
  private shouldTextSegmentWrap(config: {
    firstChar: string;
    containerWidth: number;
    allowSoftWrap: boolean;
    segmentWidth: number;
    trailingWhitespaceWidth: number;
    currentLineWidth: number;
  }): boolean {
    const {
      firstChar,
      containerWidth,
      allowSoftWrap,
      currentLineWidth,
      trailingWhitespaceWidth,
      segmentWidth,
    } = config;
    const allowedAtBeginning = ',.!?:-@)>]}%#'.indexOf(firstChar) === 0;
    return (
      allowedAtBeginning &&
      segmentWidth + currentLineWidth >
        containerWidth + trailingWhitespaceWidth &&
      allowSoftWrap
    );
  }

  // Determines if the text segment needs to be broken across lines
  private needToBreakTextSegment(config: {
    segmentWidth: number;
    containerWidth: number;
    willWrap: boolean;
    forceBreak: boolean;
    allowBreakWord: boolean;
  }): boolean {
    const {
      segmentWidth,
      containerWidth,
      willWrap,
      forceBreak,
      allowBreakWord,
    } = config;
    return (
      allowBreakWord &&
      segmentWidth > containerWidth &&
      (willWrap || forceBreak)
    );
  }

  // Breaks the text segment into characters
  // and adds them back into the text segments array
  private async handleTextSegmentBreak(config: {
    segment: string;
    segmentIndex: number;
    segments: TTextSegment[];
  }): Promise<TTextSegment[]> {
    const { segment, segmentIndex, segments } = config;
    const newSegments = [...segments];
    const graphemes = await segmentText(segment, 'grapheme');
    newSegments.splice(
      segmentIndex,
      1,
      ...graphemes.map((char) => ({ segment: char, requiredBreak: false }))
    );
    return newSegments;
  }

  // Processes a text segment and updates the line with the segment details
  private async processTextSegment(config: {
    line: TTextLayoutLine;
    segment: string;
    segmentWidth: number;
    height: number;
    typefaceHeight: number;
    typeface: Typeface;
  }) {
    const { line, segment, segmentWidth, height, typefaceHeight, typeface } =
      config;

    let x = line.width - segmentWidth;

    if (segmentWidth === 0) {
      line.segments.push({
        position: { y: height, x },
        width: 0,
        height: typefaceHeight,
        isImage: false,
        text: segment,
      });
    } else {
      const words = await segmentText(segment, 'word');

      for (const word of words) {
        const wordWidth = await typeface.measureText(word, {
          fontSize: this._fontSize,
          relativeLetterSpacing: this._relativeLetterSpacing,
        });

        line.segments.push({
          position: { y: height, x },
          width: wordWidth,
          height: typefaceHeight,
          isImage: false, // TODO: Determine if segment represents an image
          text: word,
        });

        x += wordWidth;
      }
    }
  }

  // ============================================================================
  // Yoga
  // ============================================================================

  private createYogaNode(
    textAlignHorizontal: TTextNode['textAlignHorizontal'],
    textAlignVertical: TTextNode['textAlignVertical']
  ) {
    const textContainer = yoga.Node.create();

    // Determine align items
    let alignItems;
    switch (textAlignVertical) {
      case 'TOP':
        alignItems = yoga.ALIGN_FLEX_START;
        break;
      case 'CENTER':
        alignItems = yoga.ALIGN_CENTER;
        break;
      case 'BOTTOM':
        alignItems = yoga.ALIGN_FLEX_END;
        break;
      default:
        alignItems = yoga.ALIGN_FLEX_END;
    }
    textContainer.setAlignItems(alignItems);

    // Determine justify content
    let justifyContent;
    switch (textAlignHorizontal) {
      case 'LEFT':
        justifyContent = yoga.JUSTIFY_FLEX_START;
        break;
      case 'CENTER':
        justifyContent = yoga.JUSTIFY_CENTER;
        break;
      case 'RIGHT':
        justifyContent = yoga.JUSTIFY_FLEX_END;
        break;
      case 'JUSTIFIED':
        justifyContent = yoga.ALIGN_SPACE_BETWEEN;
        break;
      default:
        justifyContent = yoga.JUSTIFY_FLEX_START;
    }
    textContainer.setJustifyContent(justifyContent);

    return textContainer;
  }

  // ============================================================================
  // D3
  // ============================================================================

  public static async createD3Node(
    parent: D3Node,
    props: {
      node: TTextNode;
      ids: {
        rootNodeId: string;
        fillClipPathId: string;
        fillClipPathDefsNodeId: string;
        fillClippedShapeNodeId: string;
        fillNodeId: string;
      };
    }
  ) {
    const {
      ids: {
        rootNodeId,
        fillClipPathId,
        fillClipPathDefsNodeId,
        fillClippedShapeNodeId,
        fillNodeId,
      },
      node,
    } = props;

    // Create root element
    const root = await CompositionNode.createWrapperD3Node(parent, {
      id: rootNodeId,
      node,
    });

    // Create fill clip path element
    const fillClipPathDefsNode = root.append('defs', {
      id: fillClipPathDefsNodeId,
    });
    const fillClipPathNode = fillClipPathDefsNode.append('clipPath', {
      id: fillClipPathId,
    });
    fillClipPathNode.append('path', {
      id: fillClippedShapeNodeId,
      attributes: {
        p: '', // TODO: create text path
      },
    });

    // Create fill wrapper element
    await Fill.createFillWrapperD3Node(root, {
      id: fillNodeId,
      clipPathId: fillClipPathId,
    });

    return root;
  }
}

type TWatchedTextNode = RemoveFunctions<Text>;

type TTextLayoutSegment = {
  text: string;
  position: TVector;
  width: number;
  height: number;
  isImage: boolean;
};

type TTextLayoutLine = {
  width: number;
  height: number;
  baselineOffset: number;
  segments: TTextLayoutSegment[];
};

type TTextLayoutResult = {
  width: number;
  height: number;
  lines: TTextLayoutLine[];
};

type TTextLayoutOptions = {
  allowSoftWrap?: boolean;
  allowBreakWord?: boolean;
};
