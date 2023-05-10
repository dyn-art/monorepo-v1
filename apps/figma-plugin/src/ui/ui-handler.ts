import { FigmaUIHandler } from '@pda/figma-handler/dist/ui';
import {
  TBackgroundFigmaMessageEvent,
  TUIFigmaMessageEvent,
} from '../shared-types';

export const uiHandler = new FigmaUIHandler<
  TUIFigmaMessageEvent,
  TBackgroundFigmaMessageEvent
>(parent);
