import { TBaseFigmaMessageEvent } from '@pda/figma-handler';

export interface TOnSelectFrameEvent extends TBaseFigmaMessageEvent {
  key: 'on-select-frame-event';
  args: {
    selected:
      | Pick<FrameNode | ComponentNode | InstanceNode, 'name' | 'id'>[]
      | null;
  };
}

export interface TOnSelectNodeEvent extends TBaseFigmaMessageEvent {
  key: 'on-select-node-event';
  args: { selected: Pick<SceneNode, 'name' | 'id'>[] | null };
}

export interface TIntermediateFormatExportResultEvent
  extends TBaseFigmaMessageEvent {
  key: 'intermediate-format-export-result-event';
  args:
    | {
        type: 'error';
        message: string;
      }
    | {
        type: 'success';
        content: string;
      };
}

export type TUIFigmaMessageEvent =
  | TOnSelectFrameEvent
  | TOnSelectNodeEvent
  | TIntermediateFormatExportResultEvent;
