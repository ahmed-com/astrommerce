import { ConsoleLogger, InternalServerErrorException } from '@nestjs/common';
import {appendFileSync} from 'fs';
import * as path from 'path'
// const path = require('path')

export class CustomLogger extends ConsoleLogger {
  private logger: ConsoleLogger;

  constructor(args?: any) {
    super(args);

    this.logger = new ConsoleLogger(args);
  }

  log(message: string, context?: string): void {
    this.logger.log(message);
    if(context && context === 'dev') return;

    const generalLogPath = path.join(
      __dirname,
      '..',
      path.sep,
      '..',
      path.sep,
      'logs',
      path.sep,
      'general.log'
    );

    try {
      appendFileSync(generalLogPath, message + '\n')
    } catch (err) {
      throw new InternalServerErrorException('The Logger Failed');
    }
  }

  error(message: string, context?: string): void {
    this.logger.error(message);
    if(context && context === 'dev') return;

    const errorLogPath = path.join(
      __dirname,
      '..',
      path.sep,
      '..',
      path.sep,
      'logs',
      path.sep,
      'error.log'
    );

    try {
      appendFileSync(errorLogPath, message + '\n')
    } catch (err) {
      throw new InternalServerErrorException('The Logger Failed');
    }
  }
}
