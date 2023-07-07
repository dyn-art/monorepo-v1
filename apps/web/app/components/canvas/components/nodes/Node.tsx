import { TNode } from '@pda/types/dtif';
import React from 'react';
import Frame from './Frame';
import Group from './Group';
import Rectangle from './Rectangle';
import Text from './Text';

const Node: React.FC<TProps> = (props) => {
  const { node } = props;
  switch (node.type) {
    case 'FRAME':
      return <Frame node={node} />;
    case 'GROUP':
      return <Group node={node} />;
    case 'RECTANGLE':
      return <Rectangle node={node} />;
    case 'TEXT':
      return <Text node={node} />;
    case 'SVG':
    // TODO:
    default:
      return null;
  }
};

export default Node;

type TProps = {
  node: TNode;
};
