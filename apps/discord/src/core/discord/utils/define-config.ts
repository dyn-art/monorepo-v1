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
  TSource extends RequiredDeepOptionalAttributes<TTarget>
>(
  target: TTarget,
  source: TSource,
  overwriteUndefinedProperties: boolean
): TTarget {
  // Shallow copy target
  const output = Object.assign({}, target) as Record<string, unknown>;

  for (const key in source) {
    const sourceValue = source[key as keyof TSource];
    const targetValue = target[key as keyof TTarget];

    // Go deep
    if (
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      sourceValue !== null
    ) {
      output[key] = mergeDeep(
        targetValue || {},
        sourceValue,
        overwriteUndefinedProperties
      );
    }
    // Apply source property if no target property found
    else if (
      !Object.prototype.hasOwnProperty.call(target, key) ||
      (overwriteUndefinedProperties && target[key] === undefined)
    ) {
      output[key] = sourceValue;
    }
  }

  return output as TTarget;
}

export function defineConfig<
  TConfig extends Record<string, unknown>,
  TDefaults extends RequiredDeepOptionalAttributes<TConfig>
>(
  config: TConfig,
  defaults: TDefaults,
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
    : T[K];
};

type RequiredDeepOptionalAttributes<T> = Required<DeepOptionalAttributes<T>>;

type DeepRequired<T> = T extends any[] // Handle Array
  ? T
  : T extends (...args: any[]) => any // Handle Class & Function
  ? T
  : T extends null // Handle Null
  ? T
  : T extends object // Handle Object
  ? { [K in keyof T]-?: DeepRequired<T[K]> }
  : T;
