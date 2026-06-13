import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as util from 'util';

const devObjectFormatter = winston.format((info) => {
  const { timestamp, level, message, context, ms, ...metadata } = info;
  if (Object.keys(metadata).length > 0) {
    const coloredMetadata = util.inspect(metadata, {
      colors: true,
      compact: false,
      depth: null,
      breakLength: 80,
    });
    info.message = `${message}\n${coloredMetadata}`;
  }
  return info;
});

export const loggerConfig = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        process.env.NODE_ENV === 'production'
          ? winston.format.json()
          : winston.format.combine(
              devObjectFormatter(),
              nestWinstonModuleUtilities.format.nestLike('FraudDetector', {
                colors: true,
                prettyPrint: false,
              }),
            ),
      ),
    }),
  ],
};