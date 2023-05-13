import { TBaseFigmaMessageEvent } from '@pda/figma-handler';

export interface TOnSelectFrameEvent extends TBaseFigmaMessageEvent {
  key: 'on-select-frame-event';
  args: { selected: Pick<FrameNode | ComponentNode, 'name' | 'id'>[] | null };
}

export interface TOnSelectNodeEvent extends TBaseFigmaMessageEvent {
  key: 'on-select-node-event';
  args: { selected: Pick<SceneNode, 'name' | 'id'>[] | null };
}

export type TUIFigmaMessageEvent = TOnSelectFrameEvent | TOnSelectNodeEvent;
