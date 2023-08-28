import React from 'react';
import { usePreview } from '../shared/usePreview';

const PreviewApp: React.FC = () => {
  const { isConnected } = usePreview(true);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: isConnected ? '#4ade80' : '#f87171',
      }}
    />
  );
};

export default PreviewApp;
