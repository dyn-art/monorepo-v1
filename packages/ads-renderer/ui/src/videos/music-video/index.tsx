import React from 'react';
import { Audio } from 'remotion';
import Visualizer from './components/Visualizer';

import paperTexture from './assets/paper-texture.png';
import recordCaseTexture from './assets/record-case-texture.png';

const MusicVideo: React.FC<TProps> = (props) => {
  const [color] = React.useState('#F5C26E');
  const { track, showSpotifyCode } = props;

  return (
    <div className={'flex items-center justify-center w-full h-full'}>
      {/* Audio */}
      <Audio src={track.previewUrl} />

      {/* Background */}
      <div className={'absolute top-0 left-0 w-full h-full z-0'}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: color,
          }}
        />
        <img
          src={paperTexture}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.15,
            backgroundBlendMode: 'hard-light',
          }}
        />
      </div>

      <div
        className="w-[890px] h-[890px]"
        style={{
          boxShadow: 'inset 0px 0px 0px 1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <img
          src={track.imageUrl}
          className={'absolute top-0 left-0 w-[890px] h-[890px]'}
        />
        <img
          src={recordCaseTexture}
          className={
            'absolute top-0 left-0 w-[890px] h-[890px] mix-blend-difference'
          }
        />
      </div>

      <Visualizer audioSource={track.previewUrl} />
    </div>
  );
};

export default MusicVideo;

type TProps = {
  track: {
    id: string;
    imageUrl: string;
    previewUrl: string;
    name: string;
    artists: string[];
    releaseDate: Date;
  };
  showSpotifyCode: boolean;
};
