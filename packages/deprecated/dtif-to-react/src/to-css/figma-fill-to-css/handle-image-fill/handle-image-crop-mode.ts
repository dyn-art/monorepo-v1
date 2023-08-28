import { TImagePaintCrop, TNode } from '@dyn/types/dtif';
import { T2DMatrixData, extractMatrixData } from '../../../utils';
import { figmaTransformToCSS } from '../../figma-transform-to-css';

export async function handleImageCropMode(
  imageUrl: string,
  fill: TImagePaintCrop,
  node: TNode
): Promise<React.CSSProperties | null> {
  if (fill.transform == null) return null;

  // Calculate crop image size
  // -> the image size so that it fits into the crop container
  const { width: imageWidth, height: imageHeight } = await getImageDimensions(
    imageUrl
  );
  const { width, height } = calculateCropImageSize(
    { width: node.width, height: node.height },
    {
      width: imageWidth,
      height: imageHeight,
    }
  );

  // Extract transform data from transform matrix and apply image dimensions
  // as the transform matrix is based on percentage
  const transformData = extractMatrixData(fill.transform);
  const transformDataWithDimensions = applyDimensionsToImageTransformData(
    transformData,
    { width, height },
    { width: node.width, height: node.height }
  );

  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    ...figmaTransformToCSS(transformDataWithDimensions),
    transformOrigin: 'top left',
    width,
    height,
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
