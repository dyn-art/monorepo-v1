import { ModalBuilder, ModalSubmitInteraction } from 'discord.js';
import ComponentType from '../ComponentType';
import BaseComponent from './BaseComponent';
import { TComponentMetaBase } from './types';

export default class ModalComponent extends BaseComponent<
  Omit<TComponentModalMeta, 'key'>
> {}

// ============================================================================
// Type Methods
// ============================================================================

export function isComponentModalMetaType(
  value: any
): value is TComponentModalMeta {
  return (
    value != null &&
    (value.type === ComponentType.MODAL ||
      (value.modal instanceof ModalBuilder &&
        typeof value.callback === 'function'))
  );
}

// ============================================================================
// Base Types
// ============================================================================

export type TComponentModalMeta = {
  type: ComponentType.MODAL;
  modal?: ModalBuilder;
  // Whether to remove the callback as soon as it was called once (Might be useful if its directly bound to a command)
  removeAfterSubmit?: boolean;
  callback: (content: {
    modalComponent: ModalComponent;
    interaction: ModalSubmitInteraction;
  }) => Promise<void>;
} & TComponentMetaBase;
