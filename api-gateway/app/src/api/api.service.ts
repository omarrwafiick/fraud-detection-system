import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as express from 'express';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

export type AllowedMethods = 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);

  private readonly versionTargetRegistry = {
    v1: process.env.WORKER_V1_URL || 'http://localhost:3001',
    // v2: process.env.WORKER_V2_URL || 'http://localhost:3002', 
  };

  constructor(private readonly httpService: HttpService) {}

  async handleRerouting(method: AllowedMethods, req: express.Request, res: express.Response): Promise<void> {
    let destinationUrl: string = '';
    try {
      const cleanUrl = req.originalUrl.replace(/^\/api\//, '');
      
      const urlParts = cleanUrl.split('?')[0].split('/');
      const version = urlParts[0];

      const remainingPath = cleanUrl.substring(version.length + 1); 

      if (!version || !this.versionTargetRegistry[version]) {
        throw new NotFoundException(`API version '${version}' is not actively supported by this Gateway instance.`);
      }

      const baseUrl = this.versionTargetRegistry[version].replace(/\/$/, '');
      destinationUrl = `${baseUrl}/${remainingPath}`;

      this.logger.log(`Proxying incoming ${method} request out to target version endpoint: ${destinationUrl}`);

      const requestId = (req.headers['x-request-id'] || req.header['X-REQUEST-ID']) as string;
      
      const responseStream = await firstValueFrom(
        this.httpService.request({
          method,
          url: destinationUrl,
          data: req.body,
          params: req.query,
          headers: {
            ...req.headers,
            'x-forwarded-by': 'fraud-api-gateway', 
            'x-request-id': requestId,
          },
          validateStatus: () => true,
        }),
      );

      res.status(responseStream.status).json(responseStream.data);

    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(error.getStatus()).json(error.getResponse());
        return;
      }

      const axiosError = error as AxiosError;
      this.logger.error(`Network redirection breakdown failure across target: ${destinationUrl}`, axiosError.stack);
      
      res.status(502).json({
        success: false,
        message: 'Bad Gateway: Upstream worker node unreachable for this version line.',
      });
    }
  }
}