import { logger } from '../shared';
import './background-handler';
import { appConfig } from './environment';

// Init UI
figma.showUI(__html__);
if (process.env.PREVIEW_MODE) {
  figma.ui.resize(50, 50);
} else {
  figma.ui.resize(400, 600);
}

logger.success(
  `Successfully initialized UI with the package version '${appConfig.packageVersion}'.`
);
