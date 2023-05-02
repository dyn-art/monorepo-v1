import { TComponentButtonMeta } from './ButtonComponent';
import { TComponentModalMeta } from './ModalComponent';

export type TComponentMeta = TComponentModalMeta | TComponentButtonMeta;

export type TComponentMetaBase = {
  key?: string;
};
