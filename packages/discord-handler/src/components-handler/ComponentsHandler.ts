import { uuidv4 } from '@pda/utils';
import DcClientHandler from '../DcClientHandler';
import { logger } from '../logger';
import {
  BaseComponent,
  ModalComponent,
  TModalComponentMeta,
} from './component-types';

export default class ComponentsHandler {
  private readonly _instance: DcClientHandler;

  private _modals: Map<string, ModalComponent> = new Map();

  constructor(instance: DcClientHandler) {
    this._instance = instance;
  }

  public get modals(): ReadonlyMap<string, ModalComponent> {
    return this._modals;
  }

  public get components(): ReadonlyArray<BaseComponent> {
    return [...this._modals.values()];
  }

  public addModal(meta: TModalComponentMeta) {
    // Set up unique key/name
    let key = meta.modal.data.custom_id;
    if (key == null) {
      key = uuidv4();
      meta.modal.setCustomId(key);
    }
    if (this._modals.has(key)) {
      const previousKey = key;
      key = `${key}_${uuidv4()}`;
      meta.modal.setCustomId(key);
      logger.warn(
        `The Modal Component name '${previousKey}' has already been used! The Modal Component has been renamed to '${key}'.`
      );
    }

    // Initialize and add Modal Component
    this._modals.set(key, new ModalComponent(this._instance, key, meta));
  }
}
