import {
  Controller,
  Get,
  NotFoundException,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { EventService } from '../services/event.service';
import { Event } from '../models/events.entity';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/')
  async getEvent(): Promise<{ message: string; data: Event[] }> {
    try {
      const events = await this.eventService.getEvents();
      return { message: 'fetched data successful', data: events };
    } catch (err) {
      console.error(err);
      throw new NotFoundException('cannot find events');
    }
  }

  @Get('/getEventDetailsByEventId')
  async getEventById(
    @Query('eventId', ParseIntPipe) id: number,
  ): Promise<{ message: string; data: Event | null }> {
    try {
      const event = await this.eventService.getEventById(id);
      return { message: 'fetched data successful', data: event };
    } catch (err) {
      console.error(err);
      throw new NotFoundException(`event with id ${id} not found`);
    }
  }
}
