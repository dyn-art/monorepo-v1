// https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
export function formatDuration(duration: number) {
  // Hours, minutes and seconds
  const hrs = Math.floor(duration / 3600);
  const mins = Math.floor((duration % 3600) / 60);
  const secs = Math.floor(duration) % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = '';

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;

  return ret;
}

export function getSpotifyCodeUrl(options: {
  backgroundColor: string;
  color: 'black' | 'white';
  trackId: string;
}) {
  const backgroundColor = options.backgroundColor.replace('#', '');
  return `https://scannables.scdn.co/uri/plain/svg/${backgroundColor}/${options.color}/640/spotify:track:${options.trackId}`;
}

/**
 * Darkens or applies opacity to a hex color.
 *
 * @param hex - The hex color to modify.
 * @param options - An object with `darken` and `opacity` options to apply.
 * @returns The modified hex color string.
 */
export function modifyHex(
  hex: string,
  options: { darken?: number; opacity?: number } = {}
): string {
  const { darken = 0, opacity = 1 } = options;
  let hexWithoutHash = hex.replace('#', '');

  // Convert shorthand hex notation to full notation if necessary
  if (hexWithoutHash.length === 3) {
    hexWithoutHash = hexWithoutHash
      .split('')
      .map((char) => `${char}${char}`)
      .join('');
  }

  if (hexWithoutHash.length !== 6) {
    return hex;
  }

  // Convert hex to RGB
  const r = parseInt(hexWithoutHash.substring(0, 2), 16);
  const g = parseInt(hexWithoutHash.substring(2, 4), 16);
  const b = parseInt(hexWithoutHash.substring(4, 6), 16);

  // Darken RGB values
  const amount = darken / 100;
  const darkenedR = Math.round(r * (1 - amount));
  const darkenedG = Math.round(g * (1 - amount));
  const darkenedB = Math.round(b * (1 - amount));

  // Convert darkened RGB values back to hex
  const darkenedHex = `#${((darkenedR << 16) | (darkenedG << 8) | darkenedB)
    .toString(16)
    .padStart(6, '0')}`;

  // Apply opacity to darkened hex
  const rgba = `rgba(${darkenedR}, ${darkenedG}, ${darkenedB}, ${opacity})`;

  return opacity === 1 ? darkenedHex : rgba;
}
