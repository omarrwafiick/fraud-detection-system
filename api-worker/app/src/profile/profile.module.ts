import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { User } from 'src/auth/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([User])],
  providers: [ProfileService],
  controllers: [ProfileController]
})
export class ProfileModule {}
