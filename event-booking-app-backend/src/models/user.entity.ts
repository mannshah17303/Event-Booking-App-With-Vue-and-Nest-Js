import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Favorite } from './favorites.entity';
import { Booking } from './bookings.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  role: string;

  @Column()
  password: string;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
