import { renderNode, renderRelativeParent } from '@pda/dtif-to-react';
import { TNode } from '@pda/dtif-types';
import { isFrameNode } from '@pda/figma-to-dtif';
import clsx from 'clsx';
import React from 'react';
import { JSONTree } from 'react-json-tree';
import threezerotwofourTheme from '../../styles/json-tree/threezerotwofour.theme';

enum EPreviewTabs {
  DTIF = 'dtif',
  FIGMA = 'figma',
  PREVIEW = 'preview',
}

const ExportPreview: React.FC<TProps> = (props) => {
  const { node } = props;
  const [activeTab, setActiveTab] = React.useState<EPreviewTabs>(
    EPreviewTabs.PREVIEW
  );
  const [nodeAsJSX, setNodeAsJSX] = React.useState<React.ReactNode | null>(
    null
  );

  // Render node as JSXs
  React.useEffect(() => {
    const renderNodeAsJSX = async () => {
      if (node != null) {
        const renderedNode = await (isFrameNode(node)
          ? renderRelativeParent(node, 0.2)
          : renderNode(node));
        setNodeAsJSX(renderedNode);
      }
    };
    renderNodeAsJSX();
  }, [node]);

  return (
    <div className="grid">
      {/* Pagination */}
      <div className="tabs z-10 -mb-px">
        <button
          onClick={() => setActiveTab(EPreviewTabs.PREVIEW)}
          className={clsx('tab-lifted tab', {
            'tab-active [--tab-bg:hsl(var(--b2))]':
              activeTab === EPreviewTabs.PREVIEW,
            '[--tab-border-color:transparent]':
              activeTab !== EPreviewTabs.PREVIEW,
          })}
        >
          Preview
        </button>
        <button
          onClick={() => setActiveTab(EPreviewTabs.DTIF)}
          className={clsx('tab-lifted tab', {
            'tab-active [--tab-bg:hsl(var(--n))] [--tab-color:hsl(var(--nc))] [--tab-border-color:hsl(var(--n))]':
              activeTab === EPreviewTabs.DTIF,
            '[--tab-border-color:transparent]': activeTab !== EPreviewTabs.DTIF,
          })}
        >
          DTIF (JSON)
        </button>
        <button
          onClick={() => setActiveTab(EPreviewTabs.FIGMA)}
          className={clsx('tab-lifted tab', {
            'tab-active [--tab-bg:hsl(var(--n))] [--tab-color:hsl(var(--nc))] [--tab-border-color:hsl(var(--n))]':
              activeTab === EPreviewTabs.FIGMA,
            '[--tab-border-color:transparent]':
              activeTab !== EPreviewTabs.FIGMA,
          })}
        >
          Figma (JSON)
        </button>
        <div className="tab-lifted tab mr-6 flex-1 cursor-default [--tab-border-color:transparent]" />
      </div>

      {/* Show Preview */}
      {activeTab === EPreviewTabs.PREVIEW && (
        <div className="rounded-b-box rounded-tr-box relative overflow-x-auto bg-base-300">
          <div className="preview rounded-b-box rounded-tr-box flex min-h-[8rem] w-full items-center justify-center overflow-x-hidden border border-base-300 p-4">
            {nodeAsJSX}
          </div>
        </div>
      )}

      {/* Show DTIF */}
      {activeTab === EPreviewTabs.DTIF && (
        <div className="rounded-box flex min-h-[8rem] w-full overflow-x-hidden border border-base-300 bg-[hsl(var(--n))] p-4">
          <JSONTree data={node} theme={threezerotwofourTheme} />
        </div>
      )}

      {/* Show Figma */}
      {activeTab === EPreviewTabs.FIGMA && (
        <div className="rounded-box flex min-h-[8rem] w-full overflow-x-hidden border border-base-300 bg-[hsl(var(--n))] p-4">
          <JSONTree data={{ test: 'jeff' }} theme={threezerotwofourTheme} />
        </div>
      )}
    </div>
  );
};

export default ExportPreview;

type TProps = {
  node: TNode;
};
