import React from 'react';
import {
  Audio,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import SpotifyCode from './components/SpotifyCode';
import { modifyHex } from './service';

// Assets
import noise from './assets/noise.mp3';
import paperTexture from './assets/paper-texture.png';
import recordCaseTexture from './assets/record-case-texture.png';
import record from './assets/record.png';

import './styles.css';

const MusicVideo: React.FC<TProps> = (props) => {
  const { track, showSpotifyCode, backgroundColor, textColor } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const recordTranslateY = spring({
    fps,
    frame,
  });
  const recordInterpolatedTranslateY = interpolate(
    recordTranslateY,
    [0, 1],
    [0, -200]
  );
  const recordRotation = ((frame / 100) * 360) % 360;

  return (
    <div
      className={
        'flex h-full w-full flex-col items-center justify-between p-24'
      }
    >
      {/* Audio */}
      <Audio src={track.previewUrl} volume={0.01} />
      <Audio src={noise} volume={0.1} loop={true} />

      {/* Background */}
      <div className={'absolute top-0 left-0 z-[-10] h-full w-full'}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: backgroundColor,
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

      <div className={'flex w-full flex-row'}>
        <div className={'flex flex-col'}>
          <p
            className={'font-["Londrina_Solid"] text-[96px] font-black'}
            style={{ color: textColor }}
          >
            {track.name}
          </p>
          <p
            className={'-mt-2 font-[Inter] text-[48px] font-normal opacity-60'}
            style={{ color: textColor }}
          >
            {track.artists.join(', ')}
          </p>
          <span
            className={
              'mt-4 w-max flex-shrink-0 border-2 border-solid px-2 font-[Inter] text-[32px] font-normal opacity-60'
            }
            style={{ borderColor: textColor }}
          >
            {track.releaseDate.getFullYear()}
          </span>
        </div>
      </div>

      <div>
        {/* Record Player */}
        <div className={'relative flex w-full justify-center'}>
          {/* Record */}
          <div
            className={
              'absolute left-0 right-0 top-0 ml-auto mr-auto h-[820px] w-[820px] rounded-full'
            }
            style={{
              boxShadow:
                '16px 32px 48px rgba(0, 0, 0, 0.64), 8px 12px 32px rgba(0, 0, 0, 0.32)',
              transform: `translateY(${recordInterpolatedTranslateY}px)`,
            }}
          >
            <div
              className={'h-full w-full'}
              style={{
                transform: `rotate(${recordRotation}deg)`,
                transformOrigin: 'center',
              }}
            >
              <img
                src={record}
                className={'absolute top-0 left-0 h-full w-full'}
              />
              <div
                className={
                  'absolute top-0 left-0 h-full w-full rounded-full mix-blend-color-dodge'
                }
                style={{
                  background: `linear-gradient(to right, black, ${modifyHex(
                    '#ffffff',
                    {
                      darken: 20,
                      opacity: 0.5,
                    }
                  )}, black)`,
                }}
              />
              <div
                className={
                  'absolute top-0 left-0 h-full w-full rounded-full mix-blend-color-dodge'
                }
                style={{
                  background: `linear-gradient(to top, black, ${modifyHex(
                    '#ffffff',
                    {
                      darken: 20,
                      opacity: 0.5,
                    }
                  )}, black)`,
                }}
              />
            </div>
          </div>

          {/* Record Case */}
          <div
            className="relative h-[890px] w-[890px] overflow-hidden rounded-[64px]"
            style={{
              filter: 'drop-shadow(16px 32px 48px rgba(0, 0, 0, 0.64))',
            }}
          >
            <img
              src={track.imageUrl}
              className={'absolute top-0 left-0 h-full w-full'}
            />
            <img
              src={recordCaseTexture}
              className={
                'absolute top-0 left-0 h-full w-full mix-blend-difference'
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

        {/* Spotify Code */}
        {showSpotifyCode && (
          <div
            className={'mt-24 -mb-12 flex w-full items-center justify-center'}
          >
            <SpotifyCode color={textColor} trackId={track.id} height={96} />
          </div>
        )}
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
  backgroundColor: string;
  textColor: string;
};
