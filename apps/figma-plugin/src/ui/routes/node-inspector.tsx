import React from 'react';
import { JSONTree } from 'react-json-tree';
import { Link } from 'react-router-dom';
import { EUIPageRoute } from '../../shared';
import { ClipboardButton } from '../components/native';
import threezerotwofourTheme from '../styles/json-tree/threezerotwofour.theme';
import { TUIHandler, uiHandler } from '../ui-handler';

const NodeInspector: React.FC = () => {
  const [selectedNodes, setSelectedNodes] = React.useState<SceneNode[]>([]);

  // ============================================================================
  // Lifecycle
  // ============================================================================

  // Register events
  React.useEffect(() => {
    // On select node properties event
    uiHandler.registerEvent({
      type: 'figma.message',
      key: 'on-select-node-properties',
      callback: async (instance: TUIHandler, args) => {
        if (args.selected != null && args.selected.length > 0) {
          setSelectedNodes(args.selected);
        } else {
          setSelectedNodes([]);
        }
      },
    });

    // On change selected node properties
    uiHandler.registerEvent({
      type: 'figma.message',
      key: 'on-change-selected-node-properties',
      callback: async (instance: TUIHandler, args) => {
        const { changed } = args;
        if (selectedNodes != null) {
          const updatedNodeIndex = selectedNodes.findIndex(
            (node) => node.id === changed.id
          );
          if (updatedNodeIndex != -1) {
            const newSelectedNodes = [...selectedNodes];
            newSelectedNodes[updatedNodeIndex] = changed;
            setSelectedNodes(newSelectedNodes);
          }
        }
      },
    });

    // TODO: check whether events are unregistered when re registered
  }, [selectedNodes]);

  return (
    <div className="mx-4 mb-4">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link to={EUIPageRoute.HOME}>Home</Link>
          </li>
          <li>Node Inspector</li>
        </ul>
      </div>
      <div className="space-y-4">
        <div className="rounded-box flex w-full overflow-x-hidden border border-base-300 bg-[hsl(var(--n))]">
          <div className="relative w-full overflow-x-auto p-4">
            <ClipboardButton
              text={JSON.stringify(selectedNodes)}
              className="absolute right-0 top-0 z-50 m-2"
            />
            <JSONTree data={selectedNodes} theme={threezerotwofourTheme} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeInspector;
