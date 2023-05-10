import { FigmaUIHandler } from '@pda/figma-handler';
import {
  TBackgroundFigmaMessageEvent,
  TUIFigmaMessageEvent,
} from '../shared-types';

export const uiHandler = new FigmaUIHandler<
  TUIFigmaMessageEvent,
  TBackgroundFigmaMessageEvent
>(parent);
