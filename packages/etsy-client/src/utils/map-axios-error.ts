import { createMapAxiosError } from '@pda/client-utils';
import { EtsyServiceException } from '../exceptions';
import { logger } from '../logger';

export const mapAxiosError = createMapAxiosError(logger, EtsyServiceException);
