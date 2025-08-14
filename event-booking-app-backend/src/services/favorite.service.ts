import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from 'src/models/favorites.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}
  async createFavorites(event_id: number, user_id: number): Promise<Favorite> {
    const createdFavorite = this.favoriteRepository.create({
      user_id,
      event_id,
    });
    return this.favoriteRepository.save(createdFavorite);
  }

  async showRedColorInFavoriteEvents(user_id: number) {
    return this.favoriteRepository.find({
      where: {
        user_id,
      },
      relations: ['event'],
    });
  }

  async getAllFavoriteEvents(user_id: number) {
    return this.favoriteRepository.find({
      where: {
        user_id,
      },
      relations: ['event'],
    });
  }

  async removeFavorite(event_id: number, user_id: number) {
    return this.favoriteRepository.delete({
      event_id,
      user_id,
    });
  }
}
