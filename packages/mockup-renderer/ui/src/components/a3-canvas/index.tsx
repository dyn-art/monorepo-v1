import React from 'react';
import dropShadowImg from './assets/drop-shadow.png';
import exampleContentImg from './assets/example-content.png';
import shadowImg from './assets/shadow.png';

const A3Canvas: React.FC<TProps> = (props) => {
  const { imageUrl = exampleContentImg, scale = 1 } = props;

  //   return (
  //     <div className="relative w-[100px] h-[100px] bg-pink-300">
  //       <div className="absolute top-[-30px] left-[-30px] w-[120px] h-[120px] bg-blue-500"></div>
  //     </div>
  //   );

  return (
    <div
      className="relative"
      style={{
        width: 1014 * scale,
        height: 1435 * scale,
      }}
    >
      <div
        className="absolute -top-[3px] right-0"
        style={{
          width: 1241 * scale,
          height: 1482 * scale,
          backgroundSize: `${1241 * scale}px ${1481 * scale}px`,
          backgroundImage: `url(${dropShadowImg})`,
        }}
      />
      <div
        className="absolute top-0 right-0"
        style={{
          width: 1014 * scale,
          height: 1435 * scale,
          backgroundSize: `${1014 * scale}px ${1434 * scale}px`,
          backgroundImage: `url(${imageUrl})`,
        }}
      />
      <div
        className="absolute top-0 right-0 mix-blend-multiply"
        style={{
          width: 1014 * scale,
          height: 1435 * scale,
          backgroundSize: `${1014 * scale}px ${1434 * scale}px`,
          backgroundImage: `url(${shadowImg})`,
        }}
      />
    </div>
  );
};

export default A3Canvas;

type TProps = {
  imageUrl?: string;
  scale?: number;
};
