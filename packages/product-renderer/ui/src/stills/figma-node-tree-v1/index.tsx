import { TFrameNode } from '@pda/shared-types';
import React from 'react';
import { renderNode } from './helper/render-node';

const FigmaNodeTreeV1: React.FC<TProps> = (props) => {
  const { nodeTree } = props;
  const [renderedNode, setRenderedNode] = React.useState<JSX.Element | null>(
    null
  );

  React.useEffect(() => {
    const renderNodeAsJSX = async () => {
      setRenderedNode(await renderNode(nodeTree));
    };
    renderNodeAsJSX();
  }, [nodeTree]);

  return renderedNode ?? <div>Loading..</div>;
};

export default FigmaNodeTreeV1;

type TProps = {
  nodeTree: TFrameNode;
};
