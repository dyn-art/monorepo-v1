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
      svgExportIdentifier: RegExp;
    };
  };
}

export type TBackgroundFigmaMessageEvent = TIntermediateFormatExportEvent;
