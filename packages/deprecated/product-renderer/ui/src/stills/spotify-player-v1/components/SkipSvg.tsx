import React from 'react';

const SkipSvg = React.forwardRef<SVGSVGElement, TProps>((props, ref) => {
  const { width, height, color, ...others } = props;

  return (
    <svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...others}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 0a1 1 0 0 0-1 1v27a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V16.81l19.25 11.113a1 1 0 0 0 1.5-.866V1.943a1 1 0 0 0-1.5-.866L5 12.19V1a1 1 0 0 0-1-1H1Z"
        fill={color}
      />
    </svg>
  );
});

SkipSvg.defaultProps = {
  color: '#FFFFFF',
  width: 26,
  height: 29,
};

export default SkipSvg;

type TProps = {
  color?: string;
  width?: number;
  height?: number;
  className?: string; // Required to apply styling from Tailwind
} & React.SVGProps<SVGSVGElement>;
