import React from 'react';
import BackSvg from './components/BackSvg';
import HeartSvg from './components/HeartSvg';
import PlaySvg from './components/PlaySvg';
import RepeatSvg from './components/RepeatSvg';
import ShuffleSvg from './components/ShuffleSvg';
import SkipSvg from './components/SkipSvg';
import {
  formatDuration,
  getSliderBackgroundSize,
  getSpotifyCodeUrl,
} from './service';
import './styles.css';

const SpotifyPlayerV1: React.FC<TProps> = (props) => {
  const { title, subtitle, time, spotifyCode, trackId, imageUrl } = props;

  return (
    <div className={'h-full w-full bg-[#131212] p-16'}>
      <img src={imageUrl} />

      {/* Content */}
      <div className={'mt-6'}>
        {/* Title Playing */}
        <div className={'flex flex-row items-center justify-between'}>
          <div>
            <p className={'font-[Montserrat] text-3xl font-bold text-white'}>
              {title}
            </p>
            <p
              className={
                'mt-1 font-[Montserrat] text-base font-normal text-[#B3B3B3]'
              }
            >
              {subtitle}
            </p>
          </div>
          <HeartSvg />
        </div>

        {/* Player Timeline */}
        <div className={'mt-2 w-full'}>
          <input
            type="range"
            min={0}
            max={time.total}
            value={time.current}
            className={'slider'}
            style={getSliderBackgroundSize(time.current, time.total)}
          />
          <div className={'flex w-full items-center justify-between'}>
            <span
              className={'font-[Montserrat] text-sm font-bold text-[#B3B3B3]'}
            >
              {formatDuration(time.current)}
            </span>
            <span
              className={'font-[Montserrat] text-sm font-bold text-[#B3B3B3]'}
            >
              {formatDuration(time.total)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div
          className={'mt-4 flex w-full flex-row items-center justify-between'}
        >
          <ShuffleSvg />
          <div className={'flex flex-row items-center'}>
            <SkipSvg />
            <PlaySvg className={'mx-8'} />
            <BackSvg />
          </div>
          <RepeatSvg />
        </div>

        {/* Spotify Code */}
        {spotifyCode && (
          <div className={'mt-4 flex w-full items-center justify-center'}>
            <img
              src={getSpotifyCodeUrl({
                backgroundColor: '131212',
                trackId,
              })}
              className={'h-12'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotifyPlayerV1;

type TProps = {
  title: string;
  subtitle: string;
  time: {
    total: number;
    current: number;
  };
  spotifyCode: boolean;
  trackId: string;
  imageUrl: string;
};
