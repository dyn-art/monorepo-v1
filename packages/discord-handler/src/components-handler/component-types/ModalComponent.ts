import { CommandInteraction, Message, ModalBuilder } from 'discord.js';
import DcClientHandler from '../../DcClientHandler';
import ComponentType from '../ComponentType';
import BaseComponent from './BaseComponent';

export default class ModalComponent extends BaseComponent<TModalComponentMeta> {
  public readonly type: ComponentType.MODAL_LEGACY | ComponentType.MODAL_SLASH;

  constructor(
    instance: DcClientHandler,
    name: string,
    meta: Omit<TModalComponentMeta, 'name'>
  ) {
    super(instance, name, meta);
    this.type = meta.type;
  }
}

// ============================================================================
// Type Methods
// ============================================================================

export function isComponentLegacyCommandModalMetaType(
  value: any
): value is TComponentLegacyCommandModalMeta {
  return (
    value != null &&
    (value.type === ComponentType.MODAL_LEGACY ||
      (value.model instanceof ModalBuilder &&
        typeof value.callback === 'function'))
  );
}

export function isComponentSlashCommandModalMetaType(
  value: any
): value is TComponentSlashCommandModalMeta {
  return (
    value != null &&
    (value.type === ComponentType.MODAL_SLASH ||
      (value.model instanceof ModalBuilder &&
        typeof value.callback === 'function'))
  );
}

// ============================================================================
// Base Types
// ============================================================================

export type TModalComponentMeta =
  | TComponentSlashCommandModalMeta
  | TComponentLegacyCommandModalMeta;

export type TComponentSlashCommandModalMeta = {
  type: ComponentType.MODAL_SLASH;
  modal: ModalBuilder;
  callback: (content: { interaction: CommandInteraction }) => Promise<void>;
};

export type TComponentLegacyCommandModalMeta = {
  type: ComponentType.MODAL_LEGACY;
  modal: ModalBuilder;
  callback: (content: { message: Message }) => Promise<void>;
};
