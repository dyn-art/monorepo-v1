import React from 'react';
import { Audio } from 'remotion';
import Visualizer from './components/Visualizer';

import paperTextureImage from './assets/paper-texture.png';

const MusicVideo: React.FC<TProps> = (props) => {
  const { track, showSpotifyCode } = props;
  return (
    <div>
      <Audio src={track.previewUrl} />
      <img
        src={track.imageUrl}
        className={'object-cover w-[467px] h-[467px]'}
      />
      <Visualizer audioSource={track.previewUrl} />
      <img src={paperTextureImage} width={100} height={100} />
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
