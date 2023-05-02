import { ButtonBuilder, ButtonInteraction } from 'discord.js';
import ComponentType from '../ComponentType';
import BaseComponent from './BaseComponent';
import { TComponentMetaBase } from './types';

export default class ButtonComponent extends BaseComponent<TComponentButtonMeta> {}

export type TComponentButtonMeta = {
  type: ComponentType.BUTTON;
  button?: ButtonBuilder;
  // Whether to remove the callback as soon as it was called once (Might be useful if its directly bound to a command)
  removeAfterSubmit?: boolean;
  callback: (content: {
    buttonComponent: ButtonComponent;
    interaction: ButtonInteraction;
  }) => Promise<void>;
} & TComponentMetaBase;
