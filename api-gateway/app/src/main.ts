import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './common/logger/logger.config';
import { GatewayLoggingInterceptor } from './common/interceptors/gatewayLogging.interceptor';
import { GatewayExceptionFilter } from './common/filters/gateway-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  });

  configLogger(app);
  configPipes(app);
  configFilters(app);
  configPrivateAccess(app);

  const port = process.env.PORT || 3000;

  await app.listen(port);
  
  const logger = new Logger('BOOTSTRAP');
  logger.log(`Ingress Gateway successfully running on port: ${port}`);
}

function configPipes(app: INestApplication<any>){
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );
}

function configLogger(app: INestApplication<any>){
  app.useGlobalInterceptors(new GatewayLoggingInterceptor());
}

function configFilters(app: INestApplication<any>){
  app.useGlobalFilters(new GatewayExceptionFilter());
}

function configPrivateAccess(app: INestApplication<any>){
  // Allow access only to nginx (reverse proxy)
  app.enableCors({
    origin: process.env.GATEWAY_ORIGIN || 'http://localhost:80',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
}

bootstrap();