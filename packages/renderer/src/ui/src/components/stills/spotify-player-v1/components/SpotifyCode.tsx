import axios from 'axios';
import React from 'react';
import { getSpotifyCodeUrl } from '../service';

const SpotifyCode: React.FC<TProps> = (props) => {
  const { backgroundColor, trackId, color } = props;
  const spotifyCodeUrl = React.useMemo<string>(
    () =>
      getSpotifyCodeUrl({
        backgroundColor,
        color: 'white',
        trackId,
      }),
    [backgroundColor, trackId]
  );
  const spotifyCodeRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await axios.get<string>(spotifyCodeUrl);
        const svgString = response.data;
        console.log({ svgString });
        // @ts-ignore
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(
          svgString.trim(),
          'image/svg+xml'
        );

        // Query SVG Elements
        const beamRectElements = svgDoc.querySelectorAll(
          'rect:not([x="0"]):not([y="0"])'
        );
        const logoPathElement = svgDoc.querySelector('g path');

        // Apply new colors to queried SVG Elements
        beamRectElements.forEach((rect) => {
          rect.setAttribute('fill', color);
        });
        logoPathElement?.setAttribute('fill', color);

        // Add viewBox and height attributes
        const svgElement = svgDoc.querySelector('svg');
        console.log({ svgElement });
        svgElement?.setAttribute('viewBox', '0 0 400 100');
        svgElement?.setAttribute('height', '48');

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
  }, [color]);

  return <div ref={spotifyCodeRef} />;
};

export default SpotifyCode;

type TProps = {
  backgroundColor: string;
  color: string;
  trackId: string;
};
