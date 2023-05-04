import React from 'react';
import { Still } from 'remotion';

// Compositions
import ThumbnailV1 from './stills/thumbnail-v1';

// Global Styles
import './style.css';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Still
        id="thumbnail-v1"
        component={ThumbnailV1}
        width={1200}
        height={900}
        defaultProps={{
          imageUrl: '',
        }}
      />
    </>
  );
};
