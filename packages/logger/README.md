# `@dyn/logger`

The `@dyn/logger` package is a powerful, flexible logging utility for JavaScript applications. It supports various logging levels, custom log categories, and customizable log styling.

## Features
- Supports common log levels (debug, info, success, warn, error).
- Allows custom log categories with specified log levels and styling.
- Supports custom log callbacks for log watchers.
- Allows control over log level globally and per category.
- Provides an option to show timestamps in log messages.
- Permits custom styling of log messages in the console (browser context).

## Installation
To add `@dyn/logger` to your project, use:

```bash
npm install @dyn/logger
```

## Usage

```js
import { Logger, LOG_LEVEL } from '@dyn/logger';

// Initialize the Logger
const logger = new Logger({
  active: true,
  allowCustomStyling: true,
  level: LOG_LEVEL.WARN,
  prefix: 'myApp',
  showTimestamp: true
});

// Log messages
logger.log('This is a general log message');
logger.info('This is an informative message');
logger.warn('This is a warning message');
logger.error('This is an error message');

// Create a custom log category
logger.createLoggerCategory({
  key: 'customCategory',
  level: LOG_LEVEL.INFO,
  prefix: 'Custom',
  logVariant: 'info'
});

// Log a message with the custom category
logger.custom('customCategory', 'This is a message from the custom category');
```