import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as express from 'express';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

export type AllowedMethods = 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);
  private readonly workerBaseUrl = process.env.WORKER_URL || 'http://localhost:3001';

  constructor(private readonly httpService: HttpService) {}

  async handleRerouting(method: AllowedMethods, req: express.Request, res: express.Response): Promise<void> {
    const TargetPath = req.originalUrl.replace(/^\/api/, '');
    const destinationUrl = `${this.workerBaseUrl}${TargetPath}`;

    this.logger.log(`Proxying incoming ${method} request out to target endpoint: ${destinationUrl}`);

    const requestId = (req.headers['x-request-id'] || req.header['X-REQUEST-ID']) as string;
    try {
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
      const axiosError = error as AxiosError;
      this.logger.error(`Network redirection breakdown failure across target: ${destinationUrl}`, axiosError.stack);
      
      res.status(502).json({
        success: false,
        message: 'Bad Gateway: Upstream worker node unreachable.',
      });
    }
  }
}