import React from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';

// Routes
import About from './routes/about';
import Home from './routes/home';
import PetmaPlugin from './routes/plugins/petma';

const Routes: React.FC = () => {
  return (
    <div>
      <RouterRoutes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="plugins/petma" element={<PetmaPlugin />} />
      </RouterRoutes>
    </div>
  );
};

export default Routes;
