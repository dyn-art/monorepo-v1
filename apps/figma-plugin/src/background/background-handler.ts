import { FigmaBackgroundHandler } from '@pda/figma-handler/dist/background';
import {
  TBackgroundFigmaMessageEvent,
  TUIFigmaMessageEvent,
} from '../shared-types';

export const backgroundHandler = new FigmaBackgroundHandler<
  TBackgroundFigmaMessageEvent,
  TUIFigmaMessageEvent
>(figma);
