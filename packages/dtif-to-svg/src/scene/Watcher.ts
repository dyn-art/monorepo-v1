import { shortId } from '@pda/utils';

export class Watcher<GWatchedObj> {
  private readonly callbacks: {
    [K in keyof GWatchedObj]?: {
      [key: string]: (value: GWatchedObj[K]) => void;
    };
  } = {};

  constructor() {
    // do nothing
  }

  public watch<K extends keyof GWatchedObj>(
    property: K,
    callback: (value: GWatchedObj[K]) => void,
    options: { key?: string } = {}
  ): string {
    const { key = shortId() } = options;
    if (
      typeof this.callbacks[property] !== 'object' ||
      this.callbacks[property] == null
    ) {
      this.callbacks[property] = {};
    }
    (this.callbacks[property] as object)[key] = callback;
    return key;
  }

  public unwatch<K extends keyof GWatchedObj>(property: K, key: string) {
    if (
      property in this.callbacks &&
      key in (this.callbacks[property] as object)
    ) {
      delete (this.callbacks[property] as object)[key];
    }
  }

  public notify<K extends keyof GWatchedObj>(
    property: K,
    value: GWatchedObj[K]
  ) {
    if (
      typeof this.callbacks[property] === 'object' &&
      this.callbacks[property] != null
    ) {
      Object.values(this.callbacks[property] as object).forEach((callback) =>
        callback(value)
      );
    }
  }
}

// TODO: doesn't work when combined with recursively as too complex for Typescript
// thus I had to define a watcher() method in each class separately
type NonFunctionKeyNames<T> = Exclude<
  {
    [key in keyof T]: T[key] extends Function ? never : key;
  }[keyof T],
  undefined
>;
export type RemoveFunctions<T> = Pick<T, NonFunctionKeyNames<T>>;
