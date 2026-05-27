import { Controller, Get, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from 'src/shared/guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tenant')
export class TenantController {
    constructor(private readonly tenantService: TenantService){}

    @Get("profile")
    async getProfile(){

    }
}
