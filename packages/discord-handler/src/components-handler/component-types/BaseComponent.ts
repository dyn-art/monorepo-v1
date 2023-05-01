import DcClientHandler from '../../DcClientHandler';
import { TComponentMeta } from './types';

export default class BaseComponent<
  TMeta extends TComponentMeta = TComponentMeta
> {
  public readonly instance: DcClientHandler;
  public readonly name: string;
  public readonly meta: TBaseComponentMeta<TMeta>;

  constructor(
    instance: DcClientHandler,
    name: string,
    meta: TBaseComponentMeta<TMeta>
  ) {
    this.instance = instance;
    this.name = name;
    this.meta = meta;
  }
}

type TBaseComponentMeta<TCommandMeta> = Omit<
  Omit<TCommandMeta, 'name'>,
  'type'
>;
