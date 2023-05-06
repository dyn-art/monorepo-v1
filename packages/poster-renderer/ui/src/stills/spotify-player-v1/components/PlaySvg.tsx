import React from 'react';

const PlaySvg = React.forwardRef<SVGSVGElement, TProps>((props, ref) => {
  const { size, color, ...others } = props;

  return (
    <svg
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...others}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M68 34c0 18.778-15.222 34-34 34S0 52.778 0 34 15.222 0 34 0s34 15.222 34 34ZM24 22a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v23a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V22Zm15-1a1 1 0 0 0-1 1v23a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V22a1 1 0 0 0-1-1h-4Z"
        fill={color}
      />
    </svg>
  );
});

PlaySvg.defaultProps = {
  color: '#FFFFFF',
  size: 68,
};

export default PlaySvg;

type TProps = {
  color?: string;
  size?: number;
  className?: string; // Required to apply styling from Tailwind
} & React.SVGProps<SVGSVGElement>;
