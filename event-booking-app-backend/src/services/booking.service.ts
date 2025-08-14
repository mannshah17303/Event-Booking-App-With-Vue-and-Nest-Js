import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from 'src/models/bookings.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}
  async createBookings(
    user_id: number,
    event_id: number,
    booking_date: Date,
    quantity: number,
    price_per_ticket: number,
    total_price: number,
  ): Promise<Booking> {
    const isEventAlreadyBooked = await this.bookingRepository.findOne({
      where: {
        user_id,
        event_id,
      },
    });
    if (isEventAlreadyBooked) {
      throw new Error('event is already booked');
    }
    const createdBooking = this.bookingRepository.create({
      user_id,
      event_id,
      booking_date,
      quantity,
      price_per_ticket,
      total_price,
    });

    return this.bookingRepository.save(createdBooking);
  }

  async getAllBookingEvents(user_id: number) {
    return this.bookingRepository.find({
      where: {
        user_id,
      },
      relations: ['event'],
    });
  }

  async getBookedEventDetailsByEventId(event_id: number) {
    return this.bookingRepository.findOne({
      where: {
        event_id,
      },
      relations: ['event'],
    });
  }

  async getBookingsOfLoggedInUser(user_id: number) {
    return this.bookingRepository.find({
      where: {
        user_id,
      },
      relations: ['event'],
    });
  }

  async updateBooking(eventId: number, star: number, currentUserId: number) {
    return this.bookingRepository.update(
      {
        event_id: eventId,
        user_id: currentUserId,
      },
      { ratings: star },
    );
  }

  async removeBooking(bookingId: number) {
    return this.bookingRepository.delete({
      booking_id: bookingId,
    });
  }
}
