import { coreService } from '@/core/api';
import { TComposition } from '@pda/types/dtif';
import { shortId } from '@pda/utils';
import { LoaderArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import React from 'react';
import {
  Composition,
  links as compositionLinks,
} from '../components/composition';

export const links = () => [...compositionLinks()];

export async function loader(args: LoaderArgs) {
  const {
    params: { canvasId },
  } = args;
  let scene: TComposition | null = null;
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
  const scene: TComposition | null = _scene as any;

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div>
      <h1>{id}</h1>
      {scene != null && <Composition scene={scene} />}
    </div>
  );
};

export default D3CanvasId;

type TLoader = {
  id: string;
  scene: TComposition | null;
};
