import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { logger } from './middlewares/user.middleware';
import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';
import { Event } from './models/events.entity';
import { Favorite } from './models/favorites.entity';
import { FavoriteController } from './controllers/favorite.controller';
import { FavoriteService } from './services/favorite.service';
import { Booking } from './models/bookings.entity';
import { BookingController } from './controllers/booking.controller';
import { BookingService } from './services/booking.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'mann17303',
      database: 'nestjs',
      entities: [User, Event, Favorite, Booking],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Event, Favorite, Booking]),
  ],
  controllers: [
    UserController,
    EventController,
    FavoriteController,
    BookingController,
  ],
  providers: [UserService, EventService, FavoriteService, BookingService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(logger)
      .forRoutes({ path: 'users', method: RequestMethod.POST });
  }
}
