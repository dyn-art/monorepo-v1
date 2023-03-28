import React from 'react';
import { Composition } from 'remotion';

// Compositions
import MusicVideo from './videos/music-video';

// Global Styles
import './style.css';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="music-video-poc"
        component={MusicVideo}
        durationInFrames={820} // Song duration in sec * fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          track: {
            id: '5PNzt1Rvt7PUVaGhbq0OVt',
            name: 'Any Other Way',
            artists: ['We The Kings'],
            releaseDate: new Date('2013-01-01'),
            previewUrl:
              'https://p.scdn.co/mp3-preview/fc4f10524e5d82c31e968f23e07133483a880dbe?cid=cfe923b2d660439caf2b557b21f31221',
            imageUrl:
              'https://i.scdn.co/image/ab67616d0000b273a358003c337056b9965a9c0f',
          },
          showSpotifyCode: true,
        }}
      />
    </>
  );
};
