import { TNode } from '@dyn/types/dtif';
import clsx from 'clsx';
import React from 'react';
import { JSONTree } from 'react-json-tree';
import { ClipboardButton } from '../../components/native';

// Themes
import '../../styles/code/prism.css';
import threezerotwofourTheme from '../../styles/json-tree/threezerotwofour.theme';

enum EPreviewTabs {
  DTIF = 'dtif',
  JSX = 'jsx',
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
  const [nodeAsJSXString, setNodeAsJSXString] = React.useState('not-set');
  const [isLoadingHighlight, setIsLoadingHighlight] = React.useState(false);

  // ============================================================================
  // Lifecycle
  // ============================================================================

  // Render node as JSXs
  // React.useEffect(() => {
  //   const renderNodeAsJSX = async () => {
  //     if (node != null && activeTab === EPreviewTabs.PREVIEW) {
  //       setTimeout(async () => {
  //         const jsxNode = await (isFrameNode(node)
  //           ? renderRelativeParent(node, 0.2)
  //           : renderNode(node, { isLocked: false, isVisible: true }));
  //         setNodeAsJSX(jsxNode);
  //         setNodeAsJSXString(toJSXString(jsxNode as React.ReactElement));
  //       });
  //     }
  //   };
  //   renderNodeAsJSX();
  // }, [node, activeTab === EPreviewTabs.PREVIEW]);

  // Find an highlight all code snippets in the page
  // React.useEffect(() => {
  //   // setIsLoadingHighlight(true); // Directly set in callback to avoid waiting for next render cycle
  //   // Wrapped in timeout to avoid UI lag and instead highlight after switch
  //   if (activeTab === EPreviewTabs.JSX) {
  //     setTimeout(() => {
  //       Prism.highlightAll();
  //       setIsLoadingHighlight(false);
  //     });
  //   }
  // }, [nodeAsJSXString, activeTab === EPreviewTabs.JSX]);

  // ============================================================================
  // Render
  // ============================================================================

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
          onClick={() => {
            setIsLoadingHighlight(true);
            setActiveTab(EPreviewTabs.JSX);
          }}
          className={clsx('tab-lifted tab', {
            'tab-active [--tab-bg:hsl(var(--n))] [--tab-color:hsl(var(--nc))] [--tab-border-color:hsl(var(--n))]':
              activeTab === EPreviewTabs.JSX,
            '[--tab-border-color:transparent]': activeTab !== EPreviewTabs.JSX,
          })}
        >
          React (JSX)
        </button>
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
        <div className="rounded-box flex min-h-[4rem] w-full overflow-x-hidden border border-base-300 bg-[hsl(var(--n))]">
          <div className="relative w-full overflow-x-auto p-4">
            <ClipboardButton
              text={JSON.stringify(node)}
              className="absolute right-0 top-0 z-50 m-2"
            />
            <JSONTree data={node} theme={threezerotwofourTheme} />
          </div>
        </div>
      )}

      {/* Show JSX */}
      {activeTab === EPreviewTabs.JSX && (
        <div className="rounded-box flex min-h-[4rem] w-full overflow-x-hidden border border-base-300 bg-[hsl(var(--n))]">
          <div className="relative w-full overflow-x-auto p-0">
            <ClipboardButton
              text={nodeAsJSXString}
              className="absolute right-0 top-0 z-50 m-2"
            />
            {nodeAsJSX != null ? (
              <pre style={{ opacity: isLoadingHighlight ? 0 : 1 }}>
                {isLoadingHighlight && (
                  <span className="loading loading-spinner text-primary-content" />
                )}
                <code className="language-javascript">{nodeAsJSXString}</code>
              </pre>
            ) : (
              <span className="loading loading-spinner text-primary-content" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportPreview;

type TProps = {
  node: TNode;
};
