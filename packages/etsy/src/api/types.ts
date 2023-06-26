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

export type TMoneyDto = {
  amount: number;
  divisor: number;
  currency_code: string;
};

export type TShipmentDto = {
  receipt_shipping_id?: number;
  shipment_notification_timestamp: number;
  carrier_name: string;
  tracking_code: string;
};

export type TTransactionDto = {
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
  price: TMoneyDto;
  shipping_cost: TMoneyDto;
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

export type TRefundDto = {
  amount: TMoneyDto;
  created_timestamp: number;
  reason?: string;
  note_from_issuer?: string;
  status?: string;
};

export type TReceiptDto = {
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
  grandtotal: TMoneyDto;
  subtotal: TMoneyDto;
  total_price: TMoneyDto;
  total_shipping_cost: TMoneyDto;
  total_tax_cost: TMoneyDto;
  total_vat_cost: TMoneyDto;
  discount_amt: TMoneyDto;
  gift_wrap_price: TMoneyDto;
  shipments: TShipmentDto[];
  transactions: TTransactionDto[];
  refunds: TRefundDto[];
};

export type TGetShopReceiptsResponseDto = {
  count: number;
  results: TReceiptDto[];
};
