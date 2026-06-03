import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { BaseUserResponseDto, LoginUserDto } from './dtos/login.dto';
import { SignUpUserDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TenantService } from 'src/tenant/tenant.service';
import { RBACService } from './services/rbac.service';
import { UserRoleWithPermissions } from './types/rbac.types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly tenantService: TenantService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    private readonly rbacService: RBACService,
  ) {}

  async validateUserCredentials(payload: LoginUserDto): Promise<BaseUserResponseDto> {
    const user = await this.repository.findOne({ where: { email: payload.email } });

    if (!user){
        this.logger.error(`Wrong email for email ${payload.email}`);
        throw new UnauthorizedException('Invalid security credentials provided.');
    }

    const isPasswordCorrect = await this.comparePasswords(payload.password, user.passwordHash);

    if (!isPasswordCorrect){
        this.logger.error(`Wrong password for user with email ${payload.email}`);
        throw new UnauthorizedException('Invalid security credentials provided.');
    }

    const userRoles = await this.rbacService.getUserRolesWithPermissions(user.id);

    const token = await this.generateToken(user, this.rbacService.formatRolesWithPermissions(userRoles));
    
    return { user, token };
  }

  async signup(payload: SignUpUserDto): Promise<BaseUserResponseDto> {
    const emailExists = await this.repository.existsBy({ email: payload.email });

    if (emailExists){
        throw new ConflictException('This email address is already registered');
    }

    return await this.dataSource.transaction(async (entityManager) => {
      const newTenant = await this.tenantService.createNewTenant(
        { name: payload.tenantName, webHookUrl: payload.webhookUrl },
        entityManager
      );

      const hashedPassword = await this.hashPassword(payload.password);

      const userRepo = entityManager.getRepository(User);

      const newUser = userRepo.create({
        firstname: payload.firstname,
        lastname: payload.lastname,
        email: payload.email,
        
        passwordHash: hashedPassword,
        tenantId: newTenant.id,
      });

      const savedUser = await userRepo.save(newUser);

      if (!savedUser){
        throw new ConflictException('Failed to create user account, please try again later');
      }

      const savedRoles = await this.rbacService.addUserToDefaultRole(savedUser.id, entityManager);

      if(!savedRoles){
        throw new ConflictException("User roles failed to be created");
      }
      
      return {
        user: {
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          tenantId: newUser.tenantId,
        },
      };
    });
  }

  async refreshUserSession(userId: number): Promise<string> {
    const user = await this.repository.findOne({ where: { id: userId } });

    if (!user){
      throw new UnauthorizedException('Session refresh rejected.');
    }

    const userRoles = await this.rbacService.getUserRolesWithPermissions(user.id);

    return await this.generateToken(user, this.rbacService.formatRolesWithPermissions(userRoles));
  }

  private async generateToken(
    user: User, 
    roleAndPermissions: UserRoleWithPermissions[]
  ): Promise<string> {
    return this.jwtService.signAsync({
      roles: [...roleAndPermissions],
      tenantId: user.tenantId,
      sub: user.id,
      email: user.email,
    });
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private comparePasswords(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }
}