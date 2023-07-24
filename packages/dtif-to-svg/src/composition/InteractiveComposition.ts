import { TComposition } from '@pda/types/dtif';
import { notEmpty } from '@pda/utils';
import { Composition } from './Composition';
import { RemoveFunctions, Watcher } from './Watcher';
import { CompositionNode, Frame } from './nodes';

export class InteractiveComposition extends Composition {
  private _raycastNodeIds: string[];
  private _lastSelectedNodeId: string | null;
  private _selectedNodeIds: string[];
  private _multiselect: boolean;

  private readonly _clickedElements: Set<string>;
  protected readonly _watcher: Watcher<TWatchedInteractiveScene>;

  private onUpdateSelectedNodesCallback: TOnUpdateSelectedNodesCallback | null;

  constructor(composition: TComposition) {
    super(composition);
    this._raycastNodeIds = [];
    this._lastSelectedNodeId = null;
    this._selectedNodeIds = [];
    this._multiselect = false;
    this._clickedElements = new Set();
  }

  public async init() {
    await super.init();

    // Add node event listener
    for (const id of Object.keys(this._nodes)) {
      const node = this._nodes[id];

      // Register onClick event listener
      // to determine selected nodes
      node.onPointerDown((event) => {
        this._clickedElements.add(id);

        // If this is the first element that was clicked (i.e. the most deeply nested element),
        // set a property on the event to indicate this
        if (!('alreadyProcessed' in event) || !event.alreadyProcessed) {
          event['alreadyProcessed'] = true;

          // Then use a setTimeout to process the clicked elements
          // after all the event listeners have fired
          setTimeout(() => {
            this.processClickedElements(
              Array.from(this._clickedElements),
              event
            );
            this._clickedElements.clear();
          }, 0);
        }
      });
    }

    return this;
  }

  // ============================================================================
  // Getter & Setter
  // ============================================================================

  public getWatcher() {
    return this._watcher;
  }

  public get multiselect() {
    return this._multiselect;
  }

  public set multiselect(value: boolean) {
    this._multiselect = value;
    this._watcher.notify('multiselect', value);
  }

  public get selectedNodes() {
    return this._selectedNodeIds.map((id) => this.getNode(id)).filter(notEmpty);
  }

  // ============================================================================
  // Other
  // ============================================================================

  public onSelectNode(callback: TOnUpdateSelectedNodesCallback) {
    this.onUpdateSelectedNodesCallback = callback;
  }

  // ============================================================================
  // Helper
  // ============================================================================

  private processClickedElements(
    nodeIds: string[],
    event: React.PointerEvent<SVGElement>
  ): void {
    this._raycastNodeIds = [...nodeIds];
    let selectedNodeId: string | null = this._lastSelectedNodeId;
    const prevSelectedNodeIdsIdentifier: string =
      this._selectedNodeIds.join('-');

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
    // and there are nodes in the raycast array,
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
        // selectedNodeId = this._raycastNodeIds[this._raycastNodeIds.length - 1];
        selectedNodeId = null;
      }
    }

    // If the raycast array is empty, unselect the currently selected node
    else {
      selectedNodeId = null;
    }

    // Update last selected node id
    this._lastSelectedNodeId = selectedNodeId;

    // Update selected node ids
    if (this._multiselect) {
      if (selectedNodeId != null) {
        const index = this._selectedNodeIds.indexOf(selectedNodeId);
        if (index !== -1) {
          this._selectedNodeIds.splice(index, 1);
        } else {
          this._selectedNodeIds.push(selectedNodeId);
        }
      } else {
        // do nothing
      }
    } else {
      this._selectedNodeIds = selectedNodeId != null ? [selectedNodeId] : [];
    }

    // Notify subscribers
    if (prevSelectedNodeIdsIdentifier !== this._selectedNodeIds.join('-')) {
      this._watcher.notify('selectedNodes', this.selectedNodes);
      if (this.onUpdateSelectedNodesCallback != null) {
        this.onUpdateSelectedNodesCallback(this.selectedNodes, event);
      }
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
    if (
      !(nextSelectedNode instanceof Frame) &&
      nextSelectedNode != null &&
      !nextSelectedNode.isLocked
    ) {
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
        if (
          nextNode != null &&
          !nextNode.isLocked &&
          !(nextNode instanceof Frame)
        ) {
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

  // ============================================================================
  // Events
  // ============================================================================

  public onWheel(
    callback: (
      event: React.WheelEvent<SVGElement>,
      composition: InteractiveComposition
    ) => void
  ) {
    this._d3Node?.element.on('wheel', (e) => {
      callback(e, this);
    });
  }

  public onPointerDown(
    callback: (
      event: React.PointerEvent<SVGElement>,
      composition: InteractiveComposition
    ) => void
  ) {
    this._d3Node?.element.on('pointerdown', (e) => {
      callback(e, this);
    });
  }

  public onPointerMove(
    callback: (
      event: React.PointerEvent<SVGElement>,
      composition: InteractiveComposition
    ) => void
  ) {
    this._d3Node?.element.on('pointermove', (e) => {
      callback(e, this);
    });
  }

  public onPointerLeave(
    callback: (
      event: React.PointerEvent<SVGElement>,
      composition: InteractiveComposition
    ) => void
  ) {
    this._d3Node?.element.on('pointerleave', (e) => {
      callback(e, this);
    });
  }

  public onPointerUp(
    callback: (
      event: React.PointerEvent<SVGElement>,
      composition: InteractiveComposition
    ) => void
  ) {
    this._d3Node?.element.on('pointerup', (e) => {
      callback(e, this);
    });
  }
}

type TWatchedInteractiveScene = RemoveFunctions<InteractiveComposition>;

type TOnUpdateSelectedNodesCallback = (
  node: CompositionNode[],
  event: React.PointerEvent<SVGElement>
) => void;
