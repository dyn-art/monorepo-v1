import React from 'react';

const ShuffleSvg = React.forwardRef<SVGSVGElement, TProps>((props, ref) => {
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
      <g clipPath="url(#a)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.766 1.833a.801.801 0 0 0-1.132 1.133L20.469 4.8H19.2c-2.074 0-3.662.934-5.005 2.224-1.073 1.03-2.046 2.347-3.003 3.645-.211.286-.42.57-.632.85C8.174 14.702 5.584 17.6.8 17.6a.8.8 0 0 0 0 1.6c5.616 0 8.286-2.98 10.7-6.2.23-.306.793-1.127 1.012-1.423.955-1.293 1.824-2.47 2.792-3.399C16.462 7.065 17.674 6.4 19.2 6.4h1.269l-1.835 1.833a.801.801 0 0 0 1.132 1.133l3.2-3.2a.8.8 0 0 0 0-1.133l-3.2-3.2ZM.8 4.8c4.565 0 7.408 2.313 9.608 4.907l-.206.282c-.257.348-.515.694-.775 1.04-2.11-2.56-4.585-4.63-8.627-4.63a.8.8 0 0 1 0-1.6Zm13.395 12.176c-.8-.767-1.54-1.691-2.262-2.648.302-.38.59-.758.867-1.128l.144-.192c.79 1.062 1.54 2.029 2.36 2.816 1.158 1.11 2.37 1.776 3.896 1.776h1.269l-1.835-1.834a.801.801 0 0 1 1.132-1.133l3.2 3.2a.8.8 0 0 1 0 1.133l-3.2 3.2a.801.801 0 0 1-1.132-1.133l1.835-1.833H19.2c-2.074 0-3.662-.934-5.005-2.224Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill={color} d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
});

ShuffleSvg.defaultProps = {
  color: '#FFFFFF',
  size: 24,
};

export default ShuffleSvg;

type TProps = {
  color?: string;
  size?: number;
  className?: string; // Required to apply styling from Tailwind
} & React.SVGProps<SVGSVGElement>;
