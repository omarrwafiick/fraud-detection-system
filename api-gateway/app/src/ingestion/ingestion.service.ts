import { Injectable } from '@nestjs/common';
import { EventsService } from '../events/events.service';

@Injectable()
export class IngestionService {
    constructor(private readonly eventsService: EventsService){}
}
