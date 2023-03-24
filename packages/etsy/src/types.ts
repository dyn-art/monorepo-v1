export type TPingResponseDto = {
  application_id: number;
};

export type TAuthResponseDto = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
};

export type TGetMeResponseDto = {
  user_id: string;
  shop_id: string;
};

export type TGetShopReceiptsQueryParametersDto = {
  min_created?: number;
  max_created?: number;
  min_last_modified?: number;
  max_last_modified?: number;
  limit?: number;
  offset?: number;
  sort_on?: 'created' | 'updated' | 'receipt_id';
  sort_order?: 'asc' | 'desc';
  was_paid?: boolean;
  was_shipped?: boolean;
  was_delivered?: boolean;
};
