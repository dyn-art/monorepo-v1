import { TFrameNode } from '@pda/shared-types';
import React from 'react';

const FigmaNodeTreeV1: React.FC<TProps> = (props) => {
  const { nodeTree } = props;

  return <div>{JSON.stringify(nodeTree)}</div>;
};

export default FigmaNodeTreeV1;

type TProps = {
  nodeTree: TFrameNode;
};
