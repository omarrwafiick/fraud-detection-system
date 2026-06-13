import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as util from 'util';

const devObjectFormatter = winston.format((info) => {
  const { message } = info;
  const metadata: Record<string, any> = {};
  for (const key of Object.keys(info)) {
    if (['timestamp', 'level', 'message', 'context', 'ms'].includes(key)) {
      continue;
    }
    if (key === 'stack' && Array.isArray(info[key]) && (info[key].length === 0 || !info[key][0])) {
      continue;
    }
    metadata[key] = info[key];
  }

  if (metadata.splat) delete metadata.splat;

  let cleanMessage = message;
  if (typeof message === 'string') {
    const jsonMatch = message.match(/(\{.*?\})/);
    if (jsonMatch) {
      try {
        const parsedJson = JSON.parse(jsonMatch[1]);
        const prettyJson = util.inspect(parsedJson, { 
          colors: true, 
          compact: false, 
          depth: null 
        });
        cleanMessage = message.replace(jsonMatch[1], `\n${prettyJson}`);
      } catch {
        // TODO
        // Fall back gracefully if it isn't valid JSON
      }
    }
  }
  
  info.message = cleanMessage;
  if (Object.keys(metadata).length > 0) {
    const coloredMetadata = util.inspect(metadata, {
      colors: true,
      compact: false,
      depth: null,
      breakLength: 80,
    });
    info.message = `${info.message}\n${coloredMetadata}`;
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