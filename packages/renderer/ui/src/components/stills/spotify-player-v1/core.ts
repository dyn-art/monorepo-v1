export const THEMES = {
  dark: {
    primary: '#57B65F',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    background: '#131212',
  } as TTheme,
  light: {
    primary: '#57B65F',
    text: '#131212',
    textSecondary: '#898989',
    background: '#FFFFFF',
  } as TTheme,
};

export type TTheme = {
  primary: string;
  text: string;
  textSecondary: string;
  background: string;
};
