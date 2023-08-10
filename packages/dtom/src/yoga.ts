import initYoga, { Yoga as WasmYoga } from 'yoga-wasm-web/asm';

const yoga = initYoga();

export type Yoga = WasmYoga;

export { yoga };
