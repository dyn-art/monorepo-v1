import { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import React from 'react';
import { coreService } from '../core/api';
import { logger } from '../core/logger';

export async function loader(args: LoaderArgs) {
  const {
    params: { canvasId },
  } = args;
  logger.info('Called canvas loader', { canvasId });
  let data: Record<string, any> | null = null;
  if (canvasId != null) {
    data = await coreService.downloadJsonFromS3(canvasId);
  }
  logger.info('Resolved canvas loader', { canvasId });
  return { id: canvasId, json: data };
}

const CanvasId: React.FC = () => {
  const { id, json } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>{id}</h1>
      {json != null && <p>{JSON.stringify(json)}</p>}
    </div>
  );
};

export default CanvasId;
