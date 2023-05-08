export interface RunEvent {}

export interface DropEvent {
  // property: boolean; // TODO:  doesn't like property
}

export interface DocumentChangeEvent {}

export type ArgFreeEventType =
  | 'selectionchange'
  | 'currentpagechange'
  | 'close'
  | 'timerstart'
  | 'timerstop'
  | 'timerpause'
  | 'timerresume'
  | 'timeradjust'
  | 'timerdone';
