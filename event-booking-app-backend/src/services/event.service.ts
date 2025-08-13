import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../models/events.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}
  //for seeding initial data
  async createEvents(events: Partial<Event>[]): Promise<Event[]> {
    const createdEvents = this.eventRepository.create(events);
    return this.eventRepository.save(createdEvents);
  }
  async getEvents(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async getEventById(id: number): Promise<Event | null> {
    const event = await this.eventRepository.findOne({
      where: { event_id: id },
    });
    return event ?? null;
  }
}
