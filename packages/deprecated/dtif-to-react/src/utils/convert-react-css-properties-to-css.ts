import React from 'react';

export function convertReactCSSPropertiesToCSS(
  reactCSS: React.CSSProperties
): string {
  return Object.entries(reactCSS)
    .map(([key, value]) => `${camelToKebab(key)}:${value}`)
    .join('; ');
}

function camelToKebab(string: string): string {
  return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}
