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
    params: { query: queryParams = {}, path: pathParams = {} } = {},
    querySerializer = serializeQueryParams,
  } = options;
  const sanitizedBaseURL = sanitizeBaseURL(baseURL);
  const sanitizedPath = sanitizePath(path);
  const pathWithParams = injectPathParams(sanitizedPath, pathParams);
  const finalURL = appendQueryParams(
    `${sanitizedBaseURL}/${pathWithParams}`,
    queryParams,
    querySerializer
  );
  return finalURL;
}

type TBuildURIOptions = {
  path?: `/${string}`;
  params?: TBuildURLParams;
  querySerializer?: TQuerySerializer<unknown>;
};

type TBuildURLParams = {
  query?: Record<string, unknown>;
  path?: Record<string, unknown>;
};

// Removes trailing slash from the base URL
function sanitizeBaseURL(baseUrl: string): string {
  return baseUrl.replace(/\/$/, '');
}

// Removes leading slash from the path
function sanitizePath(path: string): string {
  return path.replace(/^\//, '');
}

// Injects path parameters into the URL path
function injectPathParams(
  path: string,
  pathParams: Record<string, unknown>
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
  queryParams: Record<string, unknown>,
  querySerializer: TQuerySerializer<unknown>
): string {
  if (queryParams != null) {
    const queryString = querySerializer(queryParams);
    if (queryString != null) {
      return `${path}?${queryString}`;
    }
  }
  return path;
}
