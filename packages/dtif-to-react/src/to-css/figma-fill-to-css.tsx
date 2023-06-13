import {
  TFrameNode,
  TGradientPaint,
  TImagePaint,
  TNode,
  TPaint,
  TRectangleNode,
  TSolidPaint,
  TTextNode,
} from '@pda/dtif-types';
import React from 'react';
import { createLinearGradient, getS3BucketURLFromHash } from '../helper';
import {
  T2DMatrixData,
  extractMatrixData,
} from '../helper/extract-data-from-matrix';
import { figmaBlendModeToCSS } from './figma-blend-mode-to-css';
import { figmaRGBToCss } from './figma-rgb-to-css';
import { figmaTransformToCSS } from './figma-transform-to-css';

/**
 * Helper function to convert Figma fill properties to equivalent CSS properties.
 *
 * @param fills - The Figma fill properties to be translated.
 * @param node - The Figma node to which the fill is applied.
 * @param isText - A flag indicating whether the fill is applied to a text element.
 * @returns An object representing the CSS properties equivalent to the Figma fill.
 */
export async function figmaFillToCSS(
  fill: TPaint,
  node: TRectangleNode | TFrameNode | TTextNode
): Promise<React.CSSProperties> {
  let fillStyle: React.CSSProperties = {};

  // Handle different fill types
  switch (fill.type) {
    case 'SOLID':
      fillStyle = handleSolid(fill);
      break;
    case 'GRADIENT_LINEAR':
      console.warn(`'${fill.type}' is currently only partly supported!`);
      if (fill.exported != null) {
        fillStyle = handleExportedGradient(fill);
      } else {
        fillStyle = handleLinearGradient(fill, node);
      }
      break;
    case 'GRADIENT_RADIAL':
    case 'GRADIENT_ANGULAR':
    case 'GRADIENT_DIAMOND':
      // TODO: support later if required
      console.error(`'${fill.type}' is currently not supported!`);
      fillStyle = handleExportedGradient(fill);
      break;
    case 'IMAGE':
      fillStyle = await handleImage(fill, node);
      break;
    default:
    // do nothing
  }

  return {
    ...fillStyle,
    ...figmaBlendModeToCSS(fill.blendMode),
    opacity: fill.opacity ?? 1,
  };
}

// Handle solid fill
function handleSolid(fill: TSolidPaint): React.CSSProperties {
  return {
    backgroundColor: figmaRGBToCss(fill.color),
  };
}

// Handle linear gradient fill
function handleLinearGradient(
  fill: TGradientPaint,
  node: TNode
): React.CSSProperties {
  return { background: createLinearGradient(fill, node) };
}

// Handle exported gradient fill
function handleExportedGradient(fill: TGradientPaint): React.CSSProperties {
  const imageUrl = getS3BucketURLFromHash(fill.exported?.hash || '');
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundRepeat: 'no-repeat',
    WebkitBackgroundSize: 'contain',
  };
}

// Handle image fill
async function handleImage(
  fill: TImagePaint,
  node: TNode
): Promise<React.CSSProperties> {
  const imageUrl = getS3BucketURLFromHash(fill.hash || '');
  const { width: imageWidth, height: imageHeight } = await getImageDimensions(
    imageUrl
  );

  // Apply crop transform
  let transform: React.CSSProperties = {};
  if (fill.scaleMode === 'CROP' && fill.transform != null) {
    const { width, height } = calculateCropImageSize(
      { width: node.width, height: node.height },
      {
        width: imageWidth,
        height: imageHeight,
      }
    );
    const transformData = extractMatrixData(fill.transform);
    const transformDataWithDimensions = applyDimensionsToImageTransformData(
      transformData,
      { width, height },
      { width: node.width, height: node.height }
    );
    transform = {
      ...figmaTransformToCSS({
        width,
        height,
        transform: transformDataWithDimensions,
      }),
      transformOrigin: 'top left',
      width,
      height,
    };
  }

  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: fill.scaleMode,
    backgroundRepeat: 'no-repeat',
    WebkitBackgroundSize: 'contain',
    ...transform,
  };
}

function getImageDimensions(
  url: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      resolve({ width: this['width'], height: this['height'] });
    };
    img.onerror = function () {
      reject(new Error(`Could not load image at ${url}`));
    };
    img.src = url;
  });
}

function applyDimensionsToImageTransformData(
  transformData: T2DMatrixData,
  image: {
    width: number;
    height: number;
  },
  container: {
    width: number;
    height: number;
  }
): T2DMatrixData {
  // Calculate the ratio between the container dimensions and the cropped image dimensions.
  // This ratio is used to adjust the scale of the image, since the scale from the imageTransform matrix
  // is expressed in terms of the container dimensions.
  // e.g. image: width=100,height=100 ; container: width=200,height=100 -> scaleX=2,scaleY=1
  //      which is not correct as the image hasn't scaled so it needs to be counteracted
  const xRatio = container.width / image.width;
  const yRatio = container.height / image.height;

  // Calculate scale
  const scaleX = (1 / transformData.scaleX) * xRatio;
  const scaleY = (1 / transformData.scaleY) * yRatio;

  // Calculate position
  const tx = -image.width * transformData.tx * scaleX;
  const ty = -image.height * transformData.ty * scaleY;

  return {
    ...transformData,
    scaleX,
    scaleY,
    tx,
    ty,
  };
}

function calculateCropImageSize(
  container: {
    width: number;
    height: number;
  },
  image: {
    width: number;
    height: number;
  }
): { width: number; height: number } {
  let newWidth: number;
  let newHeight: number;

  // Calculate ratio
  const containerRatio = container.width / container.height;
  const imageRatio = image.width / image.height;

  // Apply ratio to new width and height
  if (imageRatio > containerRatio) {
    newHeight = container.height;
    newWidth = newHeight * imageRatio;
  } else {
    newWidth = container.width;
    newHeight = newWidth / imageRatio;
  }

  return { width: newWidth, height: newHeight };
}
