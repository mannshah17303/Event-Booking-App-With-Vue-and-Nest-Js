import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import * as bookingSchema from 'src/pipes/schemas/booking.schema';
import { BookingService } from 'src/services/booking.service';
import { Booking } from 'src/models/bookings.entity';
import { BookingPriceInterceptor } from 'src/interceptors/booking.price.interceptor';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('/addBooking')
  @UseInterceptors(BookingPriceInterceptor)
  async addBooking(
    @Body() createBookingDto: bookingSchema.CreateBookingDto,
  ): Promise<Booking> {
    try {
      const {
        user_id,
        event_id,
        booking_date,
        quantity,
        price_per_ticket,
        total_price,
      } = createBookingDto;
      return await this.bookingService.createBookings(
        user_id,
        event_id,
        booking_date,
        quantity,
        price_per_ticket,
        total_price,
      );
    } catch (err) {
      console.error(err);
      throw new BadRequestException('failed to create user');
    }
  }

  @Get('/getAllBookingEvents')
  async getAllBookingEvents(@Query('userId') user_id: string): Promise<any> {
    const bookingEvents = await this.bookingService.getAllBookingEvents(
      Number(user_id),
    );
    return { message: 'event fetched successful', data: bookingEvents };
  }

  @Get('/getBookedEventDetailsByEventId')
  async getBookedEventDetailsByEventId(
    @Query('eventId') event_id: string,
  ): Promise<any> {
    const bookingDetails =
      await this.bookingService.getBookedEventDetailsByEventId(
        Number(event_id),
      );
    return { message: 'event fetched successful', data: bookingDetails };
  }

  @Get('/getBookingsOfLoggedInUser')
  async getBookingsOfLoggedInUser(
    @Query('userId') user_id: string,
  ): Promise<any> {
    const bookingDetails = await this.bookingService.getBookingsOfLoggedInUser(
      Number(user_id),
    );
    return { message: 'event fetched successful', data: bookingDetails };
  }

  @Post('/updateRatings')
  updateBooking(
    @Body('rating') rating: { eventId: number; star: number },
    @Body('currentUserId') currentUserId: number,
  ) {
    return this.bookingService.updateBooking(
      rating.eventId,
      rating.star,
      currentUserId,
    );
  }

  @Delete('/removeBooking/:bookingToRemove')
  async removeBooking(
    @Param('bookingToRemove') bookingId: string,
  ): Promise<any> {
    return this.bookingService.removeBooking(Number(bookingId));
  }
}
