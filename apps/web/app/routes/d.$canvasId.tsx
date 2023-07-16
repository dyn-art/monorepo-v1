import { coreService } from '@/core/api';
import { InteractiveScene, Scene, d3 } from '@pda/dtif-to-svg';
import { TScene } from '@pda/types/dtif';
import { shortId } from '@pda/utils';
import { LoaderArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import React from 'react';

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
  const d3CanvasRef = React.useRef();
  const [d3Scene, setD3Scene] = React.useState<Scene | null>(null);
  const [isLoadingD3Scene, setIsLoadingD3Scene] = React.useState(false);

  // ============================================================================
  // Lifecycle
  // ============================================================================

  React.useEffect(() => {
    if (!isLoadingD3Scene && d3CanvasRef.current != null && scene != null) {
      (async () => {
        setIsLoadingD3Scene(true);
        const canvasContainerNode = (await d3())
          .select(d3CanvasRef.current as any)
          .node();

        // Init D3 scene if not already done
        if (!canvasContainerNode.firstChild) {
          // Init D3 scene
          const d3Scene = await new InteractiveScene(scene).init();
          setD3Scene(d3Scene);

          // Append D3 scene to DOM node
          const d3SceneDOMNode = d3Scene.toDOMNode();
          if (d3SceneDOMNode != null) {
            canvasContainerNode.appendChild(d3SceneDOMNode);
          }
        }

        setIsLoadingD3Scene(false);
      })();
    }
  }, [scene, d3CanvasRef.current]);

  // TODO: REMOVE
  // React.useEffect(() => {
  //   setInterval(() => {
  //     if (d3Scene?.root instanceof Frame) {
  //       d3Scene.root.children.map((child) => {
  //         child.rotate(Math.random() * 180);
  //         // child.moveTo(
  //         //   Math.random() * (scene?.width ?? 0 - child.width),
  //         //   Math.random() * (scene?.height ?? 0 - child.height)
  //         // );
  //       });
  //     }
  //   }, 1000);
  // }, [d3Scene]);

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div>
      <h1>{id}</h1>
      <div id={'d3-canvas'} ref={d3CanvasRef as any} />
    </div>
  );
};

export default D3CanvasId;

type TLoader = {
  id: string;
  scene: TScene | null;
};
