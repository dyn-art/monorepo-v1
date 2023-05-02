import { uuidv4 } from '@pda/utils';
import DcClientHandler from '../DcClientHandler';
import { logger } from '../logger';
import {
  BaseComponent,
  ButtonComponent,
  ModalComponent,
  TComponentButtonMeta,
  TComponentModalMeta,
} from './component-types';

export default class ComponentsHandler {
  private readonly _instance: DcClientHandler;

  private _modals: Map<string, ModalComponent> = new Map();
  private _buttons: Map<string, ButtonComponent> = new Map();

  constructor(instance: DcClientHandler) {
    this._instance = instance;
  }

  public get modals(): ReadonlyMap<string, ModalComponent> {
    return this._modals;
  }

  public get buttons(): ReadonlyMap<string, ButtonComponent> {
    return this._buttons;
  }

  public get components(): ReadonlyArray<BaseComponent> {
    // @ts-ignore
    return [...this._modals.values(), ...this._buttons.values()];
  }

  public addModal(meta: TComponentModalMeta) {
    const { removeAfterSubmit = false, modal } = meta;
    const customId = modal?.data.custom_id;
    let key = meta.key ?? customId ?? uuidv4();

    // Handle existing Modal Component
    if (!removeAfterSubmit && this._modals.has(key)) {
      return;
    } else if (this._modals.has(key)) {
      const previousKey = key;
      key = `${key}_${uuidv4()}`;
      modal?.setCustomId(key);
      logger.warn(
        `The Modal Component name '${previousKey}' has already been used! The Modal Component has been renamed to '${key}'.`
      );
    }
    if (customId !== key) {
      modal?.setCustomId(key);
    }

    logger.info(`Registered new Modal callback with the key '${key}'.`);

    // Initialize and add Modal Component
    this._modals.set(key, new ModalComponent(this._instance, key, meta));
  }

  public removeModal(key: string) {
    return this._modals.delete(key);
  }

  public addButton(meta: TComponentButtonMeta) {
    const { removeAfterSubmit = false, button } = meta;
    const customId = button?.data['custom_id'];
    let key = meta.key ?? customId ?? uuidv4();

    // Handle existing Button Component
    if (!removeAfterSubmit && this._buttons.has(key)) {
      return;
    } else if (this._buttons.has(key)) {
      const previousKey = key;
      key = `${key}_${uuidv4()}`;
      logger.warn(
        `The Button Component name '${previousKey}' has already been used! The Button Component has been renamed to '${key}'.`
      );
    }
    if (customId !== key) {
      button?.setCustomId(key);
    }

    logger.info(`Registered new Button callback with the key '${key}'.`);

    // Initialize and add Button Component
    this._buttons.set(key, new ButtonComponent(this._instance, key, meta));
  }

  public removeButton(key: string) {
    return this._buttons.delete(key);
  }
}
