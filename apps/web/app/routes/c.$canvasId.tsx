import Canvas from '@/components/canvas';
import { Button } from '@/components/primitive/button';
import { coreService } from '@/core/api';
import { logger } from '@/core/logger';
import { renderRelativeParent } from '@pda/dtif-to-react';
import { TFrameNode, TScene } from '@pda/types/dtif';
import { LoaderArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import * as htmlToImage from 'html-to-image';
import React from 'react';

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
  const canvasRef = React.useRef(null);

  const downloadImage = React.useCallback(async () => {
    logger.info({ current: canvasRef.current });
    if (canvasRef.current != null) {
      try {
        const pngDataUrl = await htmlToImage.toPng(canvasRef.current, {
          cacheBust: true,
          width: scene?.width,
          height: scene?.height,
        });
        const link = document.createElement('a');
        link.download = 'my-image.png';
        link.href = pngDataUrl;
        link.click();
      } catch (error) {
        logger.error('Failed to download image!', error);
      }
    }
  }, [canvasRef]);

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
      {scene != null && <Canvas scene={scene} canvasRef={canvasRef} />}
      <Button onClick={downloadImage}>Download</Button>
    </div>
  );
};

export default CanvasId;

type TLoader = {
  id: string;
  scene: TScene | null;
  initialRenderedNode: React.ReactNode | null;
};
