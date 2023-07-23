import { logger } from '@/core/logger';
import { InteractiveComposition } from '@pda/dtif-to-svg';
import React from 'react';
import { pointerEventToCompositionPoint } from '../../utils';
import { SelectionBox } from './components';
import { ECanvasMode, EHandleSide, TCanvasState, TXYWH } from './types';

export const CanvasControl: React.FC<TProps> = (props) => {
  const { composition: composition } = props;
  const [canvasState, setCanvasState] = React.useState<TCanvasState>({
    mode: ECanvasMode.NONE,
  });

  // ============================================================================
  // Lifecycle
  // ============================================================================

  /**
   * Register onPointerMove event
   */
  React.useEffect(() => {
    composition.onPointerMove((e, composition) => {
      e.preventDefault();
      const current = pointerEventToCompositionPoint(e);

      // Multi selection
      if (canvasState.mode === ECanvasMode.PRESSING) {
        // TODO: multi selection
      }

      // Selection Net
      else if (canvasState.mode === ECanvasMode.SELECTION_NET) {
        // TODO: selection net
      }

      // Translate
      else if (canvasState.mode === ECanvasMode.TRANSLATING) {
        // TODO: translate
        logger.info('Translate', { current });
      }

      // Resize
      else if (canvasState.mode === ECanvasMode.RESIZING) {
        // TODO resize
      }
    });
  }, [canvasState]);

  /**
   * Register onPointerDown event
   */
  React.useEffect(() => {
    composition.onPointerDown((e, composition) => {
      logger.info('onPointerDown', { e, composition });
      const current = pointerEventToCompositionPoint(e);
      setCanvasState({ mode: ECanvasMode.PRESSING, origin: current });
    });
  }, [canvasState]);

  /**
   * Register onPointerUp event
   */
  React.useEffect(() => {
    composition.onPointerUp((e, composition) => {
      logger.info('onPointerUp', { e, composition });
      if (
        canvasState.mode === ECanvasMode.NONE ||
        canvasState.mode === ECanvasMode.PRESSING
      ) {
        setCanvasState({ mode: ECanvasMode.NONE });
      }
    });
  }, [canvasState]);

  // TODO:
  React.useEffect(() => {
    if (composition != null) {
      composition.onPointerLeave((e, composition) => {
        logger.info('onPointerLeave', { e, composition });
      });
      composition.onWheel((e, composition) => {
        logger.info('onWheel', { e, composition });
      });
    }
  }, [composition]);

  // ============================================================================
  // Callbacks
  // ============================================================================

  /**
   * Start resizing the layer
   */
  const onResizeHandlePointerDown = React.useCallback(
    (corner: EHandleSide, initialBounds: TXYWH) => {
      setCanvasState({
        mode: ECanvasMode.RESIZING,
        initialBounds,
        corner,
      });
    },
    []
  );

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <svg
      id={'canvas-control'}
      className="absolute w-full h-full pointer-events-none"
      overflow={'visible'}
    >
      <SelectionBox
        composition={composition}
        onResizeHandlePointerDown={onResizeHandlePointerDown}
      />
    </svg>
  );
};

type TProps = {
  composition: InteractiveComposition;
};
