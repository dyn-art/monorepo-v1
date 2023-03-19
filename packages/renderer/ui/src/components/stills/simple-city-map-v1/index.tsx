import * as d3Geo from 'd3-geo';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import React from 'react';

const SimpleCityMapV1: React.FC<TProps> = (props) => {
  const { tiles, projectionProps } = props;
  const projection = React.useMemo(
    () =>
      d3Geo
        .geoMercator()
        .center(projectionProps.center)
        .scale(projectionProps.scale)
        .translate(projectionProps.translate)
        .precision(projectionProps.precision),
    [projectionProps]
  );
  const geoPath = React.useMemo(() => d3Geo.geoPath(projection), [projection]);

  console.log('Tiles', tiles);

  if (!Array.isArray(tiles) || tiles.length <= 0) {
    return <p>No tiles found</p>;
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-white">
      <svg viewBox="0 0 600 600">
        {tiles.map((tile) => {
          return (
            <g key={`x${tile.viewBox.x}y${tile.viewBox.y}z${tile.viewBox.z}`}>
              <path fill="#EAF3E7" d={geoPath(tile.layers['park']) as string} />
              <path
                fill="#DADADA"
                stroke="#AAAAAA"
                strokeWidth="0.25"
                d={geoPath(tile.layers['building']) as string}
              />
              <path
                fill="#E7E9F3"
                // stroke="#AAAAAA"
                strokeWidth={0.75}
                d={geoPath(tile.layers['water']) as string}
              />
              <path
                fill="none"
                stroke="#E7E9F3"
                strokeWidth={0.75}
                d={geoPath(tile.layers['waterway']) as string}
              />
              <path
                fill="none"
                stroke="#000000"
                strokeWidth={0.75}
                d={geoPath(tile.layers['transportation']) as string}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default SimpleCityMapV1;

type TProps = {
  tiles: {
    layers: Record<string, FeatureCollection<Geometry, GeoJsonProperties>>;
    viewBox: {
      x: number;
      y: number;
      z: number;
    };
  }[];
  projectionProps: {
    center: [number, number];
    scale: number;
    translate: [number, number];
    precision: number;
  };
};
