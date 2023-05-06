/**
 * Merges the default values object ('source') into the configuration object ('target') using a flat merge strategy.
 *
 * @param target - The target configuration object to merge the default values into.
 * @param source - The source default values object to be merged into the target configuration object.
 * @param overwriteUndefinedProperties - Flag to overwrite 'undefined' properties in the target with default values from the source.
 * @returns A new object with the merged properties of the target and source, with undefined properties in the target being overwritten by the source if the flag is set to true.
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
