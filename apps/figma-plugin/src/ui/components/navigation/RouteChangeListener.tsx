import React from 'react';
import { useLocation } from 'react-router-dom';
import { EUIPageRoute, logger } from '../../../shared';
import { uiHandler } from '../../ui-handler';

const RouteChangeListener: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    logger.info(`Route changed to '${location.pathname}'.`, { location });
    uiHandler.postMessage('on-ui-route-change', {
      activeRoute: location.pathname as EUIPageRoute,
    });
  }, [location]);

  return null;
};

export default RouteChangeListener;
