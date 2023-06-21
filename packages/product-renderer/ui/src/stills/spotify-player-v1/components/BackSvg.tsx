import React from 'react';

const BackSvg = React.forwardRef<SVGSVGElement, TProps>((props, ref) => {
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
        d="M19.75 0a1 1 0 0 0-1 1v10.036L1.5 1.076a1 1 0 0 0-1.5.867v25.114a1 1 0 0 0 1.5.866l17.25-9.959V28a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1h-3Z"
        fill={color}
      />
    </svg>
  );
});

BackSvg.defaultProps = {
  color: '#FFFFFF',
  width: 26,
  height: 29,
};

export default BackSvg;

type TProps = {
  color?: string;
  width?: number;
  height?: number;
  className?: string; // Required to apply styling from Tailwind
} & React.SVGProps<SVGSVGElement>;
