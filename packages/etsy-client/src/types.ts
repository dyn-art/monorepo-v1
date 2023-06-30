export type TOAuth2Config = {
  clientId: string;
  redirectUrl: string;
  scopes: string[];
  refresh?: {
    refreshToken: string;
    expiresAt: number;
  };
};
