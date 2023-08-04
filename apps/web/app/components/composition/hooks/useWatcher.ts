import { RemoveFunctions, Watcher } from '@pda/dtom';
import React from 'react';

export function useWatcher<
  GWatchableObj extends TWatchable,
  GWatchableObjWithoutFunctions extends RemoveFunctions<GWatchableObj>,
  GProperty extends keyof GWatchableObjWithoutFunctions
>(
  obj: GWatchableObj,
  properties: GProperty[]
): Pick<GWatchableObjWithoutFunctions, (typeof properties)[number]> {
  const [, forceRender] = React.useReducer((s) => s + 1, 0);

  React.useLayoutEffect(() => {
    const watcherKeys: string[] = [];
    for (const property of properties) {
      const key = obj.getWatcher().watch(property, () => {
        forceRender();
      });
      watcherKeys.push(key);
    }

    return () => {
      for (const property of properties) {
        for (const key of watcherKeys) {
          obj.getWatcher().unwatch(property, key);
        }
      }
    };
  }, []);

  return properties.reduce<any>((result, property) => {
    result[property] = obj[property as any];
    return result;
  }, {});
}

type TWatchable = {
  getWatcher(): Watcher<any>;
};
