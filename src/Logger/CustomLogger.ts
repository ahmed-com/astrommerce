import { ConsoleLogger, InternalServerErrorException } from '@nestjs/common';
import {appendFileSync , existsSync, writeFileSync} from 'fs';
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

    const fileName = context === 'prod' ? "general.log" : "general.test.log"
    const logMessage ='\n' + `${new Date(Date.now())} -> ${message}`;
    const generalLogPath = path.join(
      __dirname,
      '..',
      path.sep,
      '..',
      path.sep,
      'logs',
      path.sep,
      fileName
    );

    try {
      if(!existsSync(generalLogPath)){
        writeFileSync(generalLogPath,logMessage);
      }else{
        appendFileSync(generalLogPath,logMessage)
      }
    } catch (err) {
      throw new InternalServerErrorException('The Logger Failed');
    }
  }

  error(message: string, context?: string): void {
    this.logger.error(message);
    if(context && context === 'dev') return;
    
    const fileName = context === 'prod' ? "error.log" : "error.test.log"
    const logMessage = '\n' + `${new Date(Date.now())} -> ${message}` ;
    const errorLogPath = path.join(
      __dirname,
      '..',
      path.sep,
      '..',
      path.sep,
      'logs',
      path.sep,
      fileName
    );

    try {
      appendFileSync(errorLogPath, logMessage)
    } catch (err) {
      throw new InternalServerErrorException('The Logger Failed');
    }
  }
}
