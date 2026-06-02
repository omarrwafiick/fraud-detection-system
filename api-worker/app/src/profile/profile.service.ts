import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileDto } from './dtos/profile.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}
    
    async getProfile(userId: number): Promise<ProfileDto> {
        const profile = await this.userRepository.findOne(
            {
                where: {
                    id: userId,
                },
                relations: {
                    tenant: true,
                }
            }
        );

        if(!profile){
            throw new NotFoundException("Profile was not found");
        }

        return {
            id: profile?.id,
            firstname: profile?.firstname,
            lastname: profile?.lastname,
            createdAt: profile?.createdAt,
            updatedAt: profile?.updatedAt,
            tenant: {
                name: profile?.tenant.name,
                webhookUrl: profile?.tenant.webhookUrl,
                createdAt: profile?.tenant.createdAt,
                updatedAt: profile?.tenant.updatedAt,
            }
        }
    }
}
