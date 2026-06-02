import { Controller, Get, Param, Req } from '@nestjs/common';
import { GraphService } from './graph.service';
import * as express from 'express';
import { IUser } from 'src/auth/interfaces/user.interface';

@Controller('graph')
export class GraphController {
    constructor(private readonly graphService:GraphService){}

    @Get("account/:accountId/network")
    async getAccountNetwork(
        @Req() request: express.Request,
        @Param() accountId: string,
    ){
        const tenantId = (request.user as IUser).tenantId;
        return await this.graphService.getAccountNetwork(tenantId, accountId);
    }
    //Commented this endpoint out as it can exhaust your Neo4j connection pool as user refresh the UI
    
    // @Get("account/:accountId/fraud/degrees")
    // async getDegreesOfSeparationFromFraud(
    //     @Req() request: express.Request,
    //     @Param() accountId: string,
    // ){
    //     const tenantId = (request.user as IUser).tenantId;
    //     return await this.graphService.getDegreesOfSeparationFromFraud(tenantId, accountId);
    // }

    @Get("device/:deviceId/shared-fingerprint")
    async getSharedFingerprintAccounts(
        @Req() request: express.Request,
        @Param() deviceId: string,
    ){
        const tenantId = (request.user as IUser).tenantId;
        return await this.graphService.getSharedFingerprintAccounts(tenantId, deviceId);
    }
}
