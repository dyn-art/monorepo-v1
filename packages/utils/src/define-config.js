"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineConfig = void 0;
/**
 * Merges the default values object ('source') into the configuration object ('target') with a flat merge strategy.
 *
 * @public
 * @param target - The configuration object to merge the default values into.
 * @param source - The default values object to be merged into the configuration object.
 * @param overwriteUndefinedProperties - Flag to overwrite 'undefined' properties in the target with default values from the source.
 */
function defineConfig(target, source, overwriteUndefinedProperties = true) {
    // Shallow copy target
    const output = Object.assign({}, target);
    for (const key in source) {
        const sourceValue = source[key];
        const targetValue = target[key];
        if (!Object.prototype.hasOwnProperty.call(target, key) ||
            (overwriteUndefinedProperties && targetValue === undefined)) {
            output[key] = sourceValue;
        }
    }
    return output;
}
exports.defineConfig = defineConfig;
