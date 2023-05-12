import { FigmaUIHandler } from '@pda/figma-handler';
import {
  TBackgroundFigmaMessageEvent,
  TUIFigmaMessageEvent,
} from '../shared-types';

export const uiHandler: TUIHandler = new FigmaUIHandler<
  TUIFigmaMessageEvent,
  TBackgroundFigmaMessageEvent
>(parent);

export type TUIHandler = FigmaUIHandler<
  TUIFigmaMessageEvent,
  TBackgroundFigmaMessageEvent
>;
