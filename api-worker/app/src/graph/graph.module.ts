import { Global, Module, OnApplicationShutdown, Inject } from '@nestjs/common';
import { GraphService } from './graph.service';
import neo4j, { Driver } from 'neo4j-driver';
import { GraphController } from './graph.controller';
import { NEO4J_DRIVER } from './constants/graph.constants';

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
  exports: [GraphService, NEO4J_DRIVER],
  controllers: [GraphController],
})
export class GraphModule implements OnApplicationShutdown {
  constructor(@Inject(NEO4J_DRIVER) private readonly driver: Driver) {} 
  
  async onApplicationShutdown() {
    await this.driver.close();
  }
}