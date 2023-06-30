import { EtsyClient } from './api';
import {
  TGet_ShopReceipts_QueryParamsDTO,
  TGet_ShopReceipts_ResponseDTO,
} from './api/types';

export class EtsyService {
  public readonly etsyClient: EtsyClient;

  private _userId: string;
  private _shopId: string;

  constructor(etsyClient: EtsyClient) {
    this.etsyClient = etsyClient;
  }

  public async getMe(
    force = true
  ): Promise<{ shopId: string; userId: string } | null> {
    if (this._userId == null || this._shopId == null || force) {
      const response = await this.etsyClient.getMe();
      if (response == null) return null;
      this._userId = response.user_id;
      this._shopId = response.shop_id;
    }
    return {
      userId: this._userId,
      shopId: this._shopId,
    };
  }

  public async getShopReceipts(
    options: TGet_ShopReceipts_QueryParamsDTO = {}
  ): Promise<TGet_ShopReceipts_ResponseDTO | null> {
    const me = await this.getMe();
    if (me == null) return null;
    return this.etsyClient.getShopReceipts(me.shopId, options);
  }
}
