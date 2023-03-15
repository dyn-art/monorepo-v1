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

export function getSliderBackgroundSize(current: number, total: number) {
  return { backgroundSize: `${(current * 100) / total}% 100%` };
}

export function getSpotifyCodeUrl(options: {
  backgroundColor: string;
  trackId: string;
}) {
  return `https://scannables.scdn.co/uri/plain/svg/${options.backgroundColor}/white/640/spotify:track:${options.trackId}`;
}
