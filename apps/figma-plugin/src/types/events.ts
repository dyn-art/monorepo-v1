import { TBaseUIMessageEvent } from '@pda/figma-handler';

export interface TIntermediateFormatExportEvent extends TBaseUIMessageEvent {
  key: 'intermediate-format-export-event';
  args: { selectedElement: any };
}

export interface TTestEvent extends TBaseUIMessageEvent {
  key: 'test';
  args: { test: any };
}

export type TUIMessageEvent = TIntermediateFormatExportEvent | TTestEvent;
