import { TBaseMessageEvent } from '@pda/figma-handler';

export interface TIntermediateFormatExportEvent extends TBaseMessageEvent {
  key: 'intermediate-format-export-event';
  args: { selectedElement: any };
}

export interface TTestEvent extends TBaseMessageEvent {
  key: 'test';
  args: { test: any };
}

export type TUIMessageEvent = TIntermediateFormatExportEvent | TTestEvent;
