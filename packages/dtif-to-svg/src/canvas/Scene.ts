import { TD3 } from '@/d3';
import { TScene } from '@pda/types/dtif';
import { Node } from './nodes';

export class Scene {
  private readonly _nodes: Record<string, Node>;
  private readonly _selectedNodeIds: string[];
  private readonly _root: Node;

  constructor(scene: TScene, d3: TD3) {
    // TODO:
  }
}
