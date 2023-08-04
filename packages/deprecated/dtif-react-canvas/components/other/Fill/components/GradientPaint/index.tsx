import { TGradientPaint, TNode } from '@pda/types/dtif';
import React from 'react';
import { LinearGradientPaint, RadialGradientPaint } from './components';

const GradientPaint: React.FC<TProps> = (props) => {
  const { paint, node, index } = props;

  // Handle exported gradient paint
  if (paint.isExported) {
    return null;
  }

  // Handle inline gradient paint
  switch (paint.type) {
    case 'GRADIENT_LINEAR':
      return <LinearGradientPaint paint={paint} node={node} index={index} />;
    case 'GRADIENT_RADIAL':
      return <RadialGradientPaint paint={paint} node={node} index={index} />;
    default:
      return null;
  }
};

export default GradientPaint;

type TProps = {
  node: TNode;
  index: number;
  paint: TGradientPaint;
};
