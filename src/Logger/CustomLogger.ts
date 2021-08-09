import { ConsoleLogger, InternalServerErrorException } from '@nestjs/common';
import { appendFileSync, existsSync, writeFileSync } from 'fs';
import * as path from 'path';

export class CustomLogger extends ConsoleLogger {
  private logger: ConsoleLogger;
  public context: string;
  private timestamp: boolean;
  private stage: string;

  constructor(
    context: string,
    options: { timestamp?: boolean; stage: string } = {
      timestamp: true,
      stage: 'dev',
    },
  ) {
    super(context,options);

    this.logger = new ConsoleLogger(context,options);
    this.context = context;
    this.timestamp = options.timestamp;
    this.stage = options.stage
  }

  log(message: string): void {
    this.logger.log(message);

    if (this.stage === 'dev') return;

    const fileName = this.stage === 'prod' ? 'general.log' : 'general.test.log';
    const logMessage = '\n' + `[${this.context}] - ${new Date(Date.now())} -> ${message}`;
    const generalLogPath = path.join(
      __dirname,
      '..',
      path.sep,
      '..',
      path.sep,
      'logs',
      path.sep,
      fileName,
    );

    try {
      if (!existsSync(generalLogPath)) {
        writeFileSync(generalLogPath, logMessage);
      } else {
        appendFileSync(generalLogPath, logMessage);
      }
    } catch (err) {
      throw new InternalServerErrorException('The Logger Failed');
    }
  }

  error(message: string, stack: string): void {
    this.logger.error(message,stack);
    if (this.stage === 'dev') return;

    const fileName = this.stage === 'prod' ? 'error.log' : 'error.test.log';
    const logMessage = '\n' + `[${this.context}] - ${new Date(Date.now())} -> ${message} -> ${stack}`;
    const errorLogPath = path.join(
      __dirname,
      '..',
      path.sep,
      '..',
      path.sep,
      'logs',
      path.sep,
      fileName,
    );

    try {
      appendFileSync(errorLogPath, logMessage);
    } catch (err) {
      throw new InternalServerErrorException('The Logger Failed');
    }
  }
}
