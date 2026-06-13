import { Global, Module, OnApplicationShutdown, Inject, OnModuleInit, Logger } from '@nestjs/common';
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
export class GraphModule implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(GraphModule.name);
  constructor(@Inject(NEO4J_DRIVER) private readonly driver: Driver) {} 
  
  async onModuleInit() {
    const session = this.driver.session();
    try {
      await session.run('RETURN 1');
      this.logger.log('Graph Database: Neo4j handshaked and authenticated successfully.');
    } catch (error: any) {
      this.logger.error('================================================================');
      this.logger.error('❌ CRITICAL ERROR: Neo4j authentication handshake failed!');
      this.logger.error(`Reason: ${error.message}`);
      this.logger.error('Please verify process.env.NEO4J_PASSWORD matches your compose stack.');
      this.logger.error('================================================================');
      process.exit(1);
    } finally {
      await session.close();
    }
  }

  async onApplicationShutdown() {
    await this.driver.close();
  }
}