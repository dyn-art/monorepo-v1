import { TBaseFigmaMessageEvent } from '@pda/figma-handler';
import { TFormatNodeConfig } from '@pda/figma-to-dtif';

export interface TIntermediateFormatExportEvent extends TBaseFigmaMessageEvent {
  key: 'intermediate-format-export-event';
  args: {
    selectedElements: Pick<
      FrameNode | ComponentNode | InstanceNode,
      'name' | 'id'
    >[];
    config: Omit<TFormatNodeConfig, 'uploadStaticData'>;
  };
}

export type TBackgroundFigmaMessageEvent = TIntermediateFormatExportEvent;
