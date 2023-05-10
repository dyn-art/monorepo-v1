import { TBaseFigmaMessageEvent } from '@pda/figma-handler';

export interface TIntermediateFormatExportEvent extends TBaseFigmaMessageEvent {
  key: 'intermediate-format-export-event';
  args: { selectedElement: any };
}

export interface TBackgroundTestEvent extends TBaseFigmaMessageEvent {
  key: 'test-background';
  args: { test: string };
}

export type TBackgroundFigmaMessageEvent =
  | TIntermediateFormatExportEvent
  | TBackgroundTestEvent;
