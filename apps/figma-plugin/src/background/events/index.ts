import documentChangeEvent from './document-change';
import intermediateFormatExportEvent from './intermediate-format-export';
import selectionChangeEvent from './selection-change.js';
import uiRouteChange from './ui-route-change';

export const events = [
  intermediateFormatExportEvent,
  selectionChangeEvent,
  documentChangeEvent,
  uiRouteChange,
];
