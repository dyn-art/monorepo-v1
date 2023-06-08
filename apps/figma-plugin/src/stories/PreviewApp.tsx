import clsx from 'clsx';
import React from 'react';
import { usePreview } from '../preview-ui/usePreview';
import App from '../ui/App';

const PreviewApp: React.FC = () => {
  const { isConnected } = usePreview(false);

  return (
    <div className="relative h-[600px] w-[400px] border-2 border-black">
      <div
        className={clsx('absolute right-4 top-4 h-3 w-3 rounded-full', {
          'bg-green-400': isConnected,
          'bg-red-400': !isConnected,
        })}
      />
      <App />
    </div>
  );
};

export default PreviewApp;
