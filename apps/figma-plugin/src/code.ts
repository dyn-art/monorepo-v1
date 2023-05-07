figma.showUI(__html__);

figma.ui.onmessage = (msg) => {
  // do nothing
};

console.log('Init Figma', { __html__, figma });

export {};
