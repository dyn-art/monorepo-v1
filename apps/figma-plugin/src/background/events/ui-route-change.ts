import { TBackgroundEventMeta } from '@dyn/figma-handler';
import {
  TBackgroundFigmaMessageEvent,
  TUIFigmaMessageEvent,
} from '../../shared';
import { TBackgroundHandler } from '../background-handler';
import { ACTIVE_UI_ROUTE } from '../core/ui';

export default {
  type: 'ui.message',
  key: 'on-ui-route-change',
  callback: (instance: TBackgroundHandler, args) => {
    ACTIVE_UI_ROUTE.set(args.activeRoute);
  },
} as TBackgroundEventMeta<TBackgroundFigmaMessageEvent, TUIFigmaMessageEvent>;
