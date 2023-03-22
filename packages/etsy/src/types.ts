export type TEtsyPingResponseDto = {
  application_id: number;
};

export type TEtsyAuthResponseDto = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
};

export type TGetMeResponseDto = {
  user_id: string;
  shop_id: string;
};
