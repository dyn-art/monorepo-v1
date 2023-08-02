import React from 'react';

const RepeatSvg = React.forwardRef<SVGSVGElement, TProps>((props, ref) => {
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
        d="M16.611 2H6.39C3.949 2 2 3.957 2 6.333v6.334C2 15.044 3.948 17 6.389 17H6.5v2h-.111C2.86 19 0 16.165 0 12.667V6.333C0 2.836 2.86 0 6.389 0H16.61C20.14 0 23 2.836 23 6.333v6.334C23 16.165 20.14 19 16.611 19h-4.115l2.71 2.71a.5.5 0 0 1 0 .706l-.708.707a.5.5 0 0 1-.707 0l-3.707-3.707.128-.128-.5-.5-.39-.391L9 18.076v-.152L9.924 17h.034l3.83-3.83a.5.5 0 0 1 .707 0l.707.707a.5.5 0 0 1 0 .707L12.786 17h3.825C19.051 17 21 15.043 21 12.667V6.333C21 3.957 19.052 2 16.611 2ZM14 29a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
        fill={color}
      />
    </svg>
  );
});

RepeatSvg.defaultProps = {
  color: '#65D46E',
  width: 23,
  height: 31,
};

export default RepeatSvg;

type TProps = {
  color?: string;
  width?: number;
  height?: number;
  className?: string; // Required to apply styling from Tailwind
} & React.SVGProps<SVGSVGElement>;
