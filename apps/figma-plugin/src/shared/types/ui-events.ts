import { TNode } from '@pda/dtif-types';
import { TBaseFigmaMessageEvent } from '@pda/figma-handler';

export interface TOnSelectFrameEvent extends TBaseFigmaMessageEvent {
  key: 'on-select-frame-event';
  args: {
    selected: Pick<FrameNode | ComponentNode | InstanceNode, 'name' | 'id'>[];
  };
}

export interface TOnSelectNodeEvent extends TBaseFigmaMessageEvent {
  key: 'on-select-node-event';
  args: { selected: Pick<SceneNode, 'name' | 'id'>[] };
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
        content: TNode;
      };
}

export type TUIFigmaMessageEvent =
  | TOnSelectFrameEvent
  | TOnSelectNodeEvent
  | TIntermediateFormatExportResultEvent;
