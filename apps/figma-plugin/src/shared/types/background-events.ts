import { TBaseFigmaMessageEvent } from '@dyn/figma-handler';
import { TTransformNodeOptions } from '@dyn/figma-to-dtif';
import { EUIPageRoute } from './other';

export interface TIntermediateFormatExportEvent extends TBaseFigmaMessageEvent {
  key: 'intermediate-format-export';
  args: {
    selectedElements: Pick<
      FrameNode | ComponentNode | InstanceNode,
      'name' | 'id'
    >[];
    options: TTransformNodeOptions & {
      nameAsBucketId?: boolean;
    };
  };
}

export interface TOnUIRouteChangeEvent extends TBaseFigmaMessageEvent {
  key: 'on-ui-route-change';
  args: {
    activeRoute: EUIPageRoute;
  };
}

export type TBackgroundFigmaMessageEvent =
  | TIntermediateFormatExportEvent
  | TOnUIRouteChangeEvent;
