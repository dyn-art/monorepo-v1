import { applyScale, renderNode } from '@pda/dtif-to-react';
import { TFrameNode } from '@pda/dtif-types';
import React from 'react';
import { continueRender, delayRender } from 'remotion';
import './style.css';

const FigmaNodeTreeV1: React.FC<TProps> = (props) => {
  const { nodeTree } = props;
  const [renderedNode, setRenderedNode] = React.useState<JSX.Element | null>(
    null
  );
  const [handle] = React.useState(() => delayRender());

  React.useEffect(() => {
    const renderNodeAsJSX = async () => {
      const nodeTreeWithScale = {
        ...nodeTree,
        transform: applyScale(nodeTree.transform, 1.5),
      };
      const renderedNode = await renderNode(nodeTreeWithScale as any);
      setRenderedNode(renderedNode);

      // TODO: figure out a more dynamic way to wait until image has loaded
      await new Promise((resolve) => setTimeout(resolve, 15000));
      continueRender(handle);
    };
    renderNodeAsJSX();
  }, [nodeTree]);

  return renderedNode ?? <div>Loading..</div>;
};

export default FigmaNodeTreeV1;

type TProps = {
  nodeTree: TFrameNode;
};
