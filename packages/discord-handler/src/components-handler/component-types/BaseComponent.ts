import DcClientHandler from '../../DcClientHandler';
import { TComponentMeta } from './types';

export default class BaseComponent<
  TMeta extends TComponentMeta = TComponentMeta
> {
  public readonly instance: DcClientHandler;
  public readonly key: string;
  public readonly meta: TBaseComponentMeta<TMeta>;

  constructor(
    instance: DcClientHandler,
    key: string,
    meta: TBaseComponentMeta<TMeta>
  ) {
    this.instance = instance;
    this.key = key;
    this.meta = meta;
  }
}

type TBaseComponentMeta<TCommandMeta> = Omit<Omit<TCommandMeta, 'key'>, 'type'>;
