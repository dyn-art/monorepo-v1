import React from 'react';

export const Canvas: React.FC<TProps> = (props) => {
  const { canvasRef } = props;
  const cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='20px' height='20px' %3E%3Cg transform='rotate(0 8,8)'%3E%3C%70%61%74%68%20%66%69%6C%6C%3D%27%23%66%66%66%27%20%64%3D%27%4D%31%20%31%34%2E%36%56%33%2E%34%6C%38%2E%32%20%38%2E%32%48%34%6C%2D%33%20%33%7A%27%2F%3E%20%3C%70%61%74%68%20%66%69%6C%6C%3D%27%23%32%33%31%46%32%30%27%20%66%69%6C%6C%2D%72%75%6C%65%3D%27%65%76%65%6E%6F%64%64%27%20%64%3D%27%4D%30%20%31%37%56%31%6C%31%31%2E%36%20%31%31%2E%36%48%34%2E%34%4C%30%20%31%37%7A%6D%34%2D%35%2E%34%68%35%2E%32%4C%31%20%33%2E%34%76%31%31%2E%32%6C%33%2D%33%7A%27%20%63%6C%69%70%2D%72%75%6C%65%3D%27%65%76%65%6E%6F%64%64%27%2F%3E%3C/g%3E%3C/svg%3E") 0 0, auto`;

  return (
    <div
      id={'canvas'}
      ref={canvasRef as any}
      className="absolute h-full w-full pointer-events-auto"
      style={{ cursor }}
    />
  );
};

type TProps = {
  canvasRef: React.LegacyRef<HTMLDivElement>;
};
