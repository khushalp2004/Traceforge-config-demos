import { Injectable } from '@angular/core';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private currentLogLevel: LogLevel = LogLevel.DEBUG;

  constructor() {}

  debug(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.DEBUG, optionalParams);
  }

  info(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.INFO, optionalParams);
  }

  warn(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.WARN, optionalParams);
  }

  error(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.ERROR, optionalParams);
  }

  private writeToLog(msg: string, level: LogLevel, params: any[]) {
    if (level >= this.currentLogLevel) {
      const timestamp = new Date().toISOString();
      const prefix = `[${LogLevel[level]}] ${timestamp}:`;

      switch (level) {
        case LogLevel.DEBUG:
          console.debug(prefix, msg, ...params);
          break;
        case LogLevel.INFO:
          console.info(prefix, msg, ...params);
          break;
        case LogLevel.WARN:
          console.warn(prefix, msg, ...params);
          break;
        case LogLevel.ERROR:
          console.error(prefix, msg, ...params);
          break;
      }
    }
  }
}
