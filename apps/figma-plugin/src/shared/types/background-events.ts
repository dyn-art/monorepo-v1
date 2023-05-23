import { TBaseFigmaMessageEvent } from '@pda/figma-handler';

export interface TIntermediateFormatExportEvent extends TBaseFigmaMessageEvent {
  key: 'intermediate-format-export-event';
  args: {
    selectedElements: Pick<
      FrameNode | ComponentNode | InstanceNode,
      'name' | 'id'
    >[];
    config: {
      frameToSVG: boolean;
      svgExportIdentifierRegex: string; // Note RegExp can't be passed to the Javascript Sandbox
    };
  };
}

export type TBackgroundFigmaMessageEvent = TIntermediateFormatExportEvent;
