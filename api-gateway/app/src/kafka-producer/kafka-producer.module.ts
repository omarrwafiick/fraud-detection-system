import { Module, Global } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.KAFKA_BROKER_NAME || 'KAFKA_FRAUD_PRODUCER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_BROKER_ID || 'fraud-gateway-producer',
            brokers: [process.env.KAFKA_BROKER_URL || 'localhost:9092'],
            connectionTimeout: 10000, // Drop the connection attempt after 10 seconds
            retry: {
              initialRetryTime: 300, // Wait 300ms before retrying a failed attempt
              retries: 8,            // Give it 8 solid back-off attempts before giving up
            },
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaProducerModule {}