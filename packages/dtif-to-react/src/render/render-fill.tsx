import { TFrameNode, TPaint, TRectangleNode, TTextNode } from '@pda/dtif-types';
import React from 'react';
import { figmaFillToCSS } from '../to-css';

export function renderFill(
  node: TFrameNode | TRectangleNode | TTextNode,
  additionalProperties: React.CSSProperties = {},
  children: React.ReactNode = null
): React.ReactNode {
  return node.fills.map((fill, i) => (
    <FillComponent
      key={i}
      node={node}
      fill={fill}
      additionalProperties={additionalProperties}
    >
      {children}
    </FillComponent>
  ));
}

const FillComponent: React.FC<TFillComponentProps> = (props) => {
  const { node, fill, additionalProperties, children } = props;
  const [fillProperties, setFillProperties] =
    React.useState<React.CSSProperties>({});

  // Load fill styles
  React.useEffect(() => {
    (async () => {
      const properties = await figmaFillToCSS(fill, node);
      setFillProperties(properties);
    })();
  }, [node, fill]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        ...additionalProperties,
        ...fillProperties,
      }}
    >
      {children}
    </div>
  );
};

type TFillComponentProps = {
  node: TFrameNode | TRectangleNode | TTextNode;
  fill: TPaint;
  additionalProperties: React.CSSProperties;
  children: React.ReactNode;
};
