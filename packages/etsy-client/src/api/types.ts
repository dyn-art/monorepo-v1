// ============================================================================
// /application/ping
// ============================================================================

export type TGet_Ping_ResponseDTO = {
  application_id: number;
};

// ============================================================================
// /application/users
// ============================================================================

export type TGet_Users_Me_ResponseDTO = {
  user_id: string;
  shop_id: string;
};

// ============================================================================
// /application/shops
// ============================================================================

export type TGet_ShopReceipts_ResponseDTO = {
  count: number;
  results: TReceiptDTO[];
};

export type TGet_ShopReceipts_QueryParamsDTO = {
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

export type TMoneyDTO = {
  amount: number;
  divisor: number;
  currency_code: string;
};

export type TShipmentDTO = {
  receipt_shipping_id?: number;
  shipment_notification_timestamp: number;
  carrier_name: string;
  tracking_code: string;
};

export type TTransactionDTO = {
  transaction_id: number;
  title?: string;
  description?: string;
  seller_user_id: number;
  buyer_user_id: number;
  create_timestamp: number;
  created_timestamp: number;
  paid_timestamp?: number;
  shipped_timestamp?: number;
  quantity: number;
  listing_image_id?: number;
  receipt_id: number;
  is_digital: boolean;
  file_data: string;
  listing_id?: number;
  transaction_type: string;
  product_id?: number;
  sku?: string;
  price: TMoneyDTO;
  shipping_cost: TMoneyDTO;
  variations: Array<{
    property_id: number;
    value_id?: number;
    formatted_name: string;
    formatted_value: string;
  }>;
  product_data: Array<{
    property_id: number;
    property_name?: string;
    scale_id?: number;
    scale_name?: string;
    value_ids: number[];
    values: string[];
  }>;
  shipping_profile_id?: number;
  min_processing_days?: number;
  max_processing_days?: number;
  shipping_method?: string;
  shipping_upgrade?: string;
  expected_ship_date?: number;
  buyer_coupon: number;
  shop_coupon: number;
};

export type TRefundDTO = {
  amount: TMoneyDTO;
  created_timestamp: number;
  reason?: string;
  note_from_issuer?: string;
  status?: string;
};

export type TReceiptDTO = {
  receipt_id: number;
  receipt_type: number;
  seller_user_id: number;
  seller_email?: string;
  buyer_user_id: number;
  buyer_email?: string;
  name: string;
  first_line: string;
  second_line?: string;
  city: string;
  state?: string;
  zip: string;
  status: string;
  formatted_address: string;
  country_iso: string;
  payment_method: string;
  payment_email: string;
  message_from_seller?: string;
  message_from_buyer?: string;
  message_from_payment?: string;
  is_paid: boolean;
  is_shipped: boolean;
  create_timestamp: number;
  created_timestamp: number;
  update_timestamp: number;
  updated_timestamp: number;
  is_gift: boolean;
  gift_message: string;
  grandtotal: TMoneyDTO;
  subtotal: TMoneyDTO;
  total_price: TMoneyDTO;
  total_shipping_cost: TMoneyDTO;
  total_tax_cost: TMoneyDTO;
  total_vat_cost: TMoneyDTO;
  discount_amt: TMoneyDTO;
  gift_wrap_price: TMoneyDTO;
  shipments: TShipmentDTO[];
  transactions: TTransactionDTO[];
  refunds: TRefundDTO[];
};

// ============================================================================
// /oauth/token
// ============================================================================

export type TPost_OAuthToken_ResponseDTO = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
};

export type TPost_OAuthToken_BodyDTO =
  | TPost_OAuthTokenRefreshToken_BodyDTO
  | TPost_OAuthTokenAuthorizationCode_BodyDTO;

export type TPost_OAuthTokenRefreshToken_BodyDTO = {
  grant_type: 'refresh_token';
  client_id: string;
  refresh_token: string;
};

export type TPost_OAuthTokenAuthorizationCode_BodyDTO = {
  grant_type: 'authorization_code';
  client_id: string;
  redirect_uri: string;
  code: string;
  code_verifier: string;
};
