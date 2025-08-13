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

@Entity({ name: 'favorites' })
@Unique(['user_id', 'event_id'])
export class Favorite {
  @PrimaryGeneratedColumn()
  favorite_id: number;

  @Column({ nullable: true })
  user_id: number;

  @Column({ nullable: true })
  event_id: number;

  @ManyToOne(() => User, (user) => user.favorites, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Event, (event) => event.favorites, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
