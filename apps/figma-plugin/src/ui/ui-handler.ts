import { FigmaUIHandler } from '@pda/figma-handler';
import { TUIMessageEvent } from '../types';

export const uiHandler = new FigmaUIHandler<TUIMessageEvent>(parent);
