/**
 * Merges the default values object ('source') into the configuration object ('target') with a flat merge strategy.
 *
 * @public
 * @param target - The configuration object to merge the default values into.
 * @param source - The default values object to be merged into the configuration object.
 * @param overwriteUndefinedProperties - Flag to overwrite 'undefined' properties in the target with default values from the source.
 */
export declare function defineConfig<TTarget extends Record<string, unknown>, TSource extends Required<OptionalAttributes<TTarget>>>(target: TTarget, source: TSource, overwriteUndefinedProperties?: boolean): Required<TTarget>;
export type OptionalAttributes<T> = {
    [K in keyof T as undefined extends T[K] ? K : never]: T[K];
};
//# sourceMappingURL=define-config.d.ts.map