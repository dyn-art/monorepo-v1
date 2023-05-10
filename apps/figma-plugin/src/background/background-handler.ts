import { FigmaBackgroundHandler } from '@pda/figma-handler';
import {
  TBackgroundFigmaMessageEvent,
  TUIFigmaMessageEvent,
} from '../shared-types';
import { events } from './events';

export const backgroundHandler = new FigmaBackgroundHandler<
  TBackgroundFigmaMessageEvent,
  TUIFigmaMessageEvent
>(figma, { events });
