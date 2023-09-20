import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Routes from './routes';

// Styles
import './styles/global.css';
import './styles/tailwind.css';

const App: React.FC = () => {
  return (
    <MemoryRouter>
      <Routes />
    </MemoryRouter>
  );
};

export default App;
