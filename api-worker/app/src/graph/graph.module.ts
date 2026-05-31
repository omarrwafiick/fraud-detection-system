import { Global, Module, OnApplicationShutdown } from '@nestjs/common';
import { GraphService } from './graph.service';
import neo4j, { Driver } from 'neo4j-driver';
import { GraphController } from './graph.controller';
export const NEO4J_DRIVER = 'NEO4J_DRIVER';

@Global()
@Module({
  providers: [
    {
      provide: NEO4J_DRIVER,
      useFactory: () => {
        return neo4j.driver(
          process.env.NEO4J_URI || 'bolt://localhost:7687',
          neo4j.auth.basic(
            process.env.NEO4J_USER || 'neo4j',
            process.env.NEO4J_PASSWORD || 'secure_password_2026'
          )
        );
      },
    },
    GraphService
  ],
  exports: [GraphService],
  controllers: [GraphController],
})
export class GraphModule implements OnApplicationShutdown {
  constructor(private readonly driver: Driver) {}
  
  async onApplicationShutdown() {
    await this.driver.close();
  }
}
