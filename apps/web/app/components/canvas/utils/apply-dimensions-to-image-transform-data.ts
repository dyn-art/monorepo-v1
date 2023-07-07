import { T2DMatrixData } from './extract-matrix-data';

export function applyDimensionsToImageTransformData(
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
