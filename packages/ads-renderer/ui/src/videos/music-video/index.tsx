import React from 'react';
import { Audio } from 'remotion';
import Visualizer from './components/Visualizer';

const MusicVideo: React.FC<TMusicVideoProps> = (props) => {
  const { audioUrl } = props;
  return (
    <div>
      <Audio src={audioUrl} />
      <Visualizer audio={audioUrl} backgroundColor={'red'} />
    </div>
  );
};

export default MusicVideo;

type TMusicVideoProps = {
  audioUrl: string;
  imageUrl: string;
};
