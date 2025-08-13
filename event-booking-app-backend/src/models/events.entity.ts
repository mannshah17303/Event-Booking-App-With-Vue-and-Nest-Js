import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Favorite } from './favorites.entity';
import { Booking } from './bookings.entity';

@Entity({ name: 'events' })
export class Event {
  @PrimaryGeneratedColumn()
  event_id: number;

  @Column()
  event_title: string;

  @Column()
  event_date: string;

  @Column()
  event_location: string;

  @Column()
  event_description: string;

  @Column()
  price: number;

  @Column()
  image_url: string;

  @Column()
  ratings: number;

  @OneToMany(() => Favorite, (favorite) => favorite.event)
  favorites: Favorite[];

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];
}
