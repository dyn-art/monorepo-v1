import { TNode } from '@dyn/types/dtif';
import React from 'react';
import Ellipse from './Ellipse';
import Frame from './Frame';
import Group from './Group';
import Polygon from './Polygon';
import Rectangle from './Rectangle';
import SVG from './SVG';
import Star from './Star';
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
    case 'POLYGON':
      return <Polygon node={node} index={index} />;
    case 'STAR':
      return <Star node={node} index={index} />;
    case 'TEXT':
      return <Text node={node} index={index} />;
    case 'SVG':
      return <SVG node={node} index={index} />;
    default:
      return null;
  }
};

export default Node;

type TProps = {
  node: TNode;
  index?: number;
};
