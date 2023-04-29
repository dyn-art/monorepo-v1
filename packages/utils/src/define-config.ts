/**
 * Merges the default values object ('source') into the configuration object ('target') with a flat merge strategy.
 *
 * @public
 * @param target - The configuration object to merge the default values into.
 * @param source - The default values object to be merged into the configuration object.
 * @param overwriteUndefinedProperties - Flag to overwrite 'undefined' properties in the target with default values from the source.
 */
export function defineConfig<
  TTarget extends Record<string, unknown>,
  TSource extends Required<OptionalAttributes<TTarget>>
>(
  target: TTarget,
  source: TSource,
  overwriteUndefinedProperties = true
): Required<TTarget> {
  // Shallow copy target
  const output = Object.assign({}, target) as Record<string, unknown>;

  for (const key in source) {
    const sourceValue = source[key as keyof TSource];
    const targetValue = target[key as keyof TTarget];
    if (
      !Object.prototype.hasOwnProperty.call(target, key) ||
      (overwriteUndefinedProperties && targetValue === undefined)
    ) {
      output[key] = sourceValue;
    }
  }

  return output as Required<TTarget>;
}

export type OptionalAttributes<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]: T[K];
};
