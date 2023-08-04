import { coreService } from '@/core/api';
import { TComposition } from '@pda/types/dtif';
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
    params: { compositionId },
  } = args;
  let composition: TComposition | null = null;
  if (compositionId != null) {
    composition = await coreService.downloadJsonFromS3(compositionId);
  }
  return json<TLoader>({
    id: compositionId,
    composition,
  });
}

const D3CanvasId: React.FC = () => {
  const { id, composition: _composition } = useLoaderData<typeof loader>();
  const composition: TComposition | null = _composition as any;

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div>
      <h1>{id ?? 'Not found'}</h1>
      {composition != null && <Composition composition={composition} />}
    </div>
  );
};

export default D3CanvasId;

type TLoader = {
  id?: string;
  composition: TComposition | null;
};
