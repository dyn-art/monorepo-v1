import { logger } from '../shared';
import './background-handler';
import { appConfig } from './environment';

// Init UI
figma.showUI(__html__);
figma.ui.resize(300, 500);

logger.success(
  `Successfully initialized UI with the package version '${appConfig.packageVersion}'.`
);
