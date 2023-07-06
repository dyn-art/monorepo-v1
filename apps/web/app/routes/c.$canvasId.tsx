import { renderRelativeParent } from '@pda/dtif-to-react';
import { TFrameNode, TScene } from '@pda/types/dtif';
import { LoaderArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import React from 'react';
import Canvas from '../components/canvas';
import { coreService } from '../core/api';

export async function loader(args: LoaderArgs) {
  const {
    params: { canvasId },
  } = args;
  let scene: TScene | null = null;
  let initialRenderedNode: React.ReactNode | null = null;
  if (canvasId != null) {
    scene = await coreService.downloadJsonFromS3(canvasId);
    // if (scene != null) {
    //   initialRenderedNode = await renderRelativeParent(
    //     scene.root as TFrameNode,
    //     0.2
    //   );
    // }
  }
  return json<TLoader>({
    id: canvasId ?? 'not-set',
    scene,
    initialRenderedNode,
  });
}

const CanvasId: React.FC = () => {
  const {
    id,
    scene: _scene,
    initialRenderedNode,
  } = useLoaderData<typeof loader>();
  const scene: TScene | null = _scene as any;
  const [nodeAsJSX, setNodeAsJSX] = React.useState<React.ReactNode | null>(
    initialRenderedNode as React.ReactNode
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
      {/* {nodeAsJSX != null ? nodeAsJSX : <div>Loading</div>} */}
      {scene != null && <Canvas scene={scene} />}
    </div>
  );
};

export default CanvasId;

type TLoader = {
  id: string;
  scene: TScene | null;
  initialRenderedNode: React.ReactNode | null;
};
