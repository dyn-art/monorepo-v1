// export function defineConfig<
//   TConfig extends Record<string, unknown> = Record<string, unknown>
// >(
//   config: TConfig,
//   defaults: Required<OptionalAttributes<TConfig>>,
//   overwriteUndefinedProperties = true
// ): Required<TConfig> {
//   const shallowCopiedConfig = { ...config } as Required<TConfig>;
//
//   for (const defaultKey in defaults) {
//     if (
//       !Object.prototype.hasOwnProperty.call(shallowCopiedConfig, defaultKey) ||
//       (overwriteUndefinedProperties &&
//         shallowCopiedConfig[defaultKey] === undefined)
//     )
//       shallowCopiedConfig[defaultKey] = defaults[defaultKey] as any;
//   }
//
//   return shallowCopiedConfig;
// }
//
// type OptionalAttributes<T> = {
//   [K in keyof T as undefined extends T[K] ? K : never]: T[K];
// };

function mergeDeep<
  TTarget extends Record<string, unknown>,
  TSource extends Record<string, unknown>
>(
  target: TTarget,
  source: TSource,
  overwriteUndefinedProperties: boolean
): TTarget & TSource {
  // Shallow copy target
  const output = Object.assign({}, target) as Record<string, unknown>;

  for (const key in source) {
    // Go deep
    if (source[key] instanceof Object) {
      output[key] = mergeDeep(
        target[key] || {},
        source[key] as Record<string, unknown>,
        overwriteUndefinedProperties
      );
    }
    // Apply source property if no target property found
    else if (
      !Object.prototype.hasOwnProperty.call(target, key) ||
      (overwriteUndefinedProperties && target[key] === undefined)
    ) {
      output[key] = source[key];
    }
  }

  return output as TTarget & TSource;
}

export function defineConfig<
  TConfig extends Record<string, unknown> = Record<string, unknown>
>(
  config: TConfig,
  defaults: RequiredDeepOptionalAttributes<TConfig>,
  overwriteUndefinedProperties = true
): DeepRequired<TConfig> {
  return mergeDeep(
    config,
    defaults,
    overwriteUndefinedProperties
  ) as DeepRequired<TConfig>;
}

type DeepOptionalAttributes<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]: T[K] extends object
    ? DeepOptionalAttributes<T[K]>
    : Exclude<T[K], undefined>;
};

type RequiredDeepOptionalAttributes<T> = Required<DeepOptionalAttributes<T>>;

type IsClass<T> = T extends new (...args: any[]) => any ? true : false;

type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object
    ? IsClass<T[K]> extends true
      ? T[K]
      : DeepRequired<T[K]>
    : T[K];
};
