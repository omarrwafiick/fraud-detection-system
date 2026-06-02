import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { InternalTrafficGuard } from './common/guards/internal-traffic.guard';
import { WorkerExceptionFilter } from './common/filters/worker-exception.filter';
import { WorkerLoggingInterceptor } from './common/interceptors/workerLogging.interceptor';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './common/logger/logger.config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  });

  app.use(cookieParser());
  configLogger(app);
  configPipes(app);
  configFilters(app);
  configPrivateAccess(app);
  //configKafkaConsumer(app);

  const port = process.env.PORT || 3001;

  app.enableShutdownHooks();

  //await app.startAllMicroservices();
  await app.listen(port);
  
  const logger = new Logger('BOOTSTRAP');
  logger.log(`Api-Worker running as a hybrid engine on port: ${port}`);
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

function configPrivateAccess(app: INestApplication<any>){
  // Allow only access to gateway api
  app.useGlobalGuards(new InternalTrafficGuard());
  app.enableCors({
    origin: process.env.GATEWAY_ORIGIN || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
}

function configLogger(app: INestApplication<any>){
  app.useGlobalInterceptors(new WorkerLoggingInterceptor());
}

function configFilters(app: INestApplication<any>){
  app.useGlobalFilters(new WorkerExceptionFilter());
}

function configKafkaConsumer(app: INestApplication<any>){
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: 'fraud-worker-consumer-group',
        allowAutoTopicCreation: true,
      },
    },
  });
}

bootstrap();
