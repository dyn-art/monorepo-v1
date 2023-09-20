import { FigmaUIHandler } from '@dyn/figma-handler';
import { TBackgroundFigmaMessageEvent, TUIFigmaMessageEvent } from '../shared';

export const uiHandler: TUIHandler = new FigmaUIHandler<
  TUIFigmaMessageEvent,
  TBackgroundFigmaMessageEvent
>(parent);

export type TUIHandler = FigmaUIHandler<
  TUIFigmaMessageEvent,
  TBackgroundFigmaMessageEvent
>;
