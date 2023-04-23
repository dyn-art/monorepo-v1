export function parseArgs(potentialArgs: string[], config: TParseArgsConfig) {
  const { argumentIdentifierChar = '-', splitBy = ' ' } = config;

  // Extract relevant arguments
  const relevantArgs: Map<
    string,
    { values: string[]; option: TParseArgsOption }
  > = new Map();
  let activeArgumentKey: string | null = null;
  for (let i = 0; i < potentialArgs.length; i++) {
    const argOption = potentialArgs[i].startsWith(argumentIdentifierChar)
      ? config.options.find(
          (argOption) =>
            `${argumentIdentifierChar}${argumentIdentifierChar}${argOption.name}` ===
              potentialArgs[i] ||
            `${argumentIdentifierChar}${argOption.short}` === potentialArgs[i]
        )
      : null;
    if (argOption != null) {
      activeArgumentKey = argOption.name;
      if (!relevantArgs.has(activeArgumentKey)) {
        relevantArgs.set(activeArgumentKey, {
          values: [],
          option: argOption,
        });
      }
    } else if (
      activeArgumentKey != null &&
      relevantArgs.has(activeArgumentKey)
    ) {
      relevantArgs.get(activeArgumentKey)?.values.push(potentialArgs[i]);
    }
  }

  // Parse relevant arguments
  const result: Record<
    string,
    string | number | boolean | string[] | number[] | boolean[] | null
  > = {};
  for (const searchedArgOption of config.options) {
    const relevantArg = relevantArgs.get(searchedArgOption.name);
    if (relevantArg == null) {
      result[searchedArgOption.name] =
        searchedArgOption.type === 'boolean' ? false : null;
      continue;
    }
    const option = relevantArg.option;
    const values = relevantArg.values;

    try {
      switch (option.type) {
        case 'string':
          if (option.isArray) {
            const combined = values.join(splitBy);
            result[option.name] = combined.split(
              typeof option.isArray !== 'boolean' ? option.isArray.splitBy : ','
            );
          } else if (values.length > 0) {
            result[option.name] = values.join(splitBy);
          } else {
            result[option.name] = null;
          }
          break;
        case 'number':
          if (option.isArray) {
            const combined = values.join(splitBy);
            result[option.name] = combined
              .split(
                typeof option.isArray !== 'boolean'
                  ? option.isArray.splitBy
                  : ','
              )
              .map((value) => {
                const parsedValue = parseNumber(value);
                if (parsedValue == null) throw Error();
                return parsedValue;
              });
          } else if (values.length > 0) {
            result[option.name] = parseNumber(values[0]);
          } else {
            result[option.name] = null;
          }
          break;
        case 'boolean':
          if (option.isArray) {
            const combined = values.join(splitBy);
            result[option.name] = combined
              .split(
                typeof option.isArray !== 'boolean'
                  ? option.isArray.splitBy
                  : ','
              )
              .map((value) => {
                const parsedValue = parseBoolean(value);
                if (parsedValue == null) throw Error();
                return parsedValue;
              });
          } else if (values.length > 0) {
            result[option.name] = parseBoolean(values[0]);
          } else {
            result[option.name] = true;
          }
          break;
        default:
        // do nothing
      }
    } catch (error) {
      console.error(
        `Failed to parse argument '${option.name}' with value '${values}'!`
      );
      result[searchedArgOption.name] = null;
    }
  }

  return result;
}

function parseBoolean(input: string): boolean | null {
  try {
    const match = input.match(/\b(true|false)\b/g);
    return match != null ? match[0] === 'true' : null;
  } catch (error) {
    console.error(`Failed to parse '${input}' to boolean!`);
  }
  return null;
}

function parseNumber(input: string): number | null {
  try {
    const parsed = input
      .trim() // Remove excess whitespace
      .replace(/\D+/g, ''); // Replace anything that is not a digit (0 - 9)
    const result = parseFloat(parsed);
    return isNaN(result) ? null : result;
  } catch (error) {
    console.error(`Failed to parse '${input}' to number!`);
  }
  return null;
}

type TParseArgsOption = {
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
  options: TParseArgsOption[];
  argumentIdentifierChar?: string;
  splitBy?: string;
};
