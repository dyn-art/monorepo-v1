import useAxios from 'axios-hooks';
import React from 'react';
import { Still } from 'remotion';

// Compositions
import SimpleCityMapV1 from './stills/simple-city-map-v1';
import SpotifyPlayerV1 from './stills/spotify-player-v1';

// Global Styles
import FigmaNodeTreeV1 from './stills/figma-node-tree-v1';
import './style.css';

export const RemotionRoot: React.FC = () => {
  const [{ loading: isLoadingTiles, data: tilesData }] = useAxios(
    'https://raw.githubusercontent.com/physical-art/default-props/main/tiles-long-1224183-lat37775.json'
  );
  const [{ loading: isLoadingFigmaNodeTree, data: figmaNodeTree }] = useAxios(
    'https://raw.githubusercontent.com/physical-art/default-props/main/figma-node-tree-2'
  );

  return (
    <>
      {!isLoadingTiles ? (
        <Still
          id="simple-city-map-v1"
          component={SimpleCityMapV1}
          width={800}
          height={1200}
          defaultProps={
            {
              tiles: tilesData,
              projectionProps: {
                center: [-122.4183, 37.775],
                scale: Math.pow(2, 21) / (2 * Math.PI),
                translate: [600 / 2, 600 / 2],
                precision: 0,
              },
            } as any
          }
        />
      ) : (
        <p>Default props not loaded yet!</p>
      )}
      {!isLoadingFigmaNodeTree ? (
        <Still
          id="figma-node-tree-v1"
          component={FigmaNodeTreeV1}
          width={595}
          height={842}
          defaultProps={{
            nodeTree: figmaNodeTree,
          }}
        />
      ) : (
        <p>Default props not loaded yet!</p>
      )}
      <Still
        id="spotify-player-v1"
        component={SpotifyPlayerV1}
        width={595}
        height={842}
        defaultProps={{
          track: {
            id: '5PNzt1Rvt7PUVaGhbq0OVt',
            imageUrl:
              'https://cdn.pixabay.com/photo/2017/07/31/21/04/people-2561053_960_720.jpg',
            time: {
              total: 180,
              current: 68,
            },
          },
          title: 'Your Song Title Here',
          subtitle: 'This is a subtitle',
          spotifyCode: true,
          theme: 'light',
        }}
      />
    </>
  );
};
