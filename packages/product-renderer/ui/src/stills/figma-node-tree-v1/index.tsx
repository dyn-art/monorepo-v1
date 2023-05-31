import { TFrameNode } from '@pda/dtif-types';
import React from 'react';
import { continueRender, delayRender } from 'remotion';
import { renderNode } from './helper/render-node';
import './style.css';

const FigmaNodeTreeV1: React.FC<TProps> = (props) => {
  const { nodeTree } = props;
  const [renderedNode, setRenderedNode] = React.useState<JSX.Element | null>(
    null
  );
  const [handle] = React.useState(() => delayRender());

  React.useEffect(() => {
    const renderNodeAsJSX = async () => {
      const renderedNode = await renderNode(nodeTree);
      setRenderedNode(renderedNode);
      // TODO: figure out a more dynamic way to wait until image has loaded
      await new Promise((resolve) => setTimeout(resolve, 15000));
      continueRender(handle);
    };
    renderNodeAsJSX();
  }, [nodeTree]);

  return renderedNode ?? <div>Loading..</div>;

  // return (
  //   <div className="relative w-[500px] h-[500px] bg-blue-300">
  //     <div
  //       className="absolute w-[100px] h-[100px] bg-red-300"
  //       style={{
  //         transformOrigin: 'center center',
  //         transform: 'translate(400px, 400px) rotate(180deg)',
  //       }}
  //     />
  //   </div>
  // );

  // return (
  //   <div className="flex items-center justify-center w-full h-full">
  //     <div
  //       key="base"
  //       className="absolute w-[100px] h-[100px] opacity-50 bg-orange-300"
  //     />

  //     <div
  //       key="inline"
  //       className="origin-marker absolute w-[100px] h-[100px] opacity-50 bg-blue-300"
  //       style={{
  //         transformOrigin: 'center center',
  //         transform: 'translate(50px, 50px) rotate(45deg)',
  //       }}
  //     />

  //     <div
  //       key="matrix"
  //       className="origin-marker absolute w-[100px] h-[100px] opacity-50 bg-blue-300"
  //       style={{
  //         transformOrigin: 'center center',
  //         transform: 'matrix(0.707, 0.707, -0.707, 0.707, 100, 100)',
  //       }}
  //     />

  //     <div
  //       key="split"
  //       className="absolute w-[100px] h-[100px]"
  //       style={{
  //         transformOrigin: 'center center',
  //         transform: 'translate(150px, 150px)',
  //       }}
  //     >
  //       <div
  //         className="origin-marker w-full h-full opacity-50 bg-purple-300"
  //         style={{
  //           transformOrigin: 'center center',
  //           transform: 'rotate(45deg)',
  //         }}
  //       />
  //     </div>
  //   </div>
  // );
};

export default FigmaNodeTreeV1;

type TProps = {
  nodeTree: TFrameNode;
};
