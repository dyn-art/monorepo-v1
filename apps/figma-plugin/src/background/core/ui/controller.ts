import { createState } from '@agile-ts/core';
import { EUIPageRoute } from '../../../shared';

export const ACTIVE_UI_ROUTE = createState<EUIPageRoute | null>(null);
