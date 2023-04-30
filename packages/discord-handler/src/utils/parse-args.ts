import { logger } from '../logger';

const DEFAULT_ARGUMENT_IDENTIFIER_CHAR = '-';
const DEFAULT_SPLIT_BY = ' ';
const DEFAULT_ARRAY_SPLIT_BY = ',';

export function parseArgs(potentialArgs: string[], config: TParseArgsConfig) {
  const {
    argumentIdentifierChar = DEFAULT_ARGUMENT_IDENTIFIER_CHAR,
    splitBy = DEFAULT_SPLIT_BY,
  } = config;

  // Extract relevant arguments
  const relevantArgs = extractRelevantArguments(
    potentialArgs,
    config,
    argumentIdentifierChar
  );

  // Parse the relevant arguments
  return parseRelevantArguments(relevantArgs, config, splitBy);
}

// Helper function to extract relevant arguments from potentialArgs
function extractRelevantArguments(
  potentialArgs: string[],
  config: TParseArgsConfig,
  argumentIdentifierChar: string
) {
  const relevantArgs: Map<
    string,
    { values: string[]; options: TParseArgsOptions }
  > = new Map();
  let activeArgumentKey: string | null = null;

  // Loop through potentialArgs to identify relevant arguments by 'argumentIdentifierChar'
  for (const potentialArg of potentialArgs) {
    // Check if the current argument matches any of the options in the config
    const argsOptions = potentialArg.startsWith(argumentIdentifierChar)
      ? config.options.find(
          (argOptions) =>
            `${argumentIdentifierChar}${argumentIdentifierChar}${argOptions.name}` ===
              potentialArg ||
            `${argumentIdentifierChar}${argOptions.short}` === potentialArg
        )
      : null;

    // If the current argument matches an option, update the activeArgumentKey
    // and store the option in relevantArgs
    if (argsOptions != null) {
      activeArgumentKey = argsOptions.name;
      if (!relevantArgs.has(activeArgumentKey)) {
        relevantArgs.set(activeArgumentKey, {
          values: [],
          options: argsOptions,
        });
      }
    }
    // If the current argument is a value for the active option, add it to relevantArgs
    else if (activeArgumentKey != null && relevantArgs.has(activeArgumentKey)) {
      relevantArgs.get(activeArgumentKey)?.values.push(potentialArg);
    }
  }

  return relevantArgs;
}

// Helper function to parse relevant arguments and generate the result
function parseRelevantArguments(
  relevantArgs: Map<string, { values: string[]; options: TParseArgsOptions }>,
  config: TParseArgsConfig,
  splitBy: string
) {
  const result: TParsedArgs = new Map();

  // Loop through the config options and parse the relevant argument values
  for (const searchedArgOptions of config.options) {
    const relevantArg = relevantArgs.get(searchedArgOptions.name);

    // If the relevant argument is not found, set value to null
    // (exception with boolean as it can be assumed that if it is not set it is false)
    if (relevantArg == null) {
      result.set(
        searchedArgOptions.name,
        searchedArgOptions.type === 'boolean' ? false : null
      );
      continue;
    }

    const option = relevantArg.options;
    const values = relevantArg.values;

    // Try to parse the values based on the option type
    try {
      switch (option.type) {
        // Parse string
        case 'string':
          if (option.isArray) {
            const combined = values.join(splitBy);
            result.set(
              option.name,
              combined.split(
                typeof option.isArray !== 'boolean'
                  ? option.isArray.splitBy
                  : DEFAULT_ARRAY_SPLIT_BY
              )
            );
          } else if (values.length > 0) {
            result.set(option.name, values.join(splitBy));
          } else {
            result.set(option.name, null);
          }
          break;

        // Parse number
        case 'number':
          if (option.isArray) {
            const combined = values.join(splitBy);
            result.set(
              option.name,
              combined
                .split(
                  typeof option.isArray !== 'boolean'
                    ? option.isArray.splitBy
                    : DEFAULT_ARRAY_SPLIT_BY
                )
                .map((value) => {
                  const parsedValue = parseNumber(value);
                  if (parsedValue == null) throw Error();
                  return parsedValue;
                })
            );
          } else if (values.length > 0) {
            result.set(option.name, parseNumber(values[0]));
          } else {
            result.set(option.name, null);
          }
          break;

        // Parse boolean
        case 'boolean':
          if (option.isArray) {
            const combined = values.join(splitBy);
            result.set(
              option.name,
              combined
                .split(
                  typeof option.isArray !== 'boolean'
                    ? option.isArray.splitBy
                    : DEFAULT_ARRAY_SPLIT_BY
                )
                .map((value) => {
                  const parsedValue = parseBoolean(value);
                  if (parsedValue == null) throw Error();
                  return parsedValue;
                })
            );
          } else if (values.length > 0) {
            result.set(option.name, parseBoolean(values[0]));
          } else {
            result.set(option.name, true);
          }
          break;

        default:
        // do nothing
      }
    } catch (error) {
      logger.error(
        `Failed to parse argument '${option.name}' with value '${values}'!`
      );
      result.set(searchedArgOptions.name, null);
    }
  }

  return result;
}

// Helper function to parse a boolean value from a string
function parseBoolean(input: string): boolean | null {
  try {
    const match = input.match(/\b(true|false)\b/g);
    return match != null ? match[0] === 'true' : null;
  } catch (error) {
    logger.error(`Failed to parse '${input}' to boolean!`);
  }
  return null;
}

// Helper function to parse a number value from a string
function parseNumber(input: string): number | null {
  try {
    const parsed = input
      .trim() // Remove excess whitespace
      .replace(/\D+/g, ''); // Replace anything that is not a digit (0 - 9)
    const result = parseFloat(parsed);
    return isNaN(result) ? null : result;
  } catch (error) {
    logger.error(`Failed to parse '${input}' to number!`);
  }
  return null;
}

type TParseArgsOptions = {
  type: 'string' | 'number' | 'boolean';
  name: string;
  short?: string;
  optional?: boolean;
  isArray?:
    | boolean
    | {
        splitBy: string;
      };
};

export type TParseArgsConfig = {
  options: TParseArgsOptions[];
  argumentIdentifierChar?: string;
  splitBy?: string;
};

export type TParsedArgs = Map<
  string,
  string | number | boolean | string[] | number[] | boolean[] | null
>;
