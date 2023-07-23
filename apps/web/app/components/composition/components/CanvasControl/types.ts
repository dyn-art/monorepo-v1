import { TVector } from '@pda/types/dtif';

export type TXYWH = {
  width: number;
  height: number;
} & TVector;

export enum EHandleSide {
  Top = 1,
  Bottom = 2,
  Left = 4,
  Right = 8,
}

export type SceneState =
  | {
      mode: ECanvasMode.NONE;
    }
  | {
      mode: ECanvasMode.SELECTION_NET;
      origin: TVector;
      current?: TVector;
    }
  | {
      mode: ECanvasMode.TRANSLATING;
      current: TVector;
    }
  | {
      mode: ECanvasMode.PRESSING;
      origin: TVector;
    }
  | {
      mode: ECanvasMode.RESIZING;
      initialBounds: TXYWH;
      corner: EHandleSide;
    };

export enum ECanvasMode {
  /**
   * Default canvas mode. Nothing is happening.
   */
  NONE,
  /**
   * When the user's pointer is pressed
   */
  PRESSING,
  /**
   * When the user is selecting multiple layers at once
   */
  SELECTION_NET,
  /**
   * When the user is moving layers
   */
  TRANSLATING,
  /**
   * When the user is resizing a layer
   */
  RESIZING,
}
