import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TenantModule } from 'src/tenant/tenant.module';
import { Role } from './entities/roles.entity';
import { Permission } from './entities/permissions.entity';
import { UserRoles } from './entities/userRoles.pivot';
import { RolePermissions } from './entities/rolePermissions.pivot';
import { RBACService } from './services/rbac.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Role]),
    TypeOrmModule.forFeature([Permission]),
    TypeOrmModule.forFeature([UserRoles]),
    TypeOrmModule.forFeature([RolePermissions]),
    PassportModule, 
    JwtModule, 
    TenantModule
  ],
  providers: [AuthService, JwtStrategy, RBACService],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
