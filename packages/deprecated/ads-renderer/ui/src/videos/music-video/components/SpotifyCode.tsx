import axios from 'axios';
import React from 'react';
import { getSpotifyCodeUrl } from '../service';

const SpotifyCode: React.FC<TProps> = (props) => {
  const { trackId, color, backgroundColor, height = 48 } = props;
  const spotifyCodeUrl = React.useMemo<string>(
    () =>
      getSpotifyCodeUrl({
        backgroundColor: '#ff0000',
        color: 'white',
        trackId,
      }),
    [trackId]
  );
  const spotifyCodeRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await axios.get<string>(spotifyCodeUrl);
        const svgString = response.data;
        console.log({ svgString });
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(
          svgString.trim(),
          'image/svg+xml'
        );

        // Query SVG Elements
        const beamRectElements = svgDoc.querySelectorAll(
          'rect:not([x="0"][y="0"])'
        );
        const background = svgDoc.querySelector('rect[x="0"][y="0"]');
        const logoPathElement = svgDoc.querySelector('g path');

        // Apply new colors to queried SVG Elements
        beamRectElements.forEach((rect) => {
          rect.setAttribute('fill', color);
        });
        logoPathElement?.setAttribute('fill', color);
        background?.setAttribute('fill', backgroundColor ?? 'none');

        // Add viewBox and height attributes
        const svgElement = svgDoc.querySelector('svg');
        console.log({ svgElement });
        svgElement?.setAttribute('viewBox', '0 0 400 100');
        svgElement?.setAttribute('height', height.toString());

        // Update SVG
        const divElement = spotifyCodeRef.current;
        if (divElement != null) {
          divElement.replaceChildren(svgDoc.documentElement);
        }
      } catch (e) {
        console.error('Failed to fetch Spotify Code!', e);
      }
    };
    fetchSvg();
  }, [color, backgroundColor, height]);

  return <div ref={spotifyCodeRef} />;
};

export default SpotifyCode;

type TProps = {
  backgroundColor?: string;
  color: string;
  trackId: string;
  height?: number;
};
