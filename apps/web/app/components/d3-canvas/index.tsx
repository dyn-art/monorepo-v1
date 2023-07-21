import { InteractiveScene, d3 } from '@pda/dtif-to-svg';
import { TScene } from '@pda/types/dtif';
import React from 'react';
import { SelectedNodeDisplay } from './components';
import styles from './styles.css';

// https://remix.run/docs/en/main/guides/styling#shared-stylesheet
export const links = () => [{ rel: 'stylesheet', href: styles }];

const D3Canvas: React.FC<TProps> = (props) => {
  const { scene } = props;
  const d3CanvasRef = React.useRef();
  const [d3Scene, setD3Scene] = React.useState<InteractiveScene | null>(null);
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

  return (
    <div>
      {d3Scene && <SelectedNodeDisplay scene={d3Scene} />}
      <div
        id={'viewport'}
        className="viewport-container"
        style={{ width: scene.width, height: scene.height }}
      >
        <div
          id={'canvas'}
          ref={d3CanvasRef as any}
          className="absolute h-full w-full pointer-events-auto"
        />
        <svg
          id={'viewport-controls'}
          className="absolute w-full h-full pointer-events-none"
        >
          {/* TODO */}
          <circle
            cx={50}
            cy={50}
            r={50}
            style={{ pointerEvents: 'auto' }}
            fill="red"
          />
        </svg>
      </div>
    </div>
  );
};

export default D3Canvas;

type TProps = {
  scene: TScene;
};
