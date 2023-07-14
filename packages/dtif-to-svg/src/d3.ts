const d3 = (() => {
  let d3: typeof import('d3-selection');

  async function getD3() {
    if (d3 == null) {
      // Check if running in Node.js environment
      if (typeof (globalThis as any).window === 'undefined') {
        const { JSDOM } = await import('jsdom');
        const { window } = new JSDOM();
        (globalThis as any).window = window;
        (globalThis as any).document = window.document;
      }

      // Import required D3 modules
      d3 = (await Promise.all([import('d3-selection')]).then((d3) =>
        Object.assign({}, ...d3)
      )) as any;
    }

    return d3;
  }

  return getD3;
})();

export default d3;

export type TD3 = typeof import('d3-selection');
