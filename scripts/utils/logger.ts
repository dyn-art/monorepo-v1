import chalk from 'chalk';

export class Logger {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  private log(message: string, options: { breaks?: number; args?: any[] }) {
    const { breaks = 1, args = [] } = options;
    console.log(
      `${chalk.cyan(`[${this.name}]`)} ${message}`,
      ...args,
      '\n'.repeat(breaks)
    );
  }

  info(message: string, options: { breaks?: number; args?: any[] } = {}) {
    this.log(`${chalk.cyan('→')} ${message}`, options);
  }

  success(message: string, options: { breaks?: number; args?: any[] } = {}) {
    this.log(`${chalk.green('✓')} ${message}`, options);
  }

  error(message: string, options: { breaks?: number; args?: any[] } = {}) {
    this.log(`${chalk.red('✗')} ${message}`, options);
  }
}
