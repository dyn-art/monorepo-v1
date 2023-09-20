export async function loadFont(
  fontConfig: string,
  onLoaded: (fontConfig: string) => void,
  onError: (code: string, fontConfig: string, error: unknown) => void
) {
  try {
    const WebFont = (await import('webfontloader')).default;
    WebFont.load({
      google: {
        families: [fontConfig],
      },
      fontactive: (name) => {
        if (fontConfig.includes(name)) {
          onLoaded(fontConfig);
        }
      },
      fontinactive: (name) => {
        onError('#FONT_INACTIVE', fontConfig, null);
      },
    });
  } catch (error) {
    onError('#UNKNOWN', fontConfig, error);
  }
}
