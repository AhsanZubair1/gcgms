import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import chalk from 'chalk';
import { Format } from 'logform';
import { createLogger, format, transports } from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import TransportStream from 'winston-transport';

@Injectable()
export class LoggingsService {
  private logger: any;

  constructor(private configService: ConfigService) {
    this.initializeLogger();
  }

  private initializeLogger() {
    const dynamicLevelFormat = format((info) => {
      info.level = this.determineLogLevel(info.status, info.level);
      return info;
    });
    const nodeEnv = this.configService.getOrThrow('app.nodeEnv', {
      infer: true,
    });
    const transportsArray: TransportStream[] = [];

    if (nodeEnv === 'development') {
      transportsArray.push(this.createConsoleTransport());
    } else {
      transportsArray.push(this.createCloudWatchTransport());
    }

    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.json(),
        dynamicLevelFormat(),
      ),
      transports: transportsArray,
    });
  }

  private createConsoleTransport() {
    return new transports.Console({
      format: this.getConsoleFormat(),
    });
  }

  private getConsoleFormat(): Format {
    return format.combine(
      format.printf(
        ({
          timestamp,
          level,
          message,
          method,
          url,
          status,
          responseTime,
          correlationId,
          userId,
          requestBody,
          responseBody,
          clientIp,
          contentType,
          userAgent,
          appVersion,
          platform,
        }) => {
          const coloredItems = this.colorize(level, message, status);
          return `Time: [${chalk.gray(timestamp)}] → Level: ${coloredItems.level} → Method: ${chalk.blue(method)} → URL: ${url} → Message: ${coloredItems.message} → Status: ${coloredItems.status} → ResponseTime: (${responseTime}ms) → CorrelationId: ${correlationId} → ClientIp: ${clientIp} → ContentType: ${contentType} → UserAgent: ${userAgent} → AppVersion: ${appVersion} → Platform: ${platform} → UserId: ${userId} → Request: ${JSON.stringify(requestBody)} → Response: ${JSON.stringify(responseBody)}`;
        },
      ),
    );
  }

  private determineLogLevel(status, defaultLevel) {
    if (status >= 500) return 'error';
    if (status >= 400) return 'warn';
    return defaultLevel;
  }

  private colorize(level, message, status) {
    switch (level) {
      case 'error':
        return {
          level: chalk.red(level),
          message: chalk.red(message),
          status: chalk.red(status),
        };
      case 'warn':
        return {
          level: chalk.hex('#FFA500')(level), // orange-ish
          message: chalk.hex('#FFA500')(message),
          status: chalk.hex('#FFA500')(status),
        };
      case 'info':
        return {
          level: chalk.green(level),
          message: chalk.green(message),
          status: chalk.green(status),
        };
      case 'debug':
        return {
          level: chalk.blue(level),
          message: chalk.blue(message),
          status: chalk.blue(status),
        };
      default:
        return {
          level,
          message,
          status,
        };
    }
  }

  private createCloudWatchTransport() {
    return new WinstonCloudWatch({
      logGroupName: this.configService.get<string>('app.loggingGroup', {
        infer: true,
      }),
      logStreamName: this.configService.get<string>('app.loggingStream', {
        infer: true,
      }),
      awsRegion: this.configService.get<string>('app.loggingRegion', {
        infer: true,
      }),
      jsonMessage: true,
      ensureLogGroup: false,
    });
  }

  sanitizePayload(payload) {
    if (!payload || typeof payload !== 'object') return payload;

    const sensitiveFields = this.configService.get('app.maskedFields', {
      infer: true,
    });
    const sanitizedPayload = { ...payload };

    for (const field of sensitiveFields ?? []) {
      if (sanitizedPayload[field]) {
        sanitizedPayload[field] = '*****'; // Mask sensitive fields
      }
    }

    return sanitizedPayload;
  }

  getLogger() {
    return this.logger;
  }

  log(message: string | object, context?: string) {
    const formattedMessage =
      typeof message === 'string' ? message : JSON.stringify(message, null, 2);

    this.logger.info(formattedMessage, { context });
  }

  error(message: string | object, trace: string, context?: string) {
    const formattedMessage =
      typeof message === 'string' ? message : JSON.stringify(message, null, 2);
    this.logger.error(formattedMessage, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }
}
