import { getIdentifier, transformToCSS } from '@/components/canvas/utils';
import { TRectangleNode } from '@pda/types/dtif';
import React from 'react';
import { Fill } from '../other';

const Rectangle: React.FC<TProps> = (props) => {
  const { node, index = 0 } = props;
  const fillClipPathId = React.useMemo(
    () =>
      getIdentifier({
        id: node.id,
        index,
        type: 'rectangle',
        category: 'fill-clip',
        isDefinition: true,
      }),
    [node.id]
  );

  return (
    <g
      id={getIdentifier({
        id: node.id,
        index,
        type: 'rectangle',
      })}
      style={{
        display: node.isVisible ? 'block' : 'none',
        borderRadius: `${node.topLeftRadius}px ${node.topRightRadius}px ${node.bottomRightRadius}px ${node.bottomLeftRadius}px`,
        opacity: node.opacity,
        pointerEvents: node.isLocked ? 'none' : 'auto',
        ...transformToCSS(node.relativeTransform),
      }}
    >
      <defs>
        <clipPath id={fillClipPathId}>
          {/* https://medium.com/@dennismphil/one-side-rounded-rectangle-using-svg-fb31cf318d90 */}
          <path
            d={`
            M ${node.topLeftRadius},0
            h ${node.width - node.topRightRadius - node.topLeftRadius}
            q ${node.topRightRadius},0 ${node.topRightRadius},${
              node.topRightRadius
            }
            v ${node.height - node.topRightRadius - node.bottomRightRadius}
            q 0,${node.bottomRightRadius} -${node.bottomRightRadius},${
              node.bottomRightRadius
            }
            h -${node.width - node.bottomRightRadius - node.bottomLeftRadius}
            q -${node.bottomLeftRadius},0 -${node.bottomLeftRadius},-${
              node.bottomLeftRadius
            }
            v -${node.height - node.bottomLeftRadius - node.topLeftRadius}
            q 0,-${node.topLeftRadius} ${node.topLeftRadius},-${
              node.topLeftRadius
            }
            Z
            `}
          ></path>
        </clipPath>
      </defs>
      <Fill node={node} clipPathId={fillClipPathId} />
    </g>
  );
};

export default Rectangle;

type TProps = {
  node: TRectangleNode;
  index?: number;
};
