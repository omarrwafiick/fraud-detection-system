import { Controller, Get, Header } from '@nestjs/common';
import { registry } from "./metrics/registry";

@Controller('monitoring')
export class MonitoringController {
    @Get("metrics")
    @Header("Content-Type", registry.contentType)
    async metrics() {
        return registry.metrics();
    }
}