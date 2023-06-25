import { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import React from 'react';
import { logger } from '../core/logger';

export function loader(args: LoaderArgs) {
  const {
    params: { canvasId },
  } = args;
  logger.info('Called canvas loader', { canvasId });
  return { id: canvasId };
}

const CanvasId: React.FC = () => {
  const { id } = useLoaderData<typeof loader>();
  return <div>{id}</div>;
};

export default CanvasId;
