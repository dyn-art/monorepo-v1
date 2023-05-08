figma.showUI(__html__);

figma.ui.resize(300, 500);

// TODO: like discord handler
figma.ui.onmessage = (message) => {
  const type = message.type;

  if (type === 'test') {
    const component = figma.root.findOne(
      (node) => node.type === 'FRAME' && node.name === 'Scene #002'
    );
    console.log({ component });
    // TODO
  } else if (type === 'petma') {
    console.log('Petma Message', { message });
    figma.closePlugin();
  }
};

export {};

// Component
// each Component exported to png and uploaded to bucket
// JSON generated
// Compositon is a frame and each frame can have other Compositions (frames) or TImage which is a normal child
