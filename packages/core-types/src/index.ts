// ============================================================================
// /media
// ============================================================================

export type TGet_Media_PreSignedUploadUrl_ResponseDTO = {
  uploadUrl: string;
  key: string;
};

export type TGet_Media_PreSignedUploadUrl_QueryParamsDTO = {
  key?: string;
  content_type?: string;
  scope?: string;
  overwrite?: boolean;
};

export type TGet_Media_PreSignedDownloadUrl_ResponseDTO = {
  download_url: string;
  key: string;
};

export type TGet_Media_PreSignedDownloadUrl_ParamsDTO = {
  key: string;
};

// ============================================================================
// /auth/etsy
// ============================================================================

export type TGet_Auth_Etsy_GetPing_ResponseDTO = boolean;

export type TGet_Auth_Etsy_OAuthChallenge_ResponseDTO = {
  challenge: string;
};

export type TGet_Auth_Etsy_OAuthRedirect_QueryParamsDTO = {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
};

export type TGet_Auth_Etsy_OAuthRedirect_ResponseDTO = {
  access_token: string;
  refresh_token: string;
  refresh_token_expires_at: number;
};

// ============================================================================
// Error
// ============================================================================

export type TError_ResponseDTO = {
  error_code: string;
  error_description: string | null;
  error_uri: string | null;
  additional_errors: Array<Record<string, any>>;
};
