import { TQuerySerializer } from '../types';
import { serializeQueryParams } from './serialize-query-params';

/**
 * Takes a URL with its parameters and combines them into a full URI.
 *
 * @param {string} path - Path of the URL
 * @param {object} options - An object containing baseURL, URL parameters, and querySerializer function
 * @returns {string} - Returns the final URL
 */
export function buildURI(baseURL: string, options: TBuildURIOptions): string {
  const {
    path = '',
    params: { query: queryParams = null, path: pathParams = null } = {},
    querySerializer = serializeQueryParams,
  } = options;
  const sanitizedBaseURL = sanitizeBaseURL(baseURL);
  const pathWithParams = injectPathParams(path, pathParams ?? undefined);
  const finalURL = appendQueryParams(
    `${sanitizedBaseURL}${pathWithParams}`,
    querySerializer,
    queryParams ?? undefined
  );
  return finalURL;
}

// Removes trailing slash from the base URL
function sanitizeBaseURL(baseUrl: string): string {
  return baseUrl.replace(/\/$/, '');
}

// Injects path parameters into the URL path
function injectPathParams(
  path: string,
  pathParams?: Record<string, unknown>
): string {
  let pathWithParams = path;
  if (pathParams != null) {
    for (const [key, value] of Object.entries(pathParams)) {
      pathWithParams = pathWithParams.replace(
        `{${key}}`,
        encodeURIComponent(String(value))
      );
    }
  }
  return pathWithParams;
}

// Appends query parameters to the URL
function appendQueryParams(
  path: string,
  querySerializer: TQuerySerializer<unknown>,
  queryParams?: Record<string, unknown>
): string {
  if (queryParams != null) {
    const queryString = querySerializer(queryParams);
    if (queryString != null) {
      return `${path}?${queryString}`;
    }
  }
  return path;
}

type TBuildURIOptions = {
  path?: `/${string}`;
  params?: TBuildURLParams;
  querySerializer?: TQuerySerializer<unknown>;
};

type TBuildURLParams = {
  query?: Record<string, unknown> | null;
  path?: Record<string, unknown> | null;
};
