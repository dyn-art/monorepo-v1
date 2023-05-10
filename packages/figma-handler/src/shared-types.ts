export type TBaseFigmaMessageEvent = {
  key: string;
  args: any;
};

export type AnyExtract<T, U> = T extends U ? T : any;
