import React from 'react';
import useFetch from 'react-fetch-hook';
import { Still } from 'remotion';

// Compositions
import SimpleCityMapV1 from './components/stills/simple-city-map-v1';
import SpotifyPlayerV1 from './components/stills/spotify-player-v1';

// Global Styles
import './style.css';

export const RemotionRoot: React.FC = () => {
  // TODO optimize
  const { isLoading, data } = useFetch(
    'https://raw.githubusercontent.com/physical-art/default-props/main/tiles-long-1224183-lat37775.json'
  );

  return (
    <>
      {isLoading ? (
        <Still
          id="simple-city-map-v1"
          component={SimpleCityMapV1 as any}
          width={599}
          height={847}
          defaultProps={{
            tiles: data as any,
            projectionProps: {
              center: [-122.4183, 37.775],
              scale: Math.pow(2, 21) / (2 * Math.PI),
              translate: [600 / 2, 600 / 2],
              precision: 0,
            },
          }}
        />
      ) : (
        <p>Default props not loaded yet!</p>
      )}
      <Still
        id="spotify-player-v1"
        component={SpotifyPlayerV1}
        width={599}
        height={847}
        defaultProps={{
          title: 'Your Song Title Here',
          subtitle: 'This is a subtitle',
          time: {
            total: 180,
            current: 34,
          },
          spotifyCode: true,
          trackId: '5PNzt1Rvt7PUVaGhbq0OVt',
          imageUrl:
            'https://cdn.pixabay.com/photo/2017/07/31/21/04/people-2561053_960_720.jpg',
        }}
      />
    </>
  );
};
