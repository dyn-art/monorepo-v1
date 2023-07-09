import { TNode } from '@pda/types/dtif';
import React from 'react';
import Ellipse from './Ellipse';
import Frame from './Frame';
import Group from './Group';
import Rectangle from './Rectangle';
import Text from './Text';

const Node: React.FC<TProps> = (props) => {
  const { node, index = 0 } = props;

  switch (node.type) {
    case 'FRAME':
      return <Frame node={node} index={index} />;
    case 'GROUP':
      return <Group node={node} index={index} />;
    case 'RECTANGLE':
      return <Rectangle node={node} index={index} />;
    case 'ELLIPSE':
      return <Ellipse node={node} index={index} />;
    case 'TEXT':
      return <Text node={node} index={index} />;
    case 'SVG':
    // TODO:
    default:
      return null;
  }
};

export default Node;

type TProps = {
  node: TNode;
  index?: number;
};
