import React from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';
import { EUIPageRoute } from '../shared';
import { RouteChangeListener } from './components/navigation';

// Routes
import About from './routes/about';
import DTIFExport from './routes/dtif';
import Home from './routes/home';
import NodeInspector from './routes/node-inspector';

const Routes: React.FC = () => {
  return (
    <div>
      <RouteChangeListener />
      <RouterRoutes>
        <Route path={EUIPageRoute.HOME} element={<Home />} />
        <Route path={EUIPageRoute.ABOUT} element={<About />} />
        <Route path={EUIPageRoute.DTIF} element={<DTIFExport />} />
        <Route path={EUIPageRoute.NODE_INSPECTOR} element={<NodeInspector />} />
      </RouterRoutes>
    </div>
  );
};

export default Routes;
