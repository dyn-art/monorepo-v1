import { coreService } from '@/core/api';
import { TScene } from '@pda/types/dtif';
import { shortId } from '@pda/utils';
import { LoaderArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import React from 'react';
import D3Canvas, { links as d3CanvasLinks } from '../components/d3-canvas';

export const links = () => [...d3CanvasLinks()];

export async function loader(args: LoaderArgs) {
  const {
    params: { canvasId },
  } = args;
  let scene: TScene | null = null;
  if (canvasId != null) {
    scene = await coreService.downloadJsonFromS3(canvasId);
  }
  return json<TLoader>({
    id: canvasId ?? shortId(),
    scene,
  });
}

const D3CanvasId: React.FC = () => {
  const { id, scene: _scene } = useLoaderData<typeof loader>();
  const scene: TScene | null = _scene as any;

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div>
      <h1>{id}</h1>
      {scene != null && <D3Canvas scene={scene} />}
    </div>
  );
};

export default D3CanvasId;

type TLoader = {
  id: string;
  scene: TScene | null;
};
