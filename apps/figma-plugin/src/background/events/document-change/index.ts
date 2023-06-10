import { TBackgroundEventMeta } from '@pda/figma-handler';
import {
  TBackgroundFigmaMessageEvent,
  TUIFigmaMessageEvent,
  logger,
} from '../../../shared';
import { TBackgroundHandler } from '../../background-handler';
import { onPropertyChange } from './events';

export default {
  type: 'documentchange',
  key: 'document-change-event',
  callback: (instance: TBackgroundHandler, event) => {
    logger.info(`Called Event: 'documentchange'`, { event });
    for (const documentChange of event.documentChanges) {
      switch (documentChange.type) {
        case 'PROPERTY_CHANGE':
          onPropertyChange(instance, documentChange);
          break;
        default:
        // do nothing
      }
    }
  },
} as TBackgroundEventMeta<TBackgroundFigmaMessageEvent, TUIFigmaMessageEvent>;
