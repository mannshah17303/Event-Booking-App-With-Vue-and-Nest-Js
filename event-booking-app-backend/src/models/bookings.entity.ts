import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Event } from './events.entity';

@Entity({ name: 'bookings' })
@Unique(['user_id', 'event_id'])
export class Booking {
  @PrimaryGeneratedColumn()
  booking_id: number;

  @Column({ nullable: true })
  user_id: number;

  @Column({ nullable: true })
  event_id: number;

  @Column()
  booking_date: Date;

  @Column()
  quantity: number;

  @Column()
  price_per_ticket: number;

  @Column()
  total_price: number;

  @Column({ default: 0 })
  ratings: number;

  @ManyToOne(() => User, (user) => user.bookings, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Event, (event) => event.bookings, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
