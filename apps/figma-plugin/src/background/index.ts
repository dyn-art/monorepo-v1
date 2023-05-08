import FigmaClientHandler from '@pda/figma-handler';
import events from './events';

// Init UI
figma.showUI(__html__);
figma.ui.resize(300, 500);

console.log({ events, figma });

// Init Figma Client Handler
new FigmaClientHandler(figma, {
  events,
});
