import { TBaseFigmaMessageEvent } from '@pda/figma-handler';

export interface TIntermediateFormatExportEvent extends TBaseFigmaMessageEvent {
  key: 'intermediate-format-export-event';
  args: { selectedElements: Pick<FrameNode | ComponentNode, 'name' | 'id'>[] };
}

export type TBackgroundFigmaMessageEvent = TIntermediateFormatExportEvent;
