import { TSVGNodeInline } from '@pda/types/dtif';
import React from 'react';
import SVGElement from './SVGElement';

const SVGInline: React.FC<TProps> = (props) => {
  const { node } = props;

  return (
    <>
      {node.children.map((child) => (
        <SVGElement element={child} />
      ))}
    </>
  );
};

export default SVGInline;

type TProps = {
  node: TSVGNodeInline;
};
