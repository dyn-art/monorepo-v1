import { TScene } from '@pda/types/dtif';
import { Scene } from './Scene';
import { RemoveFunctions, Watcher } from './Watcher';
import { Frame, SceneNode } from './nodes';

export class InteractiveScene extends Scene {
  private _raycastNodeIds: string[];
  private _selectedNodeId: string | null;

  private readonly _clickedElements: Set<string>;
  protected readonly _watcher: Watcher<TWatchedInteractiveScene>;

  constructor(scene: TScene) {
    super(scene);
    this._raycastNodeIds = [];
    this._selectedNodeId = null;
    this._clickedElements = new Set();
  }

  public async init() {
    await super.init();

    // Add event listener
    for (const id of Object.keys(this._nodes)) {
      const node = this._nodes[id];

      // Register onClick event listener
      // to determine selected nodes
      if (node instanceof SceneNode) {
        node.onClickRoot((event) => {
          this._clickedElements.add(id);

          // If this is the first element that was clicked (i.e. the most deeply nested element),
          // set a property on the event to indicate this
          if (!event.alreadyProcessed) {
            event.alreadyProcessed = true;

            // Then use a setTimeout to process the clicked elements
            // after all the event listeners have fired
            setTimeout(() => {
              this.processClickedElements(Array.from(this._clickedElements));
              this._clickedElements.clear();
            }, 0);
          }
        });
      }
    }

    return this;
  }

  // ============================================================================
  // Getter & Setter
  // ============================================================================

  public watcher() {
    return this._watcher;
  }

  public get selectedNode() {
    return this.getNode(this._selectedNodeId);
  }

  // ============================================================================
  // Helper
  // ============================================================================

  private processClickedElements(nodeIds: string[]): void {
    this._raycastNodeIds = [...nodeIds];
    let selectedNodeId: string | null = this._selectedNodeId;
    const prevSelectedNodeId: string | null = selectedNodeId;

    // If a node is already selected and there are nodes in the raycast array,
    // including the selected node id,
    // attempt to select the next node deeper in the hierarchy
    if (
      selectedNodeId != null &&
      this._raycastNodeIds.length > 0 &&
      this._raycastNodeIds.includes(selectedNodeId)
    ) {
      let nextSelectedNodeId = this.selectNextNode(selectedNodeId);

      // If no valid deeper node is found in the hierarchy,
      // maintain the currently selected node as the selected node
      if (nextSelectedNodeId == null) {
        nextSelectedNodeId = selectedNodeId;
      }

      selectedNodeId = nextSelectedNodeId;
    }

    // If no node is currently selected or the selected node is not in the raycast array
    //  and there are nodes in the raycast array,
    // attempt to select the top-level node
    else if (this._raycastNodeIds.length > 0) {
      selectedNodeId = this.selectTopLevelNode();

      // If the top-level node was not suitable for selection (e.g., if it's a Frame)
      // and there's more than one node in the raycast list,
      // attempt to select the next node deeper in the hierarchy
      if (selectedNodeId == null && this._raycastNodeIds.length > 1) {
        selectedNodeId = this.selectNextNode(
          this._raycastNodeIds[this._raycastNodeIds.length - 1]
        );
      }

      // If we still haven't selected a node (because it's either unsuitable or non-existent),
      // select the top-level node regardless of its suitability
      else if (selectedNodeId == null) {
        selectedNodeId = this._raycastNodeIds[this._raycastNodeIds.length - 1];
      }
    }

    // If the raycast array is empty, unselect the currently selected node
    else {
      selectedNodeId = null;
    }

    this._selectedNodeId = selectedNodeId;
    if (prevSelectedNodeId !== selectedNodeId) {
      this._watcher.notify('selectedNode', this.selectedNode);
    }
  }

  private selectTopLevelNode(): string | null {
    if (this._raycastNodeIds.length === 0) {
      return null;
    }

    // Find potential next to select node
    const nextSelectedNodeId =
      this._raycastNodeIds[this._raycastNodeIds.length - 1];
    const nextSelectedNode = this.getNode(nextSelectedNodeId);

    // If the top-level node is not a frame and does exist, select it
    if (!(nextSelectedNode instanceof Frame) && nextSelectedNode != null) {
      return nextSelectedNodeId;
    }

    return null;
  }

  private selectNextNode(startNodeId: string): string | null {
    // Temporary variable to keep track of the current node
    let currentNodeId = startNodeId;

    // Check whether starting node is actually in the current raycast
    if (!this._raycastNodeIds.includes(currentNodeId)) {
      return null;
    }

    // Find the next valid node
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const index = this._raycastNodeIds.indexOf(currentNodeId);

      // If a next deeper node exists, check if it's valid
      if (index !== 0) {
        const nextNodeId = this._raycastNodeIds[index - 1];
        const nextNode = this.getNode(nextNodeId);

        // If the node is valid, return it
        if (nextNode != null) {
          return nextNodeId;
        }
        // Else, keep going deeper
        else {
          currentNodeId = nextNodeId;
        }
      }

      // We've reached the deepest node, and it's invalid
      else {
        return null;
      }
    }
  }
}

type TWatchedInteractiveScene = RemoveFunctions<InteractiveScene>;
