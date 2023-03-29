import React from 'react';
import { Audio, useCurrentFrame } from 'remotion';

// Assets
import paperTexture from './assets/paper-texture.png';
import recordCaseTexture from './assets/record-case-texture.png';
import record from './assets/record.png';
import { modifyHex } from './service';

const MusicVideo: React.FC<TProps> = (props) => {
  const [color] = React.useState('#F5C26E');
  const { track, showSpotifyCode } = props;
  const frame = useCurrentFrame();
  const rotation = ((frame / 100) * 360) % 360;

  return (
    <div className={'flex items-center justify-center w-full h-full'}>
      {/* Audio */}
      <Audio src={track.previewUrl} />

      {/* Background */}
      <div className={'absolute top-0 left-0 w-full h-full z-[-10]'}>
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
            backgroundBlendMode: 'exclusion',
          }}
        />
      </div>

      <div className={'relative'}>
        <div
          className={
            'absolute left-0 right-0 top-[-200px] ml-auto mr-auto w-[820px] h-[820px]'
          }
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center',
          }}
        >
          <img src={record} className={'absolute top-0 left-0 w-full h-full'} />
          <div
            className={
              'absolute top-0 left-0 w-full h-full rounded-full mix-blend-color-dodge'
            }
            style={{
              background: `linear-gradient(to right, black, ${modifyHex(color, {
                darken: 20,
                opacity: 0.5,
              })}, black)`,
            }}
          />
          <div
            className={
              'absolute top-0 left-0 w-full h-full rounded-full mix-blend-color-dodge'
            }
            style={{
              background: `linear-gradient(to top, black, ${modifyHex(color, {
                darken: 20,
                opacity: 0.5,
              })}, black)`,
            }}
          />
        </div>

        <div className="relative w-[890px] h-[890px] rounded-[64px] overflow-hidden">
          <img
            src={track.imageUrl}
            className={'absolute top-0 left-0 w-full h-full'}
          />
          <img
            src={recordCaseTexture}
            className={
              'absolute top-0 left-0 w-full h-full mix-blend-difference'
            }
          />
          <div
            className={'absolute inset-0 rounded-[inherit]'}
            style={{
              boxShadow: 'inset 0px 0px 0px 8px rgba(0, 0, 0, 0.2)',
            }}
          />
        </div>
      </div>
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
