import { ModalBuilder, ModalSubmitInteraction } from 'discord.js';
import ComponentType from '../ComponentType';
import BaseComponent from './BaseComponent';

export default class ModalComponent extends BaseComponent<TComponentModalMeta> {}

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
  type: ComponentType;
  modal: ModalBuilder;
  callback: (content: {
    modalComponent: ModalComponent;
    interaction: ModalSubmitInteraction;
  }) => Promise<void>;
};
