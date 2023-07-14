import { TBaseFigmaMessageEvent } from '@pda/figma-handler';
import { TScene } from '@pda/types/dtif';

export interface TOnSelectFrameEvent extends TBaseFigmaMessageEvent {
  key: 'on-select-frame';
  args: {
    selected: Pick<FrameNode | ComponentNode | InstanceNode, 'name' | 'id'>[];
  };
}

export interface TOnSelectNodeIdEvent extends TBaseFigmaMessageEvent {
  key: 'on-select-node-id';
  args: { selected: Pick<SceneNode, 'name' | 'id'>[] };
}

export interface TOnSelectNodePropertiesEvent extends TBaseFigmaMessageEvent {
  key: 'on-select-node-properties';
  args: { selected: SceneNode[] };
}

export interface TOnChangeSelectedNodePropertiesEvent
  extends TBaseFigmaMessageEvent {
  key: 'on-change-selected-node-properties';
  args: { changed: SceneNode };
}

export interface TIntermediateFormatExportResultEvent
  extends TBaseFigmaMessageEvent {
  key: 'intermediate-format-export-result';
  args:
    | {
        type: 'error';
        message: string;
      }
    | {
        type: 'success';
        content: TScene;
      };
}

export type TUIFigmaMessageEvent =
  | TOnSelectFrameEvent
  | TOnSelectNodeIdEvent
  | TIntermediateFormatExportResultEvent
  | TOnSelectNodePropertiesEvent
  | TOnChangeSelectedNodePropertiesEvent;
