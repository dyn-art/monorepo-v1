import { serializeBodyToJson } from './serialize-body-to-json';

export function defaultBodySerializer(body: any, contentType?: string) {
  if (contentType != null && contentType.startsWith('application/json')) {
    return serializeBodyToJson(body);
  } else {
    return body;
  }
}
