import React from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';

// Routes
import About from './routes/about';
import DTIFExport from './routes/dtif';
import Home from './routes/home';
import NodeInspector from './routes/node-inspector';

const Routes: React.FC = () => {
  return (
    <div>
      <RouterRoutes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="dtif" element={<DTIFExport />} />
        <Route path="node-inspector" element={<NodeInspector />} />
      </RouterRoutes>
    </div>
  );
};

export default Routes;
