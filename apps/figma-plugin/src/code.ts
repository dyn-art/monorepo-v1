figma.showUI(__html__);

figma.ui.resize(300, 500);

// TODO: create some wrapper and register logic near component like int controller.ts
figma.ui.onmessage = (message) => {
  console.log({ message });

  figma.closePlugin();
};

export {};
