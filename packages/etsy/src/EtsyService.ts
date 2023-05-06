import { EtsyClient } from './EtsyClient';
import {
  TGetShopReceiptsQueryParametersDto,
  TGetShopReceiptsResponseDto,
} from './types';

export class EtsyService {
  private readonly _etsyClient: EtsyClient;

  private _userId: string;
  private _shopId: string;

  constructor(etsyClient: EtsyClient) {
    this._etsyClient = etsyClient;
  }

  public async getMe(
    force = true
  ): Promise<{ shopId: string; userId: string } | null> {
    if (this._userId == null || this._shopId == null || force) {
      const response = await this._etsyClient.getMe();
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
    options: TGetShopReceiptsQueryParametersDto = {}
  ): Promise<TGetShopReceiptsResponseDto | null> {
    const me = await this.getMe();
    if (me == null) return null;
    return this._etsyClient.getShopReceipts(me.shopId, options);
  }
}
