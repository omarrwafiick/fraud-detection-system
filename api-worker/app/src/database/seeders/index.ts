import { join } from 'path';
import { seedRolesAndPermissions } from './rbac.seeder';
import { DataSource } from 'typeorm';

if (require.main === module) {
  require('dotenv').config();

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'Hsa@AUFS32!R',
    database: process.env.DB_DATABASE || 'fraud_detection_db',
    entities: [
      join(__dirname, '/../../**/*.entity.ts'),
      join(__dirname, '/../../**/*.pivot.ts'),
    ], 
    synchronize: false,
  });
  console.log('🌱 Connecting to PostgreSQL container to initiate RBAC seeding...');

  dataSource
    .initialize()
    .then(async (initializedDataSource) => {
      console.log('🚀 Database connection established. Running transactional seeding patches...');
      
      await seedRolesAndPermissions(initializedDataSource);
      
      console.log('✨ seeding completed successfully!');
      await initializedDataSource.destroy();
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Critical breakdown during standalone seeding process:', error);
      process.exit(1);
    });
}