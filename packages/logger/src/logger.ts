export class Logger {
  public readonly config: TLoggerConfig;
  private _isActive: boolean;

  private _loggerCategories: Map<string, TLoggerCategory> = new Map();

  private _callbacks: TLoggerCallbackObject[] = [];

  constructor(config: TLoggerConstructorConfig = {}) {
    const {
      active = true,
      allowCustomStyling: allowCustomStyles = false,
      level = LOG_LEVEL.WARN,
      prefix,
      showTimestamp = false,
    } = config;
    this.config = {
      allowCustomStyling: allowCustomStyles,
      level,
      prefix,
      showTimestamp,
    };
    this._isActive = active;
    this.createDefaultLoggerCategories();
  }

  // ============================================================================
  // Default Logs
  // ============================================================================

  public log(...data: any[]) {
    this.invokeConsole('log', data);
  }

  public debug(...data: any[]) {
    this.invokeConsole('debug', data);
  }

  public info(...data: any[]) {
    this.invokeConsole('info', data);
  }

  public success(...data: any[]) {
    this.invokeConsole('success', data);
  }

  public warn(...data: any[]) {
    this.invokeConsole('warn', data);
  }

  public error(...data: any[]) {
    this.invokeConsole('error', data);
  }

  public custom(loggerCategoryKey: string, ...data: any[]) {
    this.invokeConsole(loggerCategoryKey, data);
  }

  // ============================================================================
  // Public
  // ============================================================================

  public createLoggerCategory(category: TCreateLoggerCategory) {
    const {
      key,
      customStyle,
      level = 0,
      prefix,
      logVariant = 'log',
    } = category;
    if (this._loggerCategories.has(key)) {
      console.warn(
        `Logger category with the key '${key}' already exists and is overwritten by new category!`,
        { category }
      );
    }
    this._loggerCategories.set(key, { level, prefix, customStyle, logVariant });
  }

  public registerCallback(
    callback: TLoggerCallback,
    config: TRegisterLoggerCallbackConfig
  ) {
    const { level = 0 } = config;
    this._callbacks.push({ callback, level });
  }

  public setLevel(level: number) {
    this.config.level = level;
  }

  public setActive(isActive: boolean) {
    this._isActive = isActive;
  }

  // ============================================================================
  // Helper
  // ============================================================================

  private invokeConsole(categoryKey: string, data: any[]) {
    const toLogData = data;
    const loggerCategory = this._loggerCategories.get(categoryKey);

    if (
      loggerCategory == null ||
      !this._isActive ||
      loggerCategory.level < this.config.level
    ) {
      return;
    }

    // Concat prefix to first data string
    const prefix = this.buildLogPrefix(loggerCategory);
    if (typeof toLogData[0] === 'string') {
      toLogData[0] = `${prefix}${prefix !== '' ? ' ' : ''}${toLogData[0]}`;
    } else {
      toLogData.unshift(prefix);
    }

    // Call watcher callbacks
    this._callbacks.forEach((callbackProps) => {
      if (callbackProps.level >= loggerCategory.level) {
        callbackProps.callback(toLogData, loggerCategory);
      }
    });

    // Invoke custom styling if provided (Note: Only works with one string element)
    if (
      this.config.allowCustomStyling &&
      loggerCategory.customStyle != null &&
      typeof toLogData[0] === 'string'
    ) {
      toLogData[0] = `%c${toLogData[0]}`;
      toLogData.splice(1, 0, loggerCategory.customStyle);
    }

    // Handle log
    if (console[loggerCategory.logVariant] != null) {
      // @ts-ignore
      console[loggerCategory.logVariant](...toLogData);
    }
  }

  private buildLogPrefix(loggerCategory: TLoggerCategory) {
    let currentPrefix = '';

    // Concat timestamp
    if (this.config.showTimestamp) {
      currentPrefix = `${currentPrefix}[${new Date(
        Date.now()
      ).toLocaleString()}]`;
    }

    // Concat custom prefix
    if (this.config.prefix != null || loggerCategory.prefix != null) {
      let customPrefix = '';
      if (this.config.prefix != null) {
        customPrefix = `${customPrefix}${this.config.prefix}`;
      }
      if (loggerCategory.prefix != null) {
        customPrefix = `${customPrefix}${
          this.config.prefix != null ? ' | ' : ''
        }${loggerCategory.prefix}`;
      }
      currentPrefix = `${currentPrefix} (${customPrefix})`;
    }

    return currentPrefix.trim();
  }

  private createDefaultLoggerCategories() {
    this.createLoggerCategory({
      key: 'debug',
      level: LOG_LEVEL.DEBUG,
      logVariant: typeof console.debug !== 'undefined' ? 'debug' : 'log',
      prefix: 'Debug',
    });
    this.createLoggerCategory({
      key: 'log',
      level: LOG_LEVEL.INFO,
      logVariant: 'log',
    });
    this.createLoggerCategory({
      key: 'info',
      level: LOG_LEVEL.INFO,
      logVariant: typeof console.info !== 'undefined' ? 'info' : 'log',
      prefix: 'Info',
    });
    this.createLoggerCategory({
      key: 'success',
      level: LOG_LEVEL.SUCCESS,
      logVariant: 'log',
      prefix: 'Success',
    });
    this.createLoggerCategory({
      key: 'warn',
      level: LOG_LEVEL.WARN,
      logVariant: typeof console.warn !== 'undefined' ? 'warn' : 'log',
      prefix: 'Warn',
    });
    this.createLoggerCategory({
      key: 'error',
      level: LOG_LEVEL.ERROR,
      logVariant: typeof console.error !== 'undefined' ? 'error' : 'log',
      prefix: 'Error',
    });
  }
}

type TLoggerConstructorConfig = {
  active?: boolean;
} & Partial<TLoggerConfig>;

type TLoggerConfig = {
  prefix?: string;
  allowCustomStyling: boolean;
  level: LOG_LEVEL | number;
  showTimestamp: boolean;
};

type TCreateLoggerCategory = { key: string } & Partial<TLoggerCategory>;

type TLoggerCategory = {
  customStyle?: string;
  prefix?: string;
  level: LOG_LEVEL | number;
  logVariant: TLogVariants;
};

type TRegisterLoggerCallbackConfig = Omit<
  Partial<TLoggerCallbackObject>,
  'callback'
>;

type TLoggerCallbackObject = {
  level: LOG_LEVEL | number;
  callback: TLoggerCallback;
};

type TLoggerCallback = (data: any[], loggerCategory: TLoggerCategory) => void;

export enum LOG_LEVEL {
  DEBUG = 2,
  LOG = 5,
  INFO = 10,
  SUCCESS = 15,
  WARN = 20,
  ERROR = 50,
}

export type TLogVariants =
  | 'log'
  | 'warn'
  | 'error'
  | 'table'
  | 'info'
  | 'debug';
