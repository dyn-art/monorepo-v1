import DcClientHandler from '../../DcClientHandler';
import { TCommandMeta } from './types';

export default class BaseCommand<TMeta extends TCommandMeta = TCommandMeta> {
  public readonly instance: DcClientHandler;
  public readonly key: string;
  public readonly meta: TBaseCommandMeta<TMeta>;

  constructor(
    instance: DcClientHandler,
    key: string,
    meta: TBaseCommandMeta<TMeta>
  ) {
    this.instance = instance;
    this.key = key;
    this.meta = meta;
  }
}

type TBaseCommandMeta<TCommandMeta> = Omit<Omit<TCommandMeta, 'name'>, 'type'>;
