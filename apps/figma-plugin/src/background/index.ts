import { FigmaBackgroundHandler } from '@pda/figma-handler';
import events from './events';

// Init UI
figma.showUI(__html__);
figma.ui.resize(300, 500);

// Init Figma Client Handler
new FigmaBackgroundHandler(figma, {
  events,
});
