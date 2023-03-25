import { EtsyClient } from './EtsyClient';
import { TGetShopReceiptsResponseDto } from './types';

export class EtsyService {
  private readonly etsyClient: EtsyClient;

  private userId: string;
  private shopId: string;

  constructor(etsyClient: EtsyClient) {
    this.etsyClient = etsyClient;
  }

  public async getMe(
    force = true
  ): Promise<{ shopId: string; userId: string } | null> {
    if (this.userId == null || this.shopId == null || force) {
      const response = await this.etsyClient.getMe();
      if (response == null) return null;
      this.userId = response.user_id;
      this.shopId = response.shop_id;
    }
    return {
      userId: this.userId,
      shopId: this.shopId,
    };
  }

  public async getShopReceipts(): Promise<TGetShopReceiptsResponseDto | null> {
    const me = await this.getMe();
    if (me == null) return null;
    return this.etsyClient.getShopReceipts(me.shopId);
  }
}
