import { Controller, All, Req, Res, HttpCode, HttpStatus, Get, Param } from '@nestjs/common';
import * as express from 'express';
import { ApiService, AllowedMethods } from './api.service';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @All(':version/*path')
  @HttpCode(HttpStatus.OK)
  async handleIncomingRequests(
    @Req() req: express.Request,
    @Res() res: express.Response,
    @Param('version') version: string,
  ) {
    const method = req.method as AllowedMethods;
    return await this.apiService.handleRerouting(method, req, res);
  }
}