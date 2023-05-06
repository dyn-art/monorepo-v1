import clsx from 'clsx';
import React from 'react';

export const CustomSlider: React.FC<TProps> = (props) => {
  const { current, max, color, className } = props;

  return (
    <div className={clsx('relative h-1', className)}>
      {/* Slider background */}
      <div
        className={`absolute top-0 bottom-0 left-0 right-0 rounded-lg`}
        style={{ backgroundColor: color.background }}
      />
      {/* Active slider part */}
      <div
        className={`absolute top-0 bottom-0 left-0 rounded-lg`}
        style={{
          width: `${(current / max) * 100}%`,
          backgroundColor: color.activeBackground,
        }}
      />
      {/* Slider thumb */}
      <div
        className={`absolute top-1/2 left-1/2 w-3 h-3 rounded-full`}
        style={{
          left: `${(current / max) * 100}%`,
          transform: `translate(-${(current / max) * 100}%, -50%)`,
          backgroundColor: color.thumb,
        }}
      />
    </div>
  );
};

export default CustomSlider;

type TProps = {
  current: number;
  max: number;
  color: {
    thumb: string;
    background: string;
    activeBackground: string;
  };
  className?: string;
};
