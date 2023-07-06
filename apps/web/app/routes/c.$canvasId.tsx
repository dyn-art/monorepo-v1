import { renderRelativeParent } from '@pda/dtif-to-react';
import { TFrameNode, TScene } from '@pda/types/dtif';
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
  let scene: TScene | null = null;
  if (canvasId != null) {
    scene = await coreService.downloadJsonFromS3(canvasId);
  }
  logger.info('Resolved canvas loader', { canvasId });
  return { id: canvasId, scene };
}

const CanvasId: React.FC = () => {
  const { id, scene } = useLoaderData<typeof loader>();
  const [nodeAsJSX, setNodeAsJSX] = React.useState<React.ReactNode | null>(
    null
  );

  // ============================================================================
  // Lifecycle
  // ============================================================================

  // Render node as JSXs
  React.useEffect(() => {
    const renderNodeAsJSX = async () => {
      if (scene != null) {
        const jsxNode = await renderRelativeParent(
          scene.root as TFrameNode,
          0.2
        );
        setNodeAsJSX(jsxNode);
      }
    };
    renderNodeAsJSX();
  }, [scene]);

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div>
      <h1>{id}</h1>
      {nodeAsJSX}
    </div>
  );
};

export default CanvasId;
