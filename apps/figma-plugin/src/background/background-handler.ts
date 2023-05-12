import { FigmaBackgroundHandler } from '@pda/figma-handler';
import {
  TBackgroundFigmaMessageEvent,
  TUIFigmaMessageEvent,
} from '../shared-types';
import { events } from './events';

export const backgroundHandler: TBackgroundHandler = new FigmaBackgroundHandler<
  TBackgroundFigmaMessageEvent,
  TUIFigmaMessageEvent
>(figma, { events });

export type TBackgroundHandler = FigmaBackgroundHandler<
  TBackgroundFigmaMessageEvent,
  TUIFigmaMessageEvent
>;
