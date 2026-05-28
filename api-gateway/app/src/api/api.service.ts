import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
    async handleV1Calls(method: AllowedMethods, request: Request){

    }
}

type AllowedMethods = "POST" | "GET" | "PATCH" | "PUT" | "DELETE";