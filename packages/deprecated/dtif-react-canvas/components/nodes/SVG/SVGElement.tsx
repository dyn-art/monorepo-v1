import { TSVGElement } from '@pda/types/dtif';
import React from 'react';
import { toCamelCase } from '../../../utils';

const SVGElement: React.FC<TProps> = (props) => {
  const { element } = props;
  const attributes = React.useMemo(
    () =>
      Object.keys(element.attributes).reduce((result, current) => {
        result[current] = toCamelCase(element.attributes[current]);
        return result;
      }, []),
    [element.attributes]
  );
  const ElementType = element.type;

  return React.createElement(
    ElementType,
    attributes,
    element.children.length > 0
      ? element.children.map((child, index) => (
          <SVGElement key={index} element={child} />
        ))
      : null
  );
};

export default SVGElement;

type TProps = {
  element: TSVGElement;
};
