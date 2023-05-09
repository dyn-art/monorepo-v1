import { TBaseUIMessageEvent } from '@pda/figma-handler';

export interface TIntermediateFormatExportEvent extends TBaseUIMessageEvent {
  type: 'intermediate-format-export-event';
  args: { selectedElement: any };
}

export interface TTestEvent extends TBaseUIMessageEvent {
  type: 'test';
  args: { test: any };
}

export type TUIMessageEvent = TIntermediateFormatExportEvent | TTestEvent;
