import { createMapAxiosError } from '@pda/client-utils';
import { CoreServiceException } from '../exceptions';
import { logger } from '../logger';

export const mapAxiosError = createMapAxiosError(logger, CoreServiceException);
