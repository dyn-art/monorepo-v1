import { InteractiveScene, d3 } from '@pda/dtif-to-svg';
import { TScene } from '@pda/types/dtif';
import React from 'react';

export function useD3Scene(scene: TScene) {
  const canvasRef = React.useRef();
  const [d3Scene, setD3Scene] = React.useState<InteractiveScene | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && canvasRef.current != null && scene != null) {
      (async () => {
        setIsLoading(true);

        // Get canvas container from DOM
        const canvasContainerNode = (await d3())
          .select(canvasRef.current as any)
          .node();

        // Init new D3 scene if none already exists
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

        setIsLoading(false);
      })();
    }
  }, [scene, canvasRef.current]);

  return { canvasRef, d3Scene, isLoading };
}
