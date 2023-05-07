import React from 'react';
import { EImageOrigins, TComposition, TImage } from './types';

type TProps = {
  composition: TComposition;
};

const ImageComposition: React.FC<TProps> = (props) => {
  const {
    composition: { width, height, layers },
  } = props;

  const renderLayer = (layer: TImage) => {
    const {
      key,
      imageUrl,
      width: layerWidth,
      height: layerHeight,
      blendMode,
      offset,
      origin,
      opacity,
      rotation,
      scale,
      visible,
    } = layer;

    const style: React.CSSProperties = {
      position: 'absolute',
      width: layerWidth,
      height: layerHeight,
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      mixBlendMode: blendMode,
      opacity,
      transform: `translate(${offset?.x ?? 0}px, ${offset?.y ?? 0}px) rotate(${
        rotation ?? 0
      }deg) scaleX(${scale?.x ?? 1}) scaleY(${scale?.y ?? 1})`,
      transformOrigin:
        origin === EImageOrigins.TOP_LEFT
          ? 'top left'
          : origin === EImageOrigins.TOP_RIGHT
          ? 'top right'
          : 'center',
      visibility: visible === false ? 'hidden' : 'visible',
    };

    return <div key={key} style={style} />;
  };

  return (
    <div className="relative" style={{ width, height }}>
      {layers.map(renderLayer)}
    </div>
  );
};

export default ImageComposition;
