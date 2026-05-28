import { Controller, Delete, Get, Patch, Post, Put, Req } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
    constructor(private readonly apiService: ApiService){}

    @Post("v1")
    async handlePostRequests(@Req() request: Request){
        try {
            this.apiService.handleV1Calls("POST", request)
        } catch (error) {
            
        }
    }

    @Get("v1")
    async handleGetRequests(@Req() request: Request){
        try {
            this.apiService.handleV1Calls("GET", request)
        } catch (error) {
            
        }
    }
    
    @Put("v1")
    async handlePutRequests(@Req() request: Request){
        try {
            this.apiService.handleV1Calls("PUT", request)
        } catch (error) {
            
        }
    }

    @Patch("v1")
    async handlePatchRequests(@Req() request: Request){
        try {
            this.apiService.handleV1Calls("PATCH", request)
        } catch (error) {
            
        }
    }

    @Delete("v1")
    async handleDeleteRequests(@Req() request: Request){
        try {
            this.apiService.handleV1Calls("DELETE", request)
        } catch (error) {
            
        }
    }
}
