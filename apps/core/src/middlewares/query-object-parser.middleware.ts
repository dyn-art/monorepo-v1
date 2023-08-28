import { NextFunction, Request, Response } from 'express';

// Express query object parser as the used query parser (qs)
// doesn't support transforming parsed values into number, boolean..
// https://expressjs.com/en/5x/api.html#req.query
// https://github.com/ljharb/qs/issues/91
export function queryObjectParserMiddleware(
  options: TParseQueryObjectOptions = {}
) {
  return (req: Request, res: Response, next: NextFunction) => {
    req.query = parseQueryObject(req.query, options);
    next();
  };
}

export function parseQueryObject(
  target: unknown,
  options: TParseQueryObjectOptions = {}
): any {
  const {
    parseBoolean = true,
    parseNull = true,
    parseNumber = true,
    parseUndefined = true,
  } = options;

  switch (typeof target) {
    case 'string':
      if (target === '') {
        return '';
      } else if (parseNull && target === 'null') {
        return null;
      } else if (parseUndefined && target === 'undefined') {
        return undefined;
      } else if (parseBoolean && (target === 'true' || target === 'false')) {
        return target === 'true';
      } else if (parseNumber && !isNaN(Number(target))) {
        return Number(target);
      } else {
        return target;
      }
    case 'object':
      if (target == null) {
        return null;
      } else if (Array.isArray(target)) {
        return target.map((x) => parseQueryObject(x, options));
      } else {
        const obj = { ...target };
        Object.keys(obj).map(
          (key) => (obj[key] = parseQueryObject(target[key], options))
        );
        return obj;
      }
    default:
      return target;
  }
}

type TParseQueryObjectOptions = {
  parseNull?: boolean;
  parseUndefined?: boolean;
  parseBoolean?: boolean;
  parseNumber?: boolean;
};
