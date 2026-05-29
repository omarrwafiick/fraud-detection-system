import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
//import { ConfigService } from '@nestjs/config';
import { BaseUserResponseDto, LoginUserDto } from './dtos/login.dto';
import * as express from 'express';
import { SignUpUserDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { CookieService } from 'src/common/cookies/cookie';
import { JwtService } from '@nestjs/jwt';
import { Tenant } from 'src/tenant/entities/tenant.entity';
import { TenantService } from 'src/tenant/tenant.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    private readonly ACCESS_TOKEN_NAME = 'access-token';
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
        private readonly tenantService: TenantService,
        //private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ){}

    async login(req: express.Request, res: express.Response, payload: LoginUserDto): Promise<BaseUserResponseDto> {
        const user = await this.repository.findOne({
            where: {
                email: payload.email
            }
        });

        if(!user){
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordCorrect = await this.comparePasswords(payload.password, user.passwordHash);

        if(!isPasswordCorrect){
            throw new UnauthorizedException('Invalid credentials');
        }

        let token = CookieService.get(this.ACCESS_TOKEN_NAME, req);

        if(!token){
            token = await this.generateToken(user);
            this.setTokenWithOptions(res, token!);
        }

        return {
            data: {
                role: user.role,
                firstname: user.firstname,
                lastname: user.lastname,
                tenantId: user.tenantId,
            },
            access_token: token,
        }
    }

    async signup(res: express.Response, payload: SignUpUserDto): Promise<BaseUserResponseDto> {
        const isUserExists = await this.repository.findAndCount({
            where: {
                email: payload.email,
            }
        });

        if(isUserExists[1] > 0){
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await this.hashPassword(payload.password);

        const newTenant = await this.tenantService.createNewTenant(
            { 
                name: payload.tenantName, 
                webHookUrl: payload.webhookUrl 
            }
        );

        const newUser = await this.repository.create({
            firstname: payload.firstname,
            lastname: payload.lastname,
            email: payload.email,
            passwordHash: hashedPassword,
            tenantId: newTenant.id,
        });

        await this.repository.save(newUser);

        return {
            data: {
                role: newUser.role,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                tenantId: newUser.tenantId,
            }
        }
    }

    async refreshToken(userId: number, res: express.Response): Promise<string> {
        this.removeToken(res);

        const user = await this.repository.findOne({
            where: {
                id: userId
            }
        }); 
        
        if(!user){
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = await this.generateToken(user);

        this.setTokenWithOptions(res, token);
        
        return token;
    }

    logout(res: express.Response): void{
        this.removeToken(res);
    }

    private async generateToken(user: User): Promise<string>{
        return await this.jwtService.signAsync({
            roles: [user.role],
            tenantId: user.tenantId,
            id: user.id,
            email: user.email,
        });
    }

    private async removeToken(res: express.Response){
        CookieService.remove(this.ACCESS_TOKEN_NAME, res)
    }

    private async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
    }

    private async comparePasswords(password: string, hashed: string){
        return await bcrypt.compare(password, hashed);
    }

    private setTokenWithOptions(res: express.Response, token: string){
        CookieService.set(
            this.ACCESS_TOKEN_NAME, 
            token,
            res,
            {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            },
        );
    }
}


