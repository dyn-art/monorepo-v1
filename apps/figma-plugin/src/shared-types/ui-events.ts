import { TBaseFigmaMessageEvent } from '@pda/figma-handler';

export interface TOnSelectFrameEvent extends TBaseFigmaMessageEvent {
  key: 'on-select-frame-event';
  args: Pick<FrameNode, 'x' | 'y' | 'name'>[];
}

export interface TOnSelectNodeEvent extends TBaseFigmaMessageEvent {
  key: 'on-select-node-event';
  args: { selected: SceneNode[] };
}

export interface TUITestEvent extends TBaseFigmaMessageEvent {
  key: 'test-ui';
  args: { test: number };
}

export type TUIFigmaMessageEvent =
  | TOnSelectFrameEvent
  | TUITestEvent
  | TOnSelectNodeEvent;
