## Canvas Rendering Engine with D3.js and React

Our canvas rendering engine leverages the power of D3.js for manipulating documents based on data and the flexibility of React for building user interfaces. This architecture allows us to manage complex visualizations with a rich interaction of DOM elements and maintain high performance with large amounts of data.

### Structure

#### Composition

At the core of our architecture is the `Composition` class. This is the main entry point for all operations involving the visualization. The `Composition` maintains a list of all nodes (or visual elements) within it. This is done through a key-value map where keys are the unique IDs of nodes and values are the instances of corresponding `Node` classes. 

The `InteractiveComposition` also holds the `selectedNodes` property, which is an array containing the IDs of currently selected nodes in the scene. This provides a central source of truth for the state of the scene and allows for efficient updates and lookups.

#### Nodes

The `Node` class represents a single visual element in the scene. Each `Node` class can be a specific type such as `Rectangle`, `Circle`, `Frame`, etc., with their own unique properties like width, height, and position. Each `Node` also holds a reference to a D3 selection that represents its corresponding DOM node.

Node classes have methods to update their properties. These methods not only update the property values but also apply these updates to the corresponding D3 selection, thus reflecting changes in the DOM. 

Some `Node` classes like `Frame` have a `children` property that holds the IDs of its child nodes. This property helps in maintaining the hierarchical structure of nodes within the scene.

### Rendering and Updates

Rendering and updates in our architecture are a mix of D3 and React philosophies. We use D3's data-driven approach to manipulate and update the DOM nodes. This includes operations like setting the position, rotation, and other visual properties of nodes. 

On the other hand, we use React's diffing and re-rendering algorithms for updating the UI components. We leverage React's state management to reflect changes in the side panel that displays the properties of selected nodes. 

### Performance

Our architecture is designed to efficiently handle between 1 and 500 nodes. It avoids unnecessary loops and expensive operations by having a central source of truth in the `Scene` and only updating the nodes when necessary. It also ensures that only the parts of the UI that need to be updated get re-rendered.

## TODO
- [] Outsource Fill into a separate class so that I can add event listener later on.. add _fills array to Basic Shape Node and remove FillsMixin
- [] Make Node more basic and create Basic Shape Node which has fill and can transform because e.g. a Group can't transform but should be of the type Node
- [] Or should group have own transform and width & height and change if children change: https://www.figma.com/plugin-docs/api/GroupNode