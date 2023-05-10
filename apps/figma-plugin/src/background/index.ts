import { FigmaBackgroundHandler } from '@pda/figma-handler/dist/background';
import {
  TBackgroundFigmaMessageEvent,
  TUIFigmaMessageEvent,
} from '../shared-types';
import { events } from './events';

// Init UI
figma.showUI(__html__);
figma.ui.resize(300, 500);

export const backgroundHandler = new FigmaBackgroundHandler<
  TBackgroundFigmaMessageEvent,
  TUIFigmaMessageEvent
>(figma, { events });
