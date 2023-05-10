import { TBaseFigmaMessageEvent } from '@pda/figma-handler';

export interface TOnSelectEvent extends TBaseFigmaMessageEvent {
  key: 'on-select-event';
  args: { selectedElement: any };
}

export interface TUITestEvent extends TBaseFigmaMessageEvent {
  key: 'test-ui';
  args: { test: number };
}

export type TUIFigmaMessageEvent = TOnSelectEvent | TUITestEvent;
