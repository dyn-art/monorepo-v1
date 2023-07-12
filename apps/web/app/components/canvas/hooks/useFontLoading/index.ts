import { logger } from '@/core/logger';
import React from 'react';
import { useHydrated } from '../useHydrated';
import { loadFont } from './load-font';

export function useFontLoading(
  config: TUseFontLoadingConfig
): TUseFontLoadingResponse {
  const { family: fontFamily, weight: fontWeight } = config;
  const [loadedFontString, setLoadedFontString] = React.useState<string | null>(
    null
  );
  const isHydrated = useHydrated();

  React.useEffect(() => {
    if (isHydrated && fontFamily != null) {
      const fontConfig = `${fontFamily}${
        fontWeight != null ? `:${fontWeight}` : ''
      }`;
      loadFont(fontConfig, setLoadedFontString, (code, fontConfig, error) => {
        logger.error(
          `Failed to load font '${fontConfig}' with error: ${code}`,
          { error }
        );
      });
    }
  }, [isHydrated, fontFamily, fontWeight]);

  return loadedFontString != null
    ? {
        hasLoaded: true,
        fontConfig: config,
        fontString: loadedFontString,
      }
    : { hasLoaded: false };
}

export type TUseFontLoadingConfig = {
  family?: string;
  weight?: number | string;
};

export type TUseFontLoadingResponse =
  | { hasLoaded: true; fontConfig: TUseFontLoadingConfig; fontString: string }
  | { hasLoaded: false };
