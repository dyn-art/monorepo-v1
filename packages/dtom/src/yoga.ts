import type { Yoga as WasmYoga } from 'yoga-wasm-web/asm';

const yoga = (() => {
  let yoga: WasmYoga | null;

  async function getYoga() {
    if (yoga == null) {
      const { default: initYoga } = await import('yoga-wasm-web/asm');
      yoga = initYoga();
    }
    return yoga;
  }
  return getYoga;
})();

export type Yoga = WasmYoga;

export { yoga as yoga };
