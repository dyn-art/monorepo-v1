import { TScene } from '@pda/types/dtif';
import { notEmpty } from '@pda/utils';
import { Scene } from './Scene';
import { SceneNode } from './nodes';

export class InteractiveScene extends Scene {
  private _selectedNodeIds: string[];

  private readonly clickedElements = new Set<string>();

  constructor(scene: TScene) {
    super(scene);
    this._selectedNodeIds = [];
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
          this.clickedElements.add(id);

          // If this is the first element that was clicked (i.e. the most deeply nested element),
          // set a property on the event to indicate this
          if (!event.alreadyProcessed) {
            event.alreadyProcessed = true;

            // Then use a setTimeout to process the clicked elements
            // after all the event listeners have fired
            setTimeout(() => {
              this.processClickedElements(Array.from(this.clickedElements));
              this.clickedElements.clear();
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

  public get selectedNodeIds() {
    return this._selectedNodeIds;
  }

  public get selectedNodes() {
    return this._selectedNodeIds.map((id) => this._nodes[id]).filter(notEmpty);
  }

  // ============================================================================
  // Helper
  // ============================================================================

  private processClickedElements(nodeIds: string[]) {
    // TODO: handle hierarchy
    this._selectedNodeIds = [...nodeIds];
  }
}
