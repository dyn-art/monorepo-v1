import { InteractiveComposition, d3 } from '@pda/dtom';
import { TComposition } from '@pda/types/dtif';
import React from 'react';

export function useComposition(composition: TComposition) {
  const canvasRef = React.useRef();
  const [d3Scene, setD3Scene] = React.useState<InteractiveComposition | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && canvasRef.current != null && composition != null) {
      (async () => {
        setIsLoading(true);

        // Get canvas container from DOM
        const canvasContainerNode = (await d3())
          .select(canvasRef.current as any)
          .node();

        // Init new D3 scene if none already exists
        if (!canvasContainerNode.firstChild) {
          // Init D3 scene
          const d3Scene = await new InteractiveComposition(composition).init();
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
  }, [composition, canvasRef.current]);

  return {
    canvasRef: canvasRef as unknown as React.LegacyRef<HTMLDivElement>,
    d3Scene,
    isLoading,
  };
}
