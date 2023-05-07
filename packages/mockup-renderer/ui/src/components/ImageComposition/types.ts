import { Properties } from 'csstype';

export enum EImageOrigins {
  TOP_LEFT,
  TOP_RIGHT,
}

export type TBlendModes = Properties['mixBlendMode'];

export type TImage = {
  // Unique identifier for the image layer
  key: string;

  // URL of the image
  imageUrl: string;

  // Width of the image
  width: number;

  // Height of the image
  height: number;

  // Blend mode to apply when rendering the layer (e.g., 'multiply', 'overlay')
  blendMode?: TBlendModes;

  // Optional offset for positioning the image layer
  offset?: {
    x: number; // Horizontal offset
    y: number; // Vertical offset
  };

  // Optional origin point for positioning the image layer (e.g., TOP_LEFT, TOP_RIGHT)
  origin?: EImageOrigins;

  // Optional opacity level, between 0 (completely transparent) and 1 (completely opaque)
  opacity?: number;

  // Optional rotation angle in degrees
  rotation?: number;

  // Optional  scaling factor
  scale?: {
    x: number; // Horizontal scaling factor
    y: number; // Vertical scaling factor
  };

  // Optional flag to control the visibility of the layer (true for visible, false for hidden)
  visible?: boolean;
};

export type TComposition = {
  width: number;
  height: number;
  layers: TImage[];
};
