import { RequestClient } from '@pda/client-utils';
import { paths } from '../gen/v3';
import { logger } from '../logger';

export class EtsyService {
  public readonly etsyClient: RequestClient<paths>;

  private _userId: number;
  private _shopId: number;

  constructor(etsyClient: RequestClient<paths>) {
    this.etsyClient = etsyClient;
  }

  public async ping() {
    const response = await this.etsyClient.get('/v3/application/openapi-ping', {
      middlewareProps: { noAuth: true },
    });
    if (response.isError) {
      logger.error(response.error.message);
      return false;
    } else {
      return true;
    }
  }

  public async getMe(
    force = true
  ): Promise<{ shop_id: number; user_id: number }> {
    if (this._userId == null || this._shopId == null || force) {
      const response = await this.etsyClient.get(
        '/v3/application/users/me',
        {}
      );
      if (response.isError) {
        logger.error(response.error.message);
        throw response.error;
      } else {
        this._userId = response.data.user_id as number;
        this._shopId = response.data.shop_id as number;
      }
    }
    return {
      user_id: this._userId,
      shop_id: this._shopId,
    };
  }

  public async getShopReceipts(
    options: paths['/v3/application/shops/{shop_id}/receipts']['get']['parameters']['query'] = {}
  ) {
    const me = await this.getMe();
    const response = await this.etsyClient.get(
      '/v3/application/shops/{shop_id}/receipts',
      {
        params: {
          path: {
            shop_id: me.shop_id,
          },
          query: options,
        },
      }
    );
    if (response.isError) {
      logger.error(response.error.message);
      throw response.error;
    } else {
      return response.data;
    }
  }
}
