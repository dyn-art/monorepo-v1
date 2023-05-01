import {
  TComponentLegacyCommandModalMeta,
  TComponentSlashCommandModalMeta,
} from './ModalComponent';

export type TComponentMeta =
  | TComponentSlashCommandModalMeta
  | TComponentLegacyCommandModalMeta;
