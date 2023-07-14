import React from 'react';
import App from '../../src/ui/App';
import { usePreview } from '../shared/usePreview';

const PreviewApp: React.FC = () => {
  const { isConnected } = usePreview(false);

  return (
    <div
      style={{
        position: 'relative',
        height: '600px',
        width: '400px',
        overflow: 'auto',
        borderWidth: '2px',
        borderColor: 'black',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: '8px',
          top: '8px',
          height: '16px',
          width: '16px',
          borderRadius: '50%',
          backgroundColor: isConnected ? '#4ade80' : '#f87171',
        }}
      />
      <App />
    </div>
  );
};

export default PreviewApp;
